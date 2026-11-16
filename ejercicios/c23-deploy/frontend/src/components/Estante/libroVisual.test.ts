import { describe, expect, it } from "vitest";
import {
  aparienciaDelLibro,
  colorDeTexto,
  colorDominante,
  luminancia,
  medidasDelLomo,
  selloEditorial,
  tamanoAbierto,
} from "./libroVisual";

describe("medidasDelLomo", () => {
  it("es determinística: el mismo libro da siempre el mismo lomo", () => {
    expect(medidasDelLomo(3)).toEqual(medidasDelLomo(3));
  });

  it("se mantiene dentro de dimensiones de libro real", () => {
    for (let id = 1; id <= 700; id++) {
      const { alto, grosor } = medidasDelLomo(id);
      expect(alto).toBeGreaterThanOrEqual(236);
      expect(alto).toBeLessThanOrEqual(324);
      expect(grosor).toBeGreaterThanOrEqual(20);
      expect(grosor).toBeLessThanOrEqual(64);
    }
  });

  it("el formato depende de la disciplina: tipografía más baja que fotografía", () => {
    const altos = (cat: string) => Array.from({ length: 300 }, (_, i) => medidasDelLomo(i + 1, cat).alto);
    expect(Math.max(...altos("Tipografía"))).toBeLessThanOrEqual(292);
    expect(Math.min(...altos("Fotografía"))).toBeGreaterThanOrEqual(250);
  });

  it("los grosores varían y se sesgan hacia lomos finos", () => {
    const grosores = Array.from({ length: 600 }, (_, i) => medidasDelLomo(i + 1).grosor);
    expect(new Set(grosores).size).toBeGreaterThan(25);
    const finos = grosores.filter((g) => g < 42).length;
    expect(finos / grosores.length).toBeGreaterThan(0.6);
  });

  it("varía entre libros", () => {
    const altos = new Set(Array.from({ length: 20 }, (_, i) => medidasDelLomo(i + 1).alto));
    expect(altos.size).toBeGreaterThan(3);
  });
});

describe("colores", () => {
  it("colorDominante elige el color con más presencia (y saturación)", () => {
    const rojo = [200, 40, 30, 255];
    const gris = [128, 128, 128, 255];
    const px = [...rojo, ...rojo, ...rojo, ...gris, ...gris];
    expect(colorDominante(px)).toBe("#c8281e");
  });

  it("colorDominante ignora píxeles transparentes", () => {
    expect(colorDominante([10, 10, 10, 0])).toBeNull();
  });

  it("colorDeTexto usa tinta clara sobre fondos oscuros y oscura sobre claros", () => {
    expect(colorDeTexto("#111111")).toBe("#f6f3ec");
    expect(colorDeTexto("#f2efe8")).toBe("#1c1b19");
    expect(luminancia("#ffffff")).toBeCloseTo(1);
  });

  it("sin portada usa un color de reserva", () => {
    const a = aparienciaDelLibro({ id: 1 }, { estado: "error", color: null });
    expect(a.base).toMatch(/^#[0-9a-f]{6}$/);
    expect(a.estilo).not.toBe("imagen");
  });
});

describe("tamanoAbierto", () => {
  it("en escritorio la doble página entra en la ventana", () => {
    const { W, H, movil } = tamanoAbierto(1440, 900, 0.66);
    expect(movil).toBe(false);
    expect(2 * W).toBeLessThanOrEqual(1440 - 120);
    expect(H).toBeLessThanOrEqual(900);
  });

  it("en móvil la ficha ocupa casi todo el ancho", () => {
    const { W, movil } = tamanoAbierto(390, 844, 0.66);
    expect(movil).toBe(true);
    expect(W).toBe(350);
  });
});

describe("selloEditorial", () => {
  it("usa la inicial de la editorial, salteando artículos y genéricos", () => {
    expect(selloEditorial("Lars Müller Publishers")).toBe("L");
    expect(selloEditorial("The Museum of Modern Art")).toBe("M");
    expect(selloEditorial("Éditions Verve")).toBe("V");
  });

  it("sin editorial, el sello de la librería", () => {
    expect(selloEditorial(null)).toBe("C");
  });
});

describe("estilo de casa", () => {
  const sinPortada = { estado: "error" as const, color: null };

  it("los libros de una misma editorial comparten tipografía y orientación", () => {
    const libros = [101, 202, 303, 404].map((id) => aparienciaDelLibro({ id, editorial: "Lars Müller Publishers" }, sinPortada));
    expect(new Set(libros.map((a) => a.tipografia)).size).toBe(1);
    expect(new Set(libros.map((a) => a.orientacion)).size).toBe(1);
  });

  it("entre editoriales hay variedad de tipografías y encuadernaciones", () => {
    const editoriales = ["Taschen", "Phaidon", "Steidl", "Aperture", "Rizzoli", "Gestalten", "Mack", "Actar", "Hyphen Press", "Unit Editions", "Thames & Hudson", "The MIT Press"];
    const aps = editoriales.flatMap((editorial, i) => [1, 2, 3].map((n) => aparienciaDelLibro({ id: i * 10 + n, editorial }, sinPortada)));
    expect(new Set(aps.map((a) => a.tipografia)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(aps.map((a) => a.estilo)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(aps.map((a) => a.base)).size).toBeGreaterThanOrEqual(10);
  });
});
