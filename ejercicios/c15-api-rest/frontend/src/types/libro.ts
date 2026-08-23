export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  img?: string;
  precio?: number;
  disponible?: boolean;
}

export interface NuevoLibro {
  titulo: string;
  autor: string;
  precio: number;
  disponible: boolean;
}
