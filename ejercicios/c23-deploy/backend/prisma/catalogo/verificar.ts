// Verificador del catálogo, por lotes.
//
//   npx tsx prisma/catalogo/verificar.ts                 → controles estructurales
//   npx tsx prisma/catalogo/verificar.ts --openlibrary [--lotes=literatura,gastronomia]
//                                                        → además, contrasta cada libro
//                                                          con Open Library y escribe
//                                                          prisma/catalogo/verificacion.json
//
// Estructural: campos obligatorios, años plausibles, duplicados (título + autor, y títulos
// casi iguales del mismo autor) y cantidades por categoría.
// Open Library: confirma que exista una obra con ese título y ese autor, y compara el año
// de primera publicación. No reemplaza a un catálogo de biblioteca: marca lo que hay que mirar.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { vocabulario } from "./generos";
import { categorias, libros, lotes } from "./index";
import type { LibroSemilla } from "./tipos";

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const clave = (l: LibroSemilla) => `${normalizar(l.titulo)}|${normalizar(l.autor)}`;

// ---------- 1. Estructura ----------
const problemas: string[] = [];
const vistos = new Map<string, string>();
const porTituloSinArticulo = new Map<string, LibroSemilla>();
const categoriasValidas = new Set(categorias.map((c) => c.nombre));
const anioActual = new Date().getFullYear();

for (const [nombreLote, lote] of Object.entries(lotes)) {
  for (const l of lote) {
    const id = `[${nombreLote}] «${l.titulo}» — ${l.autor}`;
    if (!l.titulo.trim() || !l.autor.trim()) problemas.push(`${id}: título o autor vacío`);
    if (l.anio != null && (l.anio < 1400 || l.anio > anioActual)) problemas.push(`${id}: año fuera de rango (${l.anio})`);
    for (const c of l.cats) if (!categoriasValidas.has(c)) problemas.push(`${id}: categoría inexistente «${c}»`);
    const permitidos = new Set(l.cats.flatMap((c) => vocabulario[c] ?? []));
    for (const g of l.generos ?? []) if (!permitidos.has(g)) problemas.push(`${id}: género «${g}» fuera del vocabulario de su categoría`);

    const k = clave(l);
    if (vistos.has(k)) problemas.push(`${id}: DUPLICADO de ${vistos.get(k)}`);
    vistos.set(k, id);

    // casi duplicados: mismo autor y título igual salvo artículos/subtítulo
    const corto = `${normalizar(l.titulo).replace(/^(the|a|an|la|le|el|les|los|las) /, "").split(" ").slice(0, 4).join(" ")}|${normalizar(l.autor)}`;
    const previo = porTituloSinArticulo.get(corto);
    const esTomo = (t: string) => /(^|[^a-z])(vol(ume)?|tomo|band)([^a-z]|$)/i.test(t);
    if (previo && clave(previo) !== k && !(esTomo(previo.titulo) && esTomo(l.titulo))) problemas.push(`${id}: posible variante de «${previo.titulo}»`);
    porTituloSinArticulo.set(corto, l);
  }
}

const porCategoria = new Map<string, number>();
for (const l of libros) {
  const principal = categorias
    .filter((c) => c.orden != null && l.cats.includes(c.nombre))
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))[0];
  const nombre = principal?.nombre ?? "(sin estante)";
  porCategoria.set(nombre, (porCategoria.get(nombre) ?? 0) + 1);
}

console.log(`\nLibros en el catálogo: ${libros.length} (${vistos.size} únicos por título + autor)`);
console.table(Object.fromEntries([...porCategoria].map(([k, v]) => [k, { libros: v }])));
console.log(`Sin año: ${libros.filter((l) => l.anio == null).length} · sin editorial: ${libros.filter((l) => !l.editorial).length} · sin género: ${libros.filter((l) => !l.generos?.length).length}`);
if (problemas.length) {
  console.log(`\n${problemas.length} problema(s) estructurales:`);
  problemas.forEach((p) => console.log(" - " + p));
} else {
  console.log("\nEstructura OK: sin duplicados, sin campos obligatorios vacíos, años plausibles.");
}

