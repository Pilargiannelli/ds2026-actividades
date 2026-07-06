import { z } from "zod";

export const libroSchema = z.object({
  titulo: z.string().trim().min(2, "El título debe tener al menos 2 caracteres."),
  autor: z.string().trim().min(2, "El autor debe tener al menos 2 caracteres."),
  precio: z.coerce
    .number({ error: "El precio debe ser un número." })
    .positive("El precio debe ser mayor a 0."),
  disponible: z.boolean(),
});

export type LibroValidado = z.infer<typeof libroSchema>;
