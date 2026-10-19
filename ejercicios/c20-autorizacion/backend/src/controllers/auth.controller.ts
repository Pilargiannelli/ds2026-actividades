import { Request, Response } from "express";
import * as authService from "../services/auth.services";

// Sin try/catch: si algo se rechaza, Express 5 lo manda al errorHandler.

export async function registrar(req: Request, res: Response) {
  const usuario = await authService.registrar(req.body);
  return res.status(201).json(usuario);
}

export async function login(req: Request, res: Response) {
  const resultado = await authService.login(req.body);
  // Mensaje genérico en los dos casos de falla (mail inexistente o password mal):
  // así no se puede usar el login para descubrir qué mails están registrados.
  if (!resultado) return res.status(401).json({ error: "Credenciales inválidas" });

  return res.json(resultado);
}

export async function yo(req: Request, res: Response) {
  const usuario = await authService.findById(req.usuario!.id); // authenticate ya corrió
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  return res.json(usuario);
}
