import { Prisma } from "../generated/prisma/client";

// Lo que sale del select del registro y de GET /auth/yo: nunca el passwordHash.
export type UsuarioPublico = Prisma.UsuarioGetPayload<{
  select: { id: true; email: true; nombre: true; rol: true };
}>;
