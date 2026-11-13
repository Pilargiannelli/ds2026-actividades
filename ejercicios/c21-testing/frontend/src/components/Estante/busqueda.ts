import type { Libro } from "../../types/libro";
import { categoriaDeEstante } from "./secciones";

// Búsqueda y filtros del catálogo: puros, sin DOM (se testean en busqueda.test.ts).
// El índice se arma una sola vez por catálogo; filtrar es un recorrido lineal sobre
// cadenas ya normalizadas, así escala a miles de libros sin trabar el tipeo.

export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export interface Entrada {
  libro: Libro;
  texto: string; // título, autor, editorial, año, categorías y géneros, normalizados
  categoria: string | null; // la del estante
  orden: number; // orden del estante (para listar categorías)
  generos: readonly string[];
}

export type Orden = "titulo-asc" | "titulo-desc" | "autor-asc" | "anio-desc" | "anio-asc";

export const ORDENES: { valor: Orden; etiqueta: string }[] = [
  { valor: "titulo-asc", etiqueta: "Título A–Z" },
  { valor: "titulo-desc", etiqueta: "Título Z–A" },
  { valor: "autor-asc", etiqueta: "Autor A–Z" },
  { valor: "anio-desc", etiqueta: "Más recientes" },
  { valor: "anio-asc", etiqueta: "Más antiguos" },
];

export interface Filtros {
  texto: string;
  categoria: string | null; // null = todas las categorías
  genero: string | null; // null = todos los géneros
  orden: Orden;
}

export const SIN_FILTROS: Filtros = { texto: "", categoria: null, genero: null, orden: "titulo-asc" };

// El orden no es un filtro: "Limpiar filtros" no lo toca.
export const hayFiltros = (f: Filtros) => f.texto.trim() !== "" || f.categoria !== null || f.genero !== null;

// Comparación para castellano: ignora acentos y mayúsculas (sensitivity "base"), la ñ va
// entre la n y la o, y los números se ordenan de forma natural ("101" antes que "2666").
// Orden palabra por palabra ("A Game…" antes que "Adán…"): los espacios cuentan; solo se
// descartan los signos iniciales como "¿", "¡", «» o comillas.
const colador = new Intl.Collator("es", { sensitivity: "base", numeric: true });
const sinSignosIniciales = (t: string) => t.replace(/^[^\p{L}\p{N}]+/u, "");
export const compararTexto = (a: string, b: string) => colador.compare(sinSignosIniciales(a), sinSignosIniciales(b));

// Orden real y dinámico. Los registros sin el dato del criterio (autor o año) van al
// final; los empates se resuelven por título y después por id: el orden es estable.
export function ordenar(libros: Libro[], orden: Orden): Libro[] {
  const porTitulo = (a: Libro, b: Libro) => compararTexto(a.titulo, b.titulo) || a.id - b.id;
  const faltaAlFinal = (a: unknown, b: unknown) => (a == null || a === "" ? 1 : 0) - (b == null || b === "" ? 1 : 0);

  const comparar: Record<Orden, (a: Libro, b: Libro) => number> = {
    "titulo-asc": porTitulo,
    "titulo-desc": (a, b) => compararTexto(b.titulo, a.titulo) || a.id - b.id,
    "autor-asc": (a, b) =>
      faltaAlFinal(a.autor?.nombre, b.autor?.nombre) || compararTexto(a.autor?.nombre ?? "", b.autor?.nombre ?? "") || porTitulo(a, b),
    "anio-desc": (a, b) => faltaAlFinal(a.anio, b.anio) || (b.anio ?? 0) - (a.anio ?? 0) || porTitulo(a, b),
    "anio-asc": (a, b) => faltaAlFinal(a.anio, b.anio) || (a.anio ?? 0) - (b.anio ?? 0) || porTitulo(a, b),
  };
  return [...libros].sort(comparar[orden]);
}

export function indexar(libros: Libro[]): Entrada[] {
  return libros.map((libro) => {
    const estante = categoriaDeEstante(libro);
    return {
      libro,
      categoria: estante?.nombre ?? null,
      orden: estante?.orden ?? Infinity,
      generos: libro.generos ?? [],
      texto: normalizar(
        [
          libro.titulo,
          libro.autor.nombre,
          libro.editorial,
          libro.anio,
          ...(libro.categorias ?? []).map((c) => c.nombre),
          ...(libro.generos ?? []),
        ]
          .filter(Boolean)
          .join(" · "),
      ),
    };
  });
}

// Intersección: el libro tiene que cumplir la búsqueda (todos los términos), la
// categoría y el género a la vez.
export function filtrar(indice: Entrada[], f: Filtros): Libro[] {
  const terminos = normalizar(f.texto).split(/\s+/).filter(Boolean);
  const resultado: Libro[] = [];
  for (const e of indice) {
    if (f.categoria && e.categoria !== f.categoria) continue;
    if (f.genero && !e.generos.includes(f.genero)) continue;
    if (!terminos.every((t) => e.texto.includes(t))) continue;
    resultado.push(e.libro);
  }
  return ordenar(resultado, f.orden);
}

export interface OpcionGenero {
  nombre: string;
  cantidad: number;
}

export interface GrupoGeneros {
  categoria: string;
  generos: OpcionGenero[];
}

// Categorías con estante, en el orden del catálogo.
export function categoriasDelIndice(indice: Entrada[]): { nombre: string; cantidad: number }[] {
  const mapa = new Map<string, { orden: number; cantidad: number }>();
  for (const e of indice) {
    if (!e.categoria) continue;
    const previo = mapa.get(e.categoria) ?? { orden: e.orden, cantidad: 0 };
    previo.cantidad += 1;
    mapa.set(e.categoria, previo);
  }
  return [...mapa]
    .sort((a, b) => a[1].orden - b[1].orden)
    .map(([nombre, { cantidad }]) => ({ nombre, cantidad }));
}

// Géneros disponibles, agrupados por categoría. Con una categoría elegida, solo los suyos:
// si se elige Literatura no aparecen géneros de Gastronomía.
export function generosDisponibles(indice: Entrada[], categoria: string | null): GrupoGeneros[] {
  const porCategoria = new Map<string, Map<string, number>>();
  for (const e of indice) {
    if (!e.categoria || (categoria && e.categoria !== categoria)) continue;
    const generos = porCategoria.get(e.categoria) ?? new Map<string, number>();
    for (const g of e.generos) generos.set(g, (generos.get(g) ?? 0) + 1);
    porCategoria.set(e.categoria, generos);
  }
  return categoriasDelIndice(indice)
    .filter((c) => porCategoria.get(c.nombre)?.size)
    .map((c) => ({
      categoria: c.nombre,
      generos: [...porCategoria.get(c.nombre)!]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([nombre, cantidad]) => ({ nombre, cantidad })),
    }));
}
