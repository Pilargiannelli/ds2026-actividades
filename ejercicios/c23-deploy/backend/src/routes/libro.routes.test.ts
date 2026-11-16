import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { JWT_SECRET } from "../config/env";

// La matriz de permisos SIN DB: corren con Docker apagado. El orden
// authenticate (401) → authorize (403) → validate (400) corta el request antes
// de llegar a Prisma. Los tokens se firman acá, sin login ni usuario en la DB.

const tokenCliente = jwt.sign({ id: 2, rol: "CLIENTE" }, JWT_SECRET, { expiresIn: "1h" });
const tokenAdmin = jwt.sign({ id: 1, rol: "ADMIN" }, JWT_SECRET, { expiresIn: "1h" });

const libroNuevo = { titulo: "Rayuela", precio: 7000, imagen: "/img/rayuela.webp", autorId: 2 };

describe("POST /api/libros (sin DB)", () => {
  it("sin token → 401 'Falta el token'", async () => {
    const res = await request(app).post("/api/libros").send(libroNuevo);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Falta el token" });
  });

  it("con token de CLIENTE → 403", async () => {
    const res = await request(app)
      .post("/api/libros")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send(libroNuevo);
    expect(res.status).toBe(403);
  });

  it("ADMIN con body inválido → 400, no 403 (autoriza antes de validar)", async () => {
    const res = await request(app)
      .post("/api/libros")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ precio: -5 });
    expect(res.status).toBe(400);
    expect(res.body.detalles).toContainEqual({ campo: "precio", mensaje: "El precio debe ser mayor a 0" });
  });

  it("con token adulterado → 401 'Token inválido'", async () => {
    const res = await request(app)
      .post("/api/libros")
      .set("Authorization", `Bearer ${tokenAdmin.slice(0, -2)}xx`)
      .send(libroNuevo);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Token inválido" });
  });
});

describe("otras filas de la matriz (sin DB)", () => {
  it("DELETE /api/libros/1 con token de CLIENTE → 403", async () => {
    const res = await request(app).delete("/api/libros/1").set("Authorization", `Bearer ${tokenCliente}`);
    expect(res.status).toBe(403);
  });

  it("GET /api/no-existe → 404 en JSON", async () => {
    const res = await request(app).get("/api/no-existe");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Ruta no encontrada" });
  });
});
