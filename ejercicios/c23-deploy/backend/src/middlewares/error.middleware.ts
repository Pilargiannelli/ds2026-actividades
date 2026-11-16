import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";

// Un solo lugar traduce los errores a HTTP. Express 5 le manda solo las promesas
// rechazadas, así que los controllers no necesitan try/catch.
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Validación de forma (Zod) → 400
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: err.issues.map((i) => ({ campo: i.path.join("."), mensaje: i.message })),
    });
  }

  // Errores conocidos de Prisma → el status que corresponde
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Ya existe un registro con ese valor" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "No encontrado" });
    }
    if (err.code === "P2003") {
      return res.status(409).json({ error: "Hay registros relacionados" });
    }
  }

  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor" });
};
