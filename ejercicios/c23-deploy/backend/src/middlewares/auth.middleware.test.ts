import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticate, authorize } from "./auth.middleware";
import { JWT_SECRET } from "../config/env"; // el de test, lo setea vitest.config.mts

// req, res y next falsos: el middleware no sabe si res es de Express o un objeto
// con dos vi.fn(). vi.fn() recuerda cómo lo llamaron, y eso es lo que verificamos.
function mocks(req: Partial<Request> = {}) {
  // mockReturnThis: res.status(403) devuelve res, para que .json(...) encadene como el real
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req: req as Request, res, next };
}

describe("authorize", () => {
  it("responde 403 a un CLIENTE cuando la ruta pide ADMIN", () => {
    const { req, res, next } = mocks({ usuario: { id: 2, rol: "CLIENTE" } });
    authorize("ADMIN")(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("deja pasar a un ADMIN (llama a next y no responde)", () => {
    const { req, res, next } = mocks({ usuario: { id: 1, rol: "ADMIN" } });
    authorize("ADMIN")(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("responde 401 si no pasó antes por authenticate (no hay req.usuario)", () => {
    const { req, res, next } = mocks();
    authorize("ADMIN")(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("authenticate", () => {
  it("responde 401 'Falta el token' sin header Authorization", () => {
    const { req, res, next } = mocks({ headers: {} });
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Falta el token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("con un token válido llena req.usuario y llama a next", () => {
    const token = jwt.sign({ id: 7, rol: "CLIENTE" }, JWT_SECRET, { expiresIn: "1h" });
    const { req, res, next } = mocks({ headers: { authorization: `Bearer ${token}` } });
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.usuario).toEqual({ id: 7, rol: "CLIENTE" });
  });

  it("responde 401 'Token expirado' con un token vencido", () => {
    // expiresIn negativo fabrica un token ya vencido: no hay que esperar dos horas
    const token = jwt.sign({ id: 7, rol: "CLIENTE" }, JWT_SECRET, { expiresIn: "-1s" });
    const { req, res, next } = mocks({ headers: { authorization: `Bearer ${token}` } });
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token expirado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("responde 401 'Token inválido' con un token firmado con otro secret", () => {
    const token = jwt.sign({ id: 1, rol: "ADMIN" }, "otro-secret", { expiresIn: "1h" });
    const { req, res, next } = mocks({ headers: { authorization: `Bearer ${token}` } });
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });
});
