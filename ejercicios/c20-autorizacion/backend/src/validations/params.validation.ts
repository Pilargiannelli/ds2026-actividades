import { z } from "zod";

// Todo lo que viene en la URL es string: z.coerce lo convierte antes de validar.
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un número positivo"),
});

export type IdParam = z.infer<typeof idParamSchema>;
