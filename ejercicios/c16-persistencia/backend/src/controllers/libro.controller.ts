import { Request, Response } from "express";
import * as libroService from "../services/libro.service";

export async function getAll(req: Request, res: Response) {
  try {
    const { disponible } = req.query;

    if (disponible === "true") {
      return res.json(await libroService.findAll(true));
    }

    if (disponible === "false") {
      return res.json(await libroService.findAll(false));
    }

    res.json(await libroService.findAll());
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const libro = await libroService.findById(Number(req.params.id));
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const nuevo = await libroService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const libro = await libroService.update(Number(req.params.id), req.body);
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const ok = await libroService.remove(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: "Libro no encontrado" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
