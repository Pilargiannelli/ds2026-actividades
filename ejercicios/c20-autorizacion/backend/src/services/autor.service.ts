import { prisma } from "../config/prisma";
import { Autor, AutorConLibros } from "../types/autor.types";
import { AutorCreate, AutorUpdate } from "../validations/autor.validation";

export async function findAll(): Promise<Autor[]> {
  return prisma.autor.findMany({ orderBy: { id: "asc" } });
}

export async function findById(id: number): Promise<AutorConLibros | null> {
  return prisma.autor.findUnique({
    where: { id },
    include: { libros: true },
  });
}

export async function create(datos: AutorCreate): Promise<Autor> {
  return prisma.autor.create({ data: datos });
}

// P2025 si no existe → errorHandler responde 404.
export async function update(id: number, datos: AutorUpdate): Promise<Autor> {
  return prisma.autor.update({ where: { id }, data: datos });
}

// P2025 si no existe → 404. P2003 si tiene libros (onDelete: Restrict) → 409.
export async function remove(id: number): Promise<void> {
  await prisma.autor.delete({ where: { id } });
}
