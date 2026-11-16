import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma";

// ⚠ ESTOS TESTS NECESITAN LA DB: llegan hasta Prisma y usan los usuarios del seed.
// Antes de correrlos: `docker compose up -d db` y el seed cargado. vitest.config.mts
// apunta DATABASE_URL a localhost:5436. Con Docker apagado, estos fallan y el
// resto de los archivos (sin DB) siguen verdes: por eso van separados.

afterAll(() => prisma.$disconnect()); // cerrar el pool al terminar

describe("POST /api/auth/login (con DB)", () => {
  it("credenciales del seed → 200 con token y usuario sin passwordHash", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "cliente@libreria.test", password: "Cliente1234" });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.usuario).toMatchObject({ email: "cliente@libreria.test", rol: "CLIENTE" });
    expect(res.body.usuario).not.toHaveProperty("passwordHash");
  });

  it("password incorrecta → 401 'Credenciales inválidas'", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "cliente@libreria.test", password: "Incorrecta1" });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Credenciales inválidas" });
  });

  it("mail que no existe → el MISMO 401 (no revela si el mail existe)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nadie@libreria.test", password: "Cliente1234" });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Credenciales inválidas" });
  });
});

describe("GET /api/auth/yo (con DB)", () => {
  it("con el token del login → 200 con el usuario", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@libreria.test", password: "Admin1234" });
    const res = await request(app).get("/api/auth/yo").set("Authorization", `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: "admin@libreria.test", nombre: "Admin", rol: "ADMIN" });
    expect(res.body).not.toHaveProperty("passwordHash");
  });
});
