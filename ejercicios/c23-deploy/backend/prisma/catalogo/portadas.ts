// Busca portadas en Open Library para los libros que no tienen imagen propia.
//
//   npx tsx prisma/catalogo/portadas.ts [--lotes=arte,moda] [--rehacer]
//
// Escribe prisma/catalogo/portadas.json: { "título|autor": idDePortada | null }.
// null = se buscó y no hubo una coincidencia confiable (no se vuelve a buscar salvo --rehacer).
// Criterio: el título de Open Library tiene que coincidir con el nuestro (sin subtítulo ni
// artículos) y el apellido del autor tiene que figurar entre sus autores. Si no, sin portada:
// mejor la portada provisional que la tapa de otro libro.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { lotes } from "./index";
import type { LibroSemilla } from "./tipos";

const ARCHIVO = join(__dirname, "portadas.json");

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Título comparable: sin lo que va entre paréntesis, sin subtítulo y sin artículo inicial.
const tituloBase = (t: string) =>
  normalizar(t.replace(/\(.*?\)/g, "").split(/[:.]/)[0]).replace(/^(the|a|an|la|le|el|les|los|las|il|lo|der|die|das|l) /, "");

export const clavePortada = (l: { titulo: string; autor: string }) => `${l.titulo}|${l.autor}`;

interface Doc {
  title: string;
  author_name?: string[];
  cover_i?: number;
}

async function buscar(l: LibroSemilla): Promise<number | null | "error"> {
  const primerAutor = l.autor.split(/,| y | e /)[0].trim();
  const apellido = normalizar(primerAutor.split(" ").at(-1) ?? primerAutor);
  const url = `https://openlibrary.org/search.json?${new URLSearchParams({
    title: l.titulo.replace(/\(.*?\)/g, "").split(":")[0].trim(),
    author: apellido,
    fields: "title,author_name,cover_i",
    limit: "10",
  })}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "catalogo-portadas/1.0" } });
    if (!res.ok) return "error";
    const { docs } = (await res.json()) as { docs: Doc[] };
    const nuestro = tituloBase(l.titulo);
    const elegido = (docs ?? []).find(
      (d) =>
        d.cover_i &&
        tituloBase(d.title) === nuestro &&
        (d.author_name ?? []).some((a) => normalizar(a).split(" ").includes(apellido)),
    );
    return elegido?.cover_i ?? null;
  } catch {
    return "error";
  }
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
      const k = clavePortada(l);
      if (l.imagen || (!rehacer && k in previas)) continue; // ya tiene imagen propia o ya se buscó
      const r = await buscar(l);
      if (r === "error") errores += 1; // no se guarda: se reintenta la próxima vez
      else {
        previas[k] = r;
        if (r) encontradas += 1;
      }
      await pausa(700); // de a una consulta, sin saturar el servicio
    }
    guardar(); // al terminar cada lote: si se corta, no se pierde lo hecho
    console.log(`lote ${nombre.padEnd(16)} ${lote.length} libros · portadas nuevas ${encontradas} · errores ${errores}`);
  }
  const total = Object.values(previas).filter(Boolean).length;
  console.log(`\nPortadas en ${ARCHIVO}: ${total} de ${Object.keys(previas).length} buscadas`);
}

if (require.main === module) main();
