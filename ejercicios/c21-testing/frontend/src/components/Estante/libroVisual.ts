// Lógica pura del estante: medidas de cada lomo, colores y tamaño del libro abierto.
// Sin DOM: se testea en libroVisual.test.ts.

// Proporción ancho/alto de una portada cuando todavía no sabemos la real.
export const PROPORCION_DEFAULT = 0.66;

// Hash entero estable: el mismo id da siempre el mismo lomo (alto, grosor, estilo),
// así el estante no cambia entre recargas.
export function hash(n: number): number {
  let x = Math.imul(n + 0x9e3779b9, 0x85ebca6b) >>> 0;
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
}

// Hash de texto (FNV-1a): la misma editorial da siempre el mismo "estilo de casa".
export function hashTexto(texto: string): number {
  let h = 0x811c9dc5;
  for (const c of texto.toLowerCase()) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0;
  return hash(h);
}

export interface Medidas {
  alto: number; // px en escritorio
  grosor: number; // px en escritorio
}

// Rango de altos (px) por disciplina: no tenemos el formato real de cada libro, pero las
// monografías de arte y fotografía suelen ser más altas que los ensayos de tipografía o
// las revistas. Es una aproximación visual, no un dato bibliográfico.
const FORMATOS: Record<string, readonly [number, number]> = {
  Arquitectura: [238, 332],
  "Diseño gráfico": [224, 318],
  Arte: [248, 342],
  Fotografía: [250, 345],
  Moda: [252, 345],
  "Diseño industrial": [226, 314],
  Tipografía: [206, 292],
  "Editorial y publicaciones independientes": [204, 330],
  Literatura: [206, 258],
};
const FORMATO_DEFAULT = [236, 324] as const;

// Alto y grosor determinísticos (el mismo libro da siempre el mismo lomo). El grosor se
// sesga hacia lomos finos, como en una biblioteca real; las revistas son más finas aún.
export function medidasDelLomo(id: number, categoria?: string | null): Medidas {
  const h = hash(id);
  const [min, max] = (categoria && FORMATOS[categoria]) || FORMATO_DEFAULT;
  const r1 = (h % 1000) / 1000;
  const r2 = ((h >>> 10) % 1000) / 1000;
  const factor = categoria === "Editorial y publicaciones independientes" ? 0.72 : 1;
  return {
    alto: Math.round(min + r1 * (max - min)),
    grosor: Math.round((20 + 44 * r2 ** 1.7) * factor),
  };
}

export type EstiloLomo = "solido" | "papel" | "imagen" | "tela" | "banda" | "filete";
export type Tipografia = "serif" | "sans" | "serif-italica" | "condensada" | "mono";
export type Orientacion = "descendente" | "ascendente";

const ESTILOS_CASA: EstiloLomo[] = ["solido", "papel", "tela", "banda", "filete", "solido", "papel"];
const TIPOGRAFIAS: Tipografia[] = ["serif", "sans", "serif-italica", "condensada", "mono", "serif", "sans"];

// Estilo de casa: los libros de una misma editorial comparten tipografía, orientación del
// título y familia de colores (como en un estante real). Sin editorial, cada libro el suyo.
export function casaDelLibro(libro: { id: number; editorial?: string | null }): number {
  return libro.editorial ? hashTexto(libro.editorial.trim()) : hash(libro.id + 7919);
}

// Colores de reserva (libros sin portada, o mientras carga): tonos de tela, papel y
// cartón de encuadernación. Son una representación provisional, no el color real del libro.
const RESERVA = [
  "#e6e1d6", "#2e3034", "#a8513a", "#7c8875", "#c7b28a", "#3b4862", "#d9d4ca", "#1f4d3f",
  "#b8a99a", "#8c2f2b", "#e9c46a", "#4a4e69", "#d4cfc4", "#5c6b73", "#c96f4a", "#f1ede4",
  "#26323f", "#9aa58c", "#6d4c41", "#b7c4cf", "#dcb8a4", "#33312e",
];

export function colorDeReserva(id: number, casa: number = hash(id)): string {
  // Cada casa usa 4 tonos de la paleta; cada libro toma uno de ellos.
  const inicio = casa % RESERVA.length;
  const paso = 1 + ((casa >>> 8) % 5);
  return RESERVA[(inicio + paso * (hash(id) % 4)) % RESERVA.length];
}

