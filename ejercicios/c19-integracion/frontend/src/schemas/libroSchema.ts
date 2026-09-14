import { z } from "zod";

// Alineado con backend/src/validations/libro.validation.ts (libroCreateSchema):
// el alta necesita el autorId, no el nombre del autor.
export const libroSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio."),
  precio: z.coerce
    .number({ error: "El precio debe ser un número." })
    .positive("El precio debe ser mayor a 0."),
  imagen: z.string().trim().min(1, "La imagen es obligatoria."),
  autorId: z.coerce.number({ error: "Elegí un autor." }).positive("Elegí un autor."),
  disponible: z.boolean(),
});

export type LibroValidado = z.infer<typeof libroSchema>;
