// Busca en Open Library la tapa de la PRIMERA edición de cada libro (correr después de
// portadas.ts y revisar-portadas.ts).
//
//   npx tsx prisma/catalogo/primeras-ediciones.ts [--lotes=arte,moda] [--rehacer]
//
// Para cada libro con año y editorial de 1.ª edición cargados: encuentra la obra (mismo
// criterio de título + apellido que portadas.ts), recorre sus ediciones y se queda con una
// que tenga tapa, se haya publicado ese año y por esa editorial (y cuya imagen no esté vacía).
// Escribe primeras-ediciones.json: { "título|autor": idDePortada | null }.
// Sin editorial cargada no se intenta: el año solo no alcanza (traducciones del mismo año).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { lotes } from "./index";
import { medidas } from "./revisar-portadas";
import type { LibroSemilla } from "./tipos";

const ARCHIVO = join(__dirname, "primeras-ediciones.json");
const UA = { headers: { "User-Agent": "catalogo-portadas/1.0" } };

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tituloBase = (t: string) =>
  normalizar(t.replace(/\(.*?\)/g, "").split(/[:.]/)[0]).replace(/^(the|a|an|la|le|el|les|los|las|il|lo|der|die|das|l) /, "");

// "Alfred A. Knopf" ~ "Knopf", "Éditions Gallimard" ~ "Gallimard": alguna palabra
// significativa de nuestra editorial tiene que aparecer en la de Open Library.
const VACIAS = new Set(["the", "and", "of", "de", "la", "le", "les", "editions", "edition", "editorial", "verlag", "press", "publishing", "publishers", "books", "inc", "ltd", "co", "company", "sons"]);
const palabras = (s: string) => normalizar(s).split(" ").filter((p) => p.length > 2 && !VACIAS.has(p));
export function mismaEditorial(nuestra: string, deOL: string): boolean {
  const ol = new Set(palabras(deOL));
  return palabras(nuestra).some((p) => ol.has(p));
}

const anioDe = (fecha?: string) => Number(fecha?.match(/\b(1[4-9]\d\d|20\d\d)\b/)?.[1] ?? NaN);

interface Edicion {
  publish_date?: string;
  publishers?: string[];
  covers?: number[];
}

async function obra(l: LibroSemilla): Promise<string | null> {
  const primerAutor = l.autor.split(/,| y | e /)[0].trim();
  const apellido = normalizar(primerAutor.split(" ").at(-1) ?? primerAutor);
  const url = `https://openlibrary.org/search.json?${new URLSearchParams({
    title: l.titulo.replace(/\(.*?\)/g, "").split(":")[0].trim(),
    author: apellido,
    fields: "key,title,author_name",
    limit: "10",
  })}`;
  const res = await fetch(url, UA);
  if (!res.ok) throw new Error(String(res.status));
  const { docs } = (await res.json()) as { docs: { key: string; title: string; author_name?: string[] }[] };
  const nuestro = tituloBase(l.titulo);
  const d = (docs ?? []).find(
    (d) => tituloBase(d.title) === nuestro && (d.author_name ?? []).some((a) => normalizar(a).split(" ").includes(apellido)),
  );
  return d?.key ?? null;
}

// Solo descarta imágenes vacías. La forma no se filtra: muchos libros de fotografía y
// arte son cuadrados o apaisados de verdad (las formas raras se revisan en PORTADAS.md).
async function tieneImagen(id: number): Promise<boolean> {
  const res = await fetch(`https://covers.openlibrary.org/b/id/${id}-M.jpg`, UA);
  const m = res.ok ? medidas(new Uint8Array(await res.arrayBuffer())) : null;
  return !!m && m.ancho >= 20 && m.alto >= 20;
}

async function buscar(l: LibroSemilla): Promise<number | null> {
  const clave = await obra(l);
  if (!clave) return null;
  const res = await fetch(`https://openlibrary.org${clave}/editions.json?limit=500`, UA);
  if (!res.ok) throw new Error(String(res.status));
  const { entries } = (await res.json()) as { entries: Edicion[] };
  const candidatas = (entries ?? []).filter(
    (e) =>
      anioDe(e.publish_date) === l.anio &&
      (e.publishers ?? []).some((p) => mismaEditorial(l.editorial!, p)) &&
      (e.covers ?? []).some((c) => c > 0),
  );
  for (const e of candidatas) {
    for (const c of e.covers!.filter((c) => c > 0)) {
      if (await tieneImagen(c)) return c;
    }
  }
  return null;
}

async function main() {
  const previas: Record<string, number | null> = existsSync(ARCHIVO) ? JSON.parse(readFileSync(ARCHIVO, "utf8")) : {};
  const filtro = process.argv.find((a) => a.startsWith("--lotes="))?.slice(8).split(",");
  const rehacer = process.argv.includes("--rehacer");
  const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const guardar = () => writeFileSync(ARCHIVO, JSON.stringify(previas, null, 2) + "\n");

  for (const [nombre, lote] of Object.entries(lotes)) {
    if (filtro && !filtro.includes(nombre)) continue;
    let encontradas = 0;
    let errores = 0;
    for (const l of lote) {
      const k = `${l.titulo}|${l.autor}`;
      if (l.imagen?.startsWith("/") || l.anio == null || !l.editorial) continue; // imagen propia o sin datos de 1.ª ed.
      if (!rehacer && k in previas) continue;
      try {
        previas[k] = await buscar(l);
        if (previas[k]) encontradas += 1;
      } catch {
        errores += 1; // no se guarda: se reintenta la próxima vez
      }
      await pausa(700);
    }
    guardar();
    console.log(`lote ${nombre.padEnd(16)} ${lote.length} libros · primeras ediciones con tapa ${encontradas} · errores ${errores}`);
  }
  console.log(`\nTotal: ${Object.values(previas).filter(Boolean).length} tapas de 1.ª edición en ${ARCHIVO}`);
}

if (require.main === module) main();
