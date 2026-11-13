import { describe, expect, it } from "vitest";
import type { Libro } from "../../types/libro";
import { agruparEnSecciones, slug } from "./secciones";

const libro = (id: number, categorias: Libro["categorias"]): Libro => ({
  id,
  titulo: `Libro ${id}`,
  precio: 1000,
  imagen: null,
  disponible: true,
  autorId: 1,
  autor: { id: 1, nombre: "Autor", nacionalidad: "Argentina" },
  categorias,
});

describe("agruparEnSecciones", () => {
  it("ordena los estantes por el orden de la categoría", () => {
    const secciones = agruparEnSecciones([
      libro(1, [{ id: 2, nombre: "Moda", orden: 5 }]),
      libro(2, [{ id: 1, nombre: "Arquitectura", orden: 1 }]),
    ]);
    expect(secciones.map((s) => s.nombre)).toEqual(["Arquitectura", "Moda"]);
  });

  it("cada libro va a un solo estante: el de menor orden; las etiquetas sin orden no son estantes", () => {
    const secciones = agruparEnSecciones([
      libro(1, [
        { id: 9, nombre: "Clásico", orden: null },
        { id: 7, nombre: "Tipografía", orden: 7 },
        { id: 8, nombre: "Editorial y publicaciones independientes", orden: 8 },
      ]),
    ]);
    expect(secciones).toHaveLength(1);
    expect(secciones[0].nombre).toBe("Tipografía");
  });

  it("los libros sin categoría de estante no se pierden: van a «Otros títulos»", () => {
    const secciones = agruparEnSecciones([libro(1, [{ id: 9, nombre: "Clásico", orden: null }]), libro(2, undefined)]);
    expect(secciones).toEqual([{ id: "otros-titulos", nombre: "Otros títulos", libros: expect.any(Array) }]);
    expect(secciones[0].libros).toHaveLength(2);
  });
});

describe("slug", () => {
  it("arma anclas legibles sin tildes", () => {
    expect(slug("Diseño gráfico")).toBe("diseno-grafico");
    expect(slug("Editorial y publicaciones independientes")).toBe("editorial-y-publicaciones-independientes");
  });
});
