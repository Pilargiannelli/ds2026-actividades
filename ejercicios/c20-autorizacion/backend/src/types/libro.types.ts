// El schema es la única fuente de verdad. Acá sólo le ponemos el nombre corto
// y describimos la forma que sale de cada consulta con include.
import { Prisma } from "../generated/prisma/client";

export type { LibroModel as Libro } from "../generated/prisma/models";
export type { CategoriaModel as Categoria } from "../generated/prisma/models";

// El listado: cada libro con su autor.
export type LibroConAutor = Prisma.LibroGetPayload<{ include: { autor: true } }>;

// El detalle: el autor Y las categorías.
export type LibroDetalle = Prisma.LibroGetPayload<{
  include: { autor: true; categorias: true };
}>;
