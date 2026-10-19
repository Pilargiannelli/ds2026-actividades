import { describe, it, expect } from "vitest";
import { loginSchema, registroSchema } from "./auth.validation";

// Lo que el schema transforma: documenta decisiones de C18. Si alguien saca el
// .trim().toLowerCase() del email, estos tests se ponen rojos.

describe("loginSchema", () => {
  it("normaliza el email: saca espacios y pasa a minúsculas", () => {
    const r = loginSchema.safeParse({ email: "  Admin@Libreria.TEST ", password: "x" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("admin@libreria.test");
  });

  it("no valida la fortaleza de la contraseña (eso es del registro)", () => {
    const r = loginSchema.safeParse({ email: "cliente@libreria.test", password: "x" });
    expect(r.success).toBe(true);
  });
});

describe("registroSchema", () => {
  it("una contraseña débil acumula los tres errores", () => {
    const r = registroSchema.safeParse({ nombre: "Ana", email: "ana@libreria.test", password: "corta" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.map((i) => i.message)).toHaveLength(3);
  });

  it("acepta una contraseña con 8 caracteres, una mayúscula y un número", () => {
    const r = registroSchema.safeParse({ nombre: "Ana", email: "ana@libreria.test", password: "Segura123" });
    expect(r.success).toBe(true);
  });
});
