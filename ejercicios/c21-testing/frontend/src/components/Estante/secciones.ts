import type { Categoria, Libro } from "../../types/libro";

// Una sección = un estante. Se arman solas a partir de los datos: una categoría con
// `orden` es un estante. Sumar libros o categorías no requiere tocar componentes.
export interface Seccion {
  id: string; // slug para el ancla (#arquitectura)
  nombre: string;
  libros: Libro[];
}

const OTROS = "Otros títulos";

export function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// La categoría del estante: la de menor orden. Sin ninguna con orden → null.
export function categoriaDeEstante(libro: Libro): Categoria | null {
  let mejor: Categoria | null = null;
  for (const c of libro.categorias ?? []) {
    if (c.orden == null) continue;
    if (!mejor || c.orden < (mejor.orden ?? Infinity)) mejor = c;
  }
  return mejor;
}

// Cada libro va a un único estante; los libros sin categoría de estante van al final.
export function agruparEnSecciones(libros: Libro[]): Seccion[] {
  const porCategoria = new Map<number, { categoria: Categoria; libros: Libro[] }>();
  const sinEstante: Libro[] = [];

  for (const libro of libros) {
    const categoria = categoriaDeEstante(libro);
    if (!categoria) {
      sinEstante.push(libro);
      continue;
    }
    const grupo = porCategoria.get(categoria.id) ?? { categoria, libros: [] };
    grupo.libros.push(libro);
    porCategoria.set(categoria.id, grupo);
  }

  const secciones: Seccion[] = [...porCategoria.values()]
    .sort((a, b) => (a.categoria.orden ?? 0) - (b.categoria.orden ?? 0))
    .map(({ categoria, libros }) => ({ id: slug(categoria.nombre), nombre: categoria.nombre, libros }));

  if (sinEstante.length > 0) secciones.push({ id: slug(OTROS), nombre: OTROS, libros: sinEstante });
  return secciones;
}
