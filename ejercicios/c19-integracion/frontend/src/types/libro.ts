// La forma real que manda el backend (ver backend/src/types/libro.types.ts).
// El mock aplanaba el autor a un string; la API manda el objeto de la relación.
export interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

// Lo que devuelve GET /api/libros (lista): el autor, sin categorías.
export interface Libro {
  id: number;
  titulo: string;
  precio: number;
  imagen: string;
  disponible: boolean;
  autorId: number;
  autor: Autor;
  categorias?: Categoria[]; // solo viene en GET /api/libros/:id
}

// Lo que manda POST /api/libros: autorId, no el nombre del autor.
export interface NuevoLibro {
  titulo: string;
  precio: number;
  imagen: string;
  autorId: number;
  disponible?: boolean;
}