function canal(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function hexARgb(hex: string): [number, number, number] {
  const limpio = hex.replace("#", "");
  const n = parseInt(limpio.length === 3 ? limpio.replace(/./g, "$&$&") : limpio, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbAHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

// Luminancia relativa WCAG (0 = negro, 1 = blanco).
export function luminancia(hex: string): number {
  const [r, g, b] = hexARgb(hex);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

// Tinta clara u oscura según cuál contrasta más con el fondo.
// 0.179 es el punto donde el contraste contra negro y contra blanco se igualan.
export function colorDeTexto(fondo: string): string {
  return luminancia(fondo) > 0.179 ? "#1c1b19" : "#f6f3ec";
}

// Color dominante de una franja de píxeles RGBA (la que viene de canvas.getImageData).
// Agrupa en cubos de 16 niveles por canal y premia la saturación: un lomo toma el color
// "con carácter" de la portada, no el gris promedio.
export function colorDominante(px: ArrayLike<number>): string | null {
  const cubos = new Map<number, { r: number; g: number; b: number; n: number; peso: number }>();

  for (let i = 0; i + 3 < px.length; i += 4) {
    if (px[i + 3] < 128) continue; // transparente
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturacion = max === 0 ? 0 : (max - min) / max;
    const clave = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);

    const cubo = cubos.get(clave) ?? { r: 0, g: 0, b: 0, n: 0, peso: 0 };
    cubo.r += r;
    cubo.g += g;
    cubo.b += b;
    cubo.n += 1;
    cubo.peso += 1 + saturacion * 1.5;
    cubos.set(clave, cubo);
  }

  let mejor: { r: number; g: number; b: number; n: number; peso: number } | null = null;
  for (const cubo of cubos.values()) {
    if (!mejor || cubo.peso > mejor.peso) mejor = cubo;
  }
  if (!mejor) return null;
  return rgbAHex(mejor.r / mejor.n, mejor.g / mejor.n, mejor.b / mejor.n);
}

// El sello al pie del lomo: la inicial de la editorial (como en los lomos reales).
// Sin editorial, el de la librería.
export function selloEditorial(editorial: string | null | undefined): string {
  const nombre = (editorial ?? "").replace(/^(The|Éditions|Editions|Editorial|Verlag des)\s+/i, "").trim();
  return nombre ? nombre[0].toUpperCase() : "C";
}

export interface Apariencia {
  estilo: EstiloLomo;
  tipografia: Tipografia;
  orientacion: Orientacion;
  base: string; // color del libro (tapa, contratapa)
  fondo: string; // fondo del lomo
  tinta: string; // título en el lomo
  acento: string; // autor en el lomo
  banda: string; // segundo color (bandas y filetes)
}

export function aparienciaDelLibro(
  libro: { id: number; editorial?: string | null },
  portada: { estado: "cargando" | "ok" | "error"; color: string | null },
): Apariencia {
  const casa = casaDelLibro(libro);
  const propio = hash(libro.id);
  const base = portada.color ?? colorDeReserva(libro.id, casa);
  const banda = colorDeReserva(libro.id + 1, casa);
  const tipografia = TIPOGRAFIAS[(casa >>> 4) % TIPOGRAFIAS.length];
  const orientacion: Orientacion = (casa >>> 12) % 3 === 0 ? "ascendente" : "descendente";

  // La mayoría sigue el estilo de su casa; algunos títulos se apartan (otra colección).
  let estilo = (propio >>> 20) % 4 === 0 ? "solido" : ESTILOS_CASA[(casa >>> 16) % ESTILOS_CASA.length];
  // Con portada real, la mitad usa el borde de la imagen como lomo.
  if (portada.estado === "ok" && (propio >>> 24) % 2 === 0) estilo = "imagen";

  const comun = { estilo, tipografia, orientacion, base, banda };

  if (estilo === "papel") {
    // Lomo de papel con el color del libro en la tipografía (como un catálogo de museo).
    const tinta = luminancia(base) < 0.3 ? base : "#2b2a27";
    return { ...comun, fondo: "#f3f0e9", tinta, acento: luminancia(base) < 0.45 ? base : tinta };
  }
  if (estilo === "tela" && luminancia(base) < 0.12) {
    // Tela oscura con título estampado en dorado.
    return { ...comun, fondo: base, tinta: "#d6c08a", acento: "#c9b37d" };
  }

  const tinta = colorDeTexto(base);
  return { ...comun, fondo: base, tinta, acento: tinta };
}

export interface TamanoAbierto {
  W: number; // ancho de UNA tapa (el libro abierto mide 2W)
  H: number;
  movil: boolean;
}

// Tamaño del libro en primer plano. En escritorio entra la doble página completa;
// en pantallas chicas la página derecha (la ficha) ocupa casi todo el ancho.
export function tamanoAbierto(vw: number, vh: number, proporcion: number): TamanoAbierto {
  const ratio = Math.min(0.85, Math.max(0.5, proporcion || PROPORCION_DEFAULT));

  if (vw < 768) {
    const W = Math.min(vw - 40, 440);
    // Con la proporción real de la portada: sin deformarla ni recortarla.
    const H = Math.min(W / ratio, vh - 180); // deja lugar a la barra, el índice y Cerrar
    return { W: Math.round(W), H: Math.round(Math.max(H, 320)), movil: true };
  }

  let H = Math.min(vh * 0.8, vh - 190, 700); // debajo de la barra, el índice y Cerrar
  let W = H * ratio;
  const maxW = (vw - 120) / 2;
  if (W > maxW) {
    W = maxW;
    H = W / ratio;
  }
  // La ficha necesita un mínimo de ancho para ser legible.
  W = Math.max(W, 300);
  return { W: Math.round(W), H: Math.round(H), movil: false };
}
