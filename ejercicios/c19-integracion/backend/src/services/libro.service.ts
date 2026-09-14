import { prisma } from "../config/prisma";
import { LibroConAutor, LibroDetalle } from "../types/libro.types";
import { LibroCreate, LibroUpdate } from "../validations/libro.validation";

// Listado: cada libro con su autor, en una sola consulta.
export async function findAll(disponible?: boolean): Promise<LibroConAutor[]> {
  return prisma.libro.findMany({
    where: disponible === undefined ? {} : { disponible },
    include: { autor: true },
    orderBy: { id: "asc" },
  });
}

// Detalle: el autor Y las categorías.
export async function findById(id: number): Promise<LibroDetalle | null> {
  return prisma.libro.findUnique({
    where: { id },
    include: { autor: true, categorias: true },
  });
}

export async function create(datos: LibroCreate): Promise<LibroDetalle> {
  return prisma.libro.create({
    data: datos,
    include: { autor: true, categorias: true },
  });
}

// Si el libro no existe, Prisma lanza P2025 → el errorHandler responde 404.
export async function update(id: number, datos: LibroUpdate): Promise<LibroDetalle> {
  return prisma.libro.update({
    where: { id },
    data: datos,
    include: { autor: true, categorias: true },
  });
}

export async function remove(id: number): Promise<void> {
  await prisma.libro.delete({ where: { id } });
}
