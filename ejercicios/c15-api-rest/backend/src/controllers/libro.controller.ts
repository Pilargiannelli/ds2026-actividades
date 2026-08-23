import { Request, Response } from "express";
import * as libroService from "../services/libro.service";

export function getAll(req: Request, res: Response) {
  const { disponible } = req.query;

  if (disponible === "true") {
    return res.json(libroService.findAll(true));
  }

  if (disponible === "false") {
    return res.json(libroService.findAll(false));
  }

  res.json(libroService.findAll());
}

export function getById(req: Request, res: Response) {
  const libro = libroService.findById(Number(req.params.id));
  if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

  res.json(libro);
}

export function create(req: Request, res: Response) {
  const nuevo = libroService.create(req.body);
  res.status(201).json(nuevo);
}

export function update(req: Request, res: Response) {
  const libro = libroService.update(Number(req.params.id), req.body);
  if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

  res.json(libro);
}

export function remove(req: Request, res: Response) {
  const ok = libroService.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Libro no encontrado" });

  res.status(204).send();
}
