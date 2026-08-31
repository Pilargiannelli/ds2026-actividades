import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

// Es una función que devuelve una función: validate(schema) fabrica el middleware
// que valida el body con ese schema.
export const validate = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  const resultado = schema.safeParse(req.body);
  if (!resultado.success) return next(resultado.error); // → 400 vía errorHandler

  req.body = resultado.data; // el body ya validado y convertido
  next();
};

// Igual, pero sobre req.params (el id de la URL).
export const validateParams = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  const resultado = schema.safeParse(req.params);
  if (!resultado.success) return next(resultado.error);

  next();
};
