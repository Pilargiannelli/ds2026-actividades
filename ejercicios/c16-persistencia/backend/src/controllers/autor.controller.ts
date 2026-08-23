import { Request, Response } from "express";
import * as autorService from "../services/autor.service";

export async function getAll(_req: Request, res: Response) {
  try {
    res.json(await autorService.findAll());
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const autor = await autorService.findById(Number(req.params.id));
    if (!autor) return res.status(404).json({ error: "Autor no encontrado" });

    res.json(autor);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const nuevo = await autorService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const autor = await autorService.update(Number(req.params.id), req.body);
    if (!autor) return res.status(404).json({ error: "Autor no encontrado" });

    res.json(autor);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const ok = await autorService.remove(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: "Autor no encontrado" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
