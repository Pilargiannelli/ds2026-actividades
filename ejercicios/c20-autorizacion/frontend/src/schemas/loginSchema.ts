import { z } from "zod";

// El login NO valida fortaleza de contraseña: solo pregunta si el campo está.
// Si mañana el registro exige más caracteres, los usuarios viejos no quedan
// afuera del login.
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Email inválido")),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginValidado = z.infer<typeof loginSchema>;
