// El schema es la única fuente de verdad. Acá sólo le ponemos el nombre corto.
import { Prisma } from "../generated/prisma/client";

export type { AutorModel as Autor } from "../generated/prisma/models";

// El detalle de un autor con todos sus libros.
export type AutorConLibros = Prisma.AutorGetPayload<{ include: { libros: true } }>;
