import { Request, Response } from "express";
import * as libroService from "../services/libro.service";

// Sin try/catch: si algo se rechaza, Express 5 lo manda al errorHandler.

export async function getAll(req: Request, res: Response) {
  const { disponible } = req.query;

  if (disponible === "true") return res.json(await libroService.findAll(true));
  if (disponible === "false") return res.json(await libroService.findAll(false));

  return res.json(await libroService.findAll());
}

export async function getById(req: Request, res: Response) {
  const libro = await libroService.findById(Number(req.params.id));
  if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

  return res.json(libro);
}

export async function create(req: Request, res: Response) {
  const nuevo = await libroService.create(req.body);
  return res.status(201).json(nuevo);
}

export async function update(req: Request, res: Response) {
  const libro = await libroService.update(Number(req.params.id), req.body);
  return res.json(libro);
}

export async function remove(req: Request, res: Response) {
  await libroService.remove(Number(req.params.id));
  return res.status(204).send();
}
