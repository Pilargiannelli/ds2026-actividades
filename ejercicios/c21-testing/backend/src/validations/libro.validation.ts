import { z } from "zod";

export const libroCreateSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio").max(200),
  precio: z.number().int().positive("El precio debe ser mayor a 0"),
  // Sin imagen (o null): el front muestra una portada provisional.
  imagen: z.string().trim().min(1, "La imagen no puede estar vacía").nullable().optional(),
  disponible: z.boolean().optional(), // el default lo pone Prisma (@default(true))
  autorId: z.number().int().positive("El autor es obligatorio"),
  anio: z.number().int().min(1400).max(new Date().getFullYear() + 1).optional(),
  editorial: z.string().trim().min(1).max(200).optional(),
  descripcion: z.string().trim().min(1).max(2000).optional(),
});

// Para actualizar: los mismos campos, todos opcionales.
export const libroUpdateSchema = libroCreateSchema.partial();

export type LibroCreate = z.infer<typeof libroCreateSchema>;
export type LibroUpdate = z.infer<typeof libroUpdateSchema>;
