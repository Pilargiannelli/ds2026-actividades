import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, SALT_ROUNDS } from "../config/env";
import { prisma } from "../config/prisma";
import { UsuarioPublico } from "../types/auth.types";
import { Login, Registro } from "../validations/auth.validation";

export async function registrar(datos: Registro): Promise<UsuarioPublico> {
  const passwordHash = await bcrypt.hash(datos.password, SALT_ROUNDS);
  // Si el email ya existe, Prisma tira P2002 y el errorHandler lo traduce a 409.
  return prisma.usuario.create({
    data: { nombre: datos.nombre, email: datos.email, passwordHash },
    select: { id: true, email: true, nombre: true, rol: true }, // nunca el hash
  });
}

export async function login(datos: Login) {
  const usuario = await prisma.usuario.findUnique({
    where: { email: datos.email },
    omit: { passwordHash: false }, // el omit global lo esconde: acá lo necesito para comparar
  });
  if (!usuario) return null;

  const coincide = await bcrypt.compare(datos.password, usuario.passwordHash);
  if (!coincide) return null; // ← mismo return que arriba: no delatar si el mail existe

  const payload = { id: usuario.id, rol: usuario.rol };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
  };
}

export async function findById(id: number): Promise<UsuarioPublico | null> {
  return prisma.usuario.findUnique({
    where: { id },
    select: { id: true, email: true, nombre: true, rol: true },
  });
}
