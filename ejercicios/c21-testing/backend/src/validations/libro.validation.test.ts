import { describe, it, expect } from "vitest";
import { libroCreateSchema } from "./libro.validation";
import { idParamSchema } from "./params.validation";

// Unitario puro: un schema Zod es una función (entra un objeto, sale un
// resultado). Sin Express, sin DB, sin nada afuera.

const libroValido = { titulo: "Rayuela", precio: 7000, imagen: "/img/rayuela.webp", autorId: 2 };

describe("libroCreateSchema", () => {
  it("acepta un libro válido", () => {
    const r = libroCreateSchema.safeParse(libroValido);
    expect(r.success).toBe(true);
  });

  it("rechaza precio negativo, marcando el campo precio", () => {
    const r = libroCreateSchema.safeParse({ ...libroValido, precio: -5 });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toEqual(["precio"]);
  });

  it("recorta espacios del título", () => {
    const r = libroCreateSchema.safeParse({ ...libroValido, titulo: "  Rayuela  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.titulo).toBe("Rayuela");
  });

  it("rechaza un título que solo tiene espacios", () => {
    const r = libroCreateSchema.safeParse({ ...libroValido, titulo: "   " });
    expect(r.success).toBe(false);
  });
});

describe("idParamSchema", () => {
  it('convierte el id de la URL ("42") en el número 42', () => {
    const r = idParamSchema.safeParse({ id: "42" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.id).toBe(42);
  });

  it("rechaza un id que no es número", () => {
    const r = idParamSchema.safeParse({ id: "abc" });
    expect(r.success).toBe(false);
  });
});
