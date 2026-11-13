// La forma real que manda el backend (ver backend/src/types/libro.types.ts).
// El mock aplanaba el autor a un string; la API manda el objeto de la relación.
export interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string | null; // null = no verificada
}

export interface Categoria {
  id: number;
  nombre: string;
  orden?: number | null; // con orden = la categoría es un estante del catálogo
}

// Lo que devuelve GET /api/libros: el autor y las categorías (ordenadas por orden).
export interface Libro {
  id: number;
  titulo: string;
  precio: number;
  imagen: string | null; // null = sin portada real (se muestra una provisional)
  disponible: boolean;
  anio?: number | null; // año de la primera edición
  editorial?: string | null; // editorial de la primera edición
  descripcion?: string | null;
  generos?: string[]; // géneros o subgéneros dentro de la categoría (puede estar vacío)
  autorId: number;
  autor: Autor;
  categorias?: Categoria[];
}

// Lo que manda POST /api/libros: autorId, no el nombre del autor.
export interface NuevoLibro {
  titulo: string;
  precio: number;
  imagen: string;
  autorId: number;
  disponible?: boolean;
}
