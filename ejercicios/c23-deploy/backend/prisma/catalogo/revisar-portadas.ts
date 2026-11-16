// Revisión de las portadas de Open Library (correr después de portadas.ts).
//
//   npx tsx prisma/catalogo/revisar-portadas.ts
//
// 1. Mide cada portada. Descarta solo las imágenes vacías y las excluidas a mano (abajo).
//    La forma NO se descarta: muchos libros de fotografía y arte son cuadrados o apaisados
//    de verdad (Eggleston, Shore, Goldin). Las formas raras van a la lista para revisar.
// 2. Escribe PORTADAS.md con lo que conviene mirar a mano: formas raras (puede ser una caja
//    de CD o un recorte) y libros que Open Library encontró con otro año (puede ser otra obra).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ARCHIVO = join(__dirname, "portadas.json");
const INFORME = join(__dirname, "PORTADAS.md");
// Fuera de este rango la imagen se marca para revisar (no se descarta).
const PROPORCION_MIN = 0.45;
const PROPORCION_MAX = 0.85;

// Revisadas a mano: no son la tapa del libro. Se dejan sin portada.
const EXCLUIDAS: Record<string, string> = {
  "Manuale tipografico|Giambattista Bodoni": "caja de CD-ROM (edición digital de Octavo), no un libro",
};

const urlPortada = (id: number, tamano: "S" | "M" | "L" = "L") => `https://covers.openlibrary.org/b/id/${id}-${tamano}.jpg`;

// Ancho y alto leyendo solo la cabecera del archivo (JPEG o PNG).
export function medidas(buf: Uint8Array): { ancho: number; alto: number } | null {
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    const v = new DataView(buf.buffer, buf.byteOffset);
    return { ancho: v.getUint32(16), alto: v.getUint32(20) };
  }
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marca = buf[i + 1];
    const largo = (buf[i + 2] << 8) | buf[i + 3];
    // SOF0–SOF15, salvo DHT (C4), JPG (C8) y DAC (CC): ahí están las dimensiones.
    if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) {
      return { alto: (buf[i + 5] << 8) | buf[i + 6], ancho: (buf[i + 7] << 8) | buf[i + 8] };
    }
    i += 2 + largo;
  }
  return null;
}

interface Verificado {
  titulo: string;
  autor: string;
  anio: number | null;
  estado: string;
  anioOpenLibrary?: number | null;
  tituloOpenLibrary?: string;
}

async function main() {
  const portadas: Record<string, number | null> = JSON.parse(readFileSync(ARCHIVO, "utf8"));
  const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const descartadas: { clave: string; id: number; motivo: string }[] = [];
  const formaRara: { clave: string; id: number; motivo: string }[] = [];
  let errores = 0;

  for (const [clave, id] of Object.entries(portadas)) {
    if (!id) continue;
    if (EXCLUIDAS[clave]) {
      descartadas.push({ clave, id, motivo: EXCLUIDAS[clave] });
      continue;
    }
    try {
      const res = await fetch(urlPortada(id, "M"), { headers: { "User-Agent": "catalogo-portadas/1.0" } });
      const m = res.ok ? medidas(new Uint8Array(await res.arrayBuffer())) : null;
      if (!m) {
        errores += 1;
        continue;
      }
      const proporcion = m.ancho / m.alto;
      if (m.ancho < 20 || m.alto < 20) descartadas.push({ clave, id, motivo: `imagen vacía (${m.ancho}×${m.alto})` });
      else if (proporcion > PROPORCION_MAX) formaRara.push({ clave, id, motivo: `cuadrada o apaisada (${proporcion.toFixed(2)})` });
      else if (proporcion < PROPORCION_MIN) formaRara.push({ clave, id, motivo: `muy angosta (${proporcion.toFixed(2)})` });
    } catch {
      errores += 1;
    }
    await pausa(150);
  }

  for (const d of descartadas) portadas[d.clave] = null;
  writeFileSync(ARCHIVO, JSON.stringify(portadas, null, 2) + "\n");

  // Libros con portada cuyo año en Open Library no coincide con la primera edición cargada.
  const verificacion = JSON.parse(readFileSync(join(__dirname, "verificacion.json"), "utf8")) as { resultados: Verificado[] };
  const dudosas = verificacion.resultados.filter((r) => r.estado === "anio-distinto" && portadas[`${r.titulo}|${r.autor}`]);

  const fila = (titulo: string, autor: string, id: number, extra: string) =>
    `| ${titulo.replace(/\|/g, "\\|")} | ${autor} | [ver](${urlPortada(id)}) | ${extra} |`;
  const conPortada = Object.values(portadas).filter(Boolean).length;

  const md = [
    "# Portadas del catálogo",
    "",
    `Generado por \`revisar-portadas.ts\` (${new Date().toISOString().slice(0, 10)}).`,
    "",
    "Las portadas vienen de Open Library: son tapas reales, pero de **alguna edición disponible**,",
    "no necesariamente de la primera (que es la que figura en año y editorial). Por eso la ficha",
    "las rotula como «Portada de una edición disponible · Open Library».",
    "",
    "| | Libros |",
    "|---|---:|",
    `| Con portada de Open Library | ${conPortada} |`,
    `| Buscados sin coincidencia confiable o descartados (portada provisional) | ${Object.keys(portadas).length - conPortada} |`,
    `| Descartados (imagen vacía o excluidos a mano) | ${descartadas.length} |`,
    "",
    "Para sacar una portada equivocada: sumarla a `EXCLUIDAS` en `revisar-portadas.ts`, volver a correrlo",
    "y correr el seed (o borrar la imagen del libro desde la app). `null` no se vuelve a buscar.",
    "",
    `## Forma poco común, para mirar (${formaRara.length})`,
    "",
    "Se mantienen: casi siempre son libros cuadrados o apaisados de verdad (fotolibros, monografías).",
    "Conviene mirarlas por si alguna es una caja de CD, un recorte o una foto del objeto.",
    "",
    "| Título | Autor | Portada | Forma |",
    "|---|---|---|---|",
    ...formaRara.map((d) => {
      const [titulo, autor] = d.clave.split("|");
      return fila(titulo, autor, d.id, d.motivo);
    }),
    "",
    `## Año distinto en Open Library, para revisar (${dudosas.length})`,
    "",
    "Open Library encontró estos libros con otro año: la tapa puede ser de una reedición (lo más común)",
    "o de otra obra con el mismo título.",
    "",
    "| Título | Autor | Portada | Año cargado / Open Library |",
    "|---|---|---|---|",
    ...dudosas.map((r) => fila(r.titulo, r.autor, portadas[`${r.titulo}|${r.autor}`]!, `${r.anio ?? "—"} / ${r.anioOpenLibrary ?? "—"}`)),
    "",
    `## Descartadas (${descartadas.length})`,
    "",
    "| Título | Autor | Portada | Motivo |",
    "|---|---|---|---|",
    ...descartadas.map((d) => {
      const [titulo, autor] = d.clave.split("|");
      return fila(titulo, autor, d.id, d.motivo);
    }),
    "",
  ].join("\n");
  writeFileSync(INFORME, md);

  console.log(
    `Descartadas: ${descartadas.length} · forma rara: ${formaRara.length} · año distinto: ${dudosas.length} · errores de descarga: ${errores}`,
  );
  console.log(`Informe: ${INFORME}`);
}

if (require.main === module) main();
