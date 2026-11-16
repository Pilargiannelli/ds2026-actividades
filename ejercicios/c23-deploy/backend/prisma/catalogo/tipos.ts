// Tipos y ayudas del catálogo. Los datos viven en un archivo por disciplina;
// los componentes del front los muestran sin saber cuántos hay.

export interface CategoriaSemilla {
  nombre: string;
  orden?: number; // con orden = sección/estante del catálogo
}

export interface AutorSemilla {
  nombre: string;
  nacionalidad: string | null; // null = no verificada: no se inventa
}

export interface LibroSemilla {
  titulo: string;
  autor: string;
  anio?: number | null; // año de la PRIMERA edición; null = sin verificar
  editorial?: string | null; // editorial de la PRIMERA edición; null = sin verificar
  descripcion?: string;
  cats: string[];
  generos?: string[]; // géneros o subgéneros dentro de la categoría; vacío si no hay certeza
  imagen?: string;
  precio?: number;
  disponible?: boolean;
}

// Una fila de lote: [título, autor, año de 1.ª edición, editorial de 1.ª edición, géneros].
// Año y editorial solo cuando se conocen con certeza; si no, null (queda vacío).
// Géneros: los del vocabulario de la categoría (ver generos.ts), separados por "|".
export type Fila = readonly [titulo: string, autor: string, anio?: number | null, editorial?: string | null, generos?: string];

// Un lote = los libros de una disciplina. Agregar libros = agregar filas.
export function lote(categoria: string, filas: readonly Fila[]): LibroSemilla[] {
  return filas.map(([titulo, autor, anio = null, editorial = null, generos = ""]) => ({
    titulo,
    autor,
    anio,
    editorial,
    cats: [categoria],
    generos: generos ? generos.split("|").map((g) => g.trim()) : [],
  }));
}

// El precio es un dato de la tienda, no bibliográfico. Para los libros nuevos se usa
// un precio de referencia estable (mismo título → mismo precio) hasta cargar el real.
export function precioDeReferencia(titulo: string): number {
  let h = 0;
  for (const c of titulo) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  return 18000 + (h % 57) * 500; // $18.000 – $46.000
}