// ---------- 2. Open Library (opcional) ----------
interface Resultado {
  lote: string;
  titulo: string;
  autor: string;
  anio: number | null;
  estado: "confirmado" | "anio-distinto" | "no-encontrado" | "error";
  anioOpenLibrary?: number | null;
  tituloOpenLibrary?: string;
}

async function consultar(l: LibroSemilla): Promise<Omit<Resultado, "lote">> {
  // El apellido del primer autor alcanza para desambiguar y tolera "A y B".
  const primerAutor = l.autor.split(/,| y | e /)[0].trim();
  const apellido = primerAutor.split(" ").at(-1) ?? primerAutor;
  const tituloBusqueda = l.titulo.replace(/\(.*?\)/g, "").split(":")[0].trim();
  const url = `https://openlibrary.org/search.json?${new URLSearchParams({
    title: tituloBusqueda,
    author: apellido,
    fields: "title,author_name,first_publish_year",
    limit: "5",
  })}`;
  const base = { titulo: l.titulo, autor: l.autor, anio: l.anio ?? null };
  try {
    const res = await fetch(url, { headers: { "User-Agent": "catalogo-verificacion/1.0" } });
    if (!res.ok) return { ...base, estado: "error" };
    const { docs } = (await res.json()) as { docs: { title: string; first_publish_year?: number }[] };
    if (!docs?.length) return { ...base, estado: "no-encontrado" };
    // El año más temprano entre las obras encontradas (Open Library a veces separa ediciones).
    const anios = docs.map((d) => d.first_publish_year).filter((a): a is number => typeof a === "number");
    const anioOL = anios.length ? Math.min(...anios) : null;
    if (l.anio != null && anioOL != null && Math.abs(anioOL - l.anio) > 1) {
      return { ...base, estado: "anio-distinto", anioOpenLibrary: anioOL, tituloOpenLibrary: docs[0].title };
    }
    return { ...base, estado: "confirmado", anioOpenLibrary: anioOL, tituloOpenLibrary: docs[0].title };
  } catch {
    return { ...base, estado: "error" };
  }
}

async function verificarEnOpenLibrary() {
  const resultados: Resultado[] = [];
  const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const filtro = process.argv.find((a) => a.startsWith("--lotes="))?.slice(8).split(",");
  const elegidos = Object.entries(lotes).filter(([n]) => !filtro || filtro.includes(n));
  for (const [nombreLote, lote] of elegidos) {
    let i = 0;
    for (const l of lote) {
      resultados.push({ lote: nombreLote, ...(await consultar(l)) });
      i += 1;
      await pausa(700); // de a una consulta, sin saturar el servicio
    }
    const delLote = resultados.filter((r) => r.lote === nombreLote);
    const n = (e: Resultado["estado"]) => delLote.filter((r) => r.estado === e).length;
    console.log(
      `lote ${nombreLote.padEnd(16)} ${String(i).padStart(3)} libros · confirmados ${n("confirmado")} · año distinto ${n("anio-distinto")} · no encontrados ${n("no-encontrado")} · errores ${n("error")}`,
    );
  }
  // Se combina con el informe anterior: solo se reemplazan los lotes verificados ahora.
  const salida = join(__dirname, "verificacion.json");
  let previos: Resultado[] = [];
  try {
    previos = (JSON.parse(readFileSync(salida, "utf8")) as { resultados: Resultado[] }).resultados;
  } catch {
    previos = [];
  }
  const reemplazados = new Set(elegidos.map(([n]) => n));
  const todos = [...previos.filter((r) => !reemplazados.has(r.lote)), ...resultados];
  writeFileSync(salida, JSON.stringify({ fecha: new Date().toISOString(), resultados: todos }, null, 2));
  console.log(`\nInforme: ${salida}`);
}

if (process.argv.includes("--openlibrary")) {
  verificarEnOpenLibrary();
}
