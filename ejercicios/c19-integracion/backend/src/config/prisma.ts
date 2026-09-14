import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// El adapter es el driver: el que realmente habla TCP con PostgreSQL.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Una sola instancia para toda la app: abre un pool de conexiones y lo reusa.
export const prisma = new PrismaClient({
  adapter,
  omit: { usuario: { passwordHash: true } }, // ← seguro por defecto: hay que pedirlo explícito
});
