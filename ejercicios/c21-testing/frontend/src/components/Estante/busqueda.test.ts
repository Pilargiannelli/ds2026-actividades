import { describe, expect, it } from "vitest";
import type { Libro } from "../../types/libro";
import { categoriasDelIndice, compararTexto, filtrar, generosDisponibles, hayFiltros, indexar, ordenar, SIN_FILTROS } from "./busqueda";

const cat = { literatura: { id: 9, nombre: "Literatura", orden: 9 }, gastro: { id: 10, nombre: "Gastronomía", orden: 10 }, arq: { id: 1, nombre: "Arquitectura", orden: 1 } };

let id = 0;
const libro = (titulo: string, autor: string, categoria: { id: number; nombre: string; orden: number }, generos: string[], extra: Partial<Libro> = {}): Libro => ({
  id: ++id,
  titulo,
  precio: 1,
  imagen: null,
  disponible: true,
  autorId: id,
  autor: { id, nombre: autor, nacionalidad: null },
  categorias: [categoria],
  generos,
  ...extra,
});

const indice = indexar([
  libro("Ficciones", "Jorge Luis Borges", cat.literatura, ["Cuentos", "Literatura argentina"], { anio: 1944, editorial: "Editorial Sur" }),
  libro("Fervor de Buenos Aires", "Jorge Luis Borges", cat.literatura, ["Poesía", "Literatura argentina"], { anio: 1923 }),
  libro("Rayuela", "Julio Cortázar", cat.literatura, ["Novela", "Literatura argentina"], { anio: 1963 }),
  libro("Tartine Bread", "Chad Robertson", cat.gastro, ["Panadería"], { anio: 2010, editorial: "Chronicle Books" }),
  libro("The Cake Bible", "Rose Levy Beranbaum", cat.gastro, ["Repostería"], { anio: 1988 }),
  libro("Thinking Architecture", "Peter Zumthor", cat.arq, ["Teoría y ensayo"], { editorial: "Lars Müller Publishers" }),
]);

const titulos = (f: Partial<typeof SIN_FILTROS>) => filtrar(indice, { ...SIN_FILTROS, ...f }).map((l) => l.titulo);

describe("filtrar", () => {
  it("sin filtros devuelve todo, ordenado de la A a la Z", () => {
    expect(titulos({})).toEqual(["Fervor de Buenos Aires", "Ficciones", "Rayuela", "Tartine Bread", "The Cake Bible", "Thinking Architecture"]);
    expect(hayFiltros(SIN_FILTROS)).toBe(false);
    expect(hayFiltros({ ...SIN_FILTROS, orden: "anio-desc" })).toBe(false); // el orden no es un filtro
  });

  it("busca por título, autor, editorial, categoría, género y año", () => {
    expect(titulos({ texto: "rayuela" })).toEqual(["Rayuela"]);
    expect(titulos({ texto: "borges" })).toEqual(["Fervor de Buenos Aires", "Ficciones"]);
    expect(titulos({ texto: "lars muller" })).toEqual(["Thinking Architecture"]);
    expect(titulos({ texto: "gastronomia" })).toEqual(["Tartine Bread", "The Cake Bible"]);
    expect(titulos({ texto: "reposteria" })).toEqual(["The Cake Bible"]);
    expect(titulos({ texto: "1944" })).toEqual(["Ficciones"]);
  });

  it("combina búsqueda, categoría y género por intersección", () => {
    expect(titulos({ texto: "borges", categoria: "Literatura", genero: "Cuentos" })).toEqual(["Ficciones"]);
    expect(titulos({ texto: "borges", categoria: "Gastronomía" })).toEqual([]);
    expect(titulos({ categoria: "Literatura", genero: "Literatura argentina" })).toHaveLength(3);
  });

  it("sin coincidencias devuelve una lista vacía", () => {
    expect(titulos({ texto: "xyz inexistente" })).toEqual([]);
  });
});

describe("categorías y géneros disponibles", () => {
  it("lista las categorías en el orden de los estantes, con su cantidad", () => {
    expect(categoriasDelIndice(indice)).toEqual([
      { nombre: "Arquitectura", cantidad: 1 },
      { nombre: "Literatura", cantidad: 3 },
      { nombre: "Gastronomía", cantidad: 2 },
    ]);
  });

  it("con una categoría elegida, solo aparecen sus géneros", () => {
    const grupos = generosDisponibles(indice, "Literatura");
    expect(grupos).toHaveLength(1);
    const nombres = grupos[0].generos.map((g) => g.nombre);
    expect(nombres).toContain("Cuentos");
    expect(nombres).not.toContain("Repostería");
    expect(grupos[0].generos[0]).toEqual({ nombre: "Literatura argentina", cantidad: 3 });
  });

  it("con todas las categorías, los géneros vienen agrupados por categoría", () => {
    expect(generosDisponibles(indice, null).map((g) => g.categoria)).toEqual(["Arquitectura", "Literatura", "Gastronomía"]);
  });
});

describe("ordenar", () => {
  const l = (id: number, titulo: string, autor: string, anio: number | null): Libro => ({
    id, titulo, precio: 1, imagen: null, disponible: true, autorId: id, autor: { id, nombre: autor, nacionalidad: null }, anio,
  });
  const libros = [
    l(1, "Ñandú", "Zamora", 1990),
    l(2, "¿Quién?", "Álvarez", null),
    l(3, "Árbol de Diana", "Pizarnik", 1962),
    l(4, "arquitectura", "", 2001),
    l(5, "2666", "Bolaño", 2004),
    l(6, "101 cosas", "Frederick", 2007),
  ];
  const t = (orden: Parameters<typeof ordenar>[1]) => ordenar(libros, orden).map((x) => x.titulo);

  it("A–Z en castellano: ignora acentos, mayúsculas y signos; números en orden natural; ñ entre n y o", () => {
    expect(t("titulo-asc")).toEqual(["101 cosas", "2666", "Árbol de Diana", "arquitectura", "Ñandú", "¿Quién?"]);
    expect(compararTexto("nube", "ñandú")).toBeLessThan(0);
    // palabra por palabra: "A Game…" antes que "Adán…"
    expect(compararTexto("A Game of Thrones", "Adán Buenosayres")).toBeLessThan(0);
    // los signos iniciales no cuentan: «¿Quién?» se ordena por la Q
    expect(compararTexto("¿Quién?", "Quién?")).toBe(0);
    expect(compararTexto("«Sur»", "Tango")).toBeLessThan(0);
  });

  it("Z–A es el inverso", () => {
    expect(t("titulo-desc")).toEqual(["¿Quién?", "Ñandú", "arquitectura", "Árbol de Diana", "2666", "101 cosas"]);
  });

  it("por autor, y los que no tienen autor van al final", () => {
    expect(t("autor-asc")).toEqual(["¿Quién?", "2666", "101 cosas", "Árbol de Diana", "Ñandú", "arquitectura"]);
  });

  it("por año (reciente / antiguo), los que no tienen año van al final", () => {
    expect(t("anio-desc")).toEqual(["101 cosas", "2666", "arquitectura", "Ñandú", "Árbol de Diana", "¿Quién?"]);
    expect(t("anio-asc")).toEqual(["Árbol de Diana", "Ñandú", "arquitectura", "2666", "101 cosas", "¿Quién?"]);
  });

  it("es estable: empates por título y después por id", () => {
    const iguales = [l(9, "Mismo", "A", 2000), l(8, "Mismo", "A", 2000)];
    expect(ordenar(iguales, "anio-desc").map((x) => x.id)).toEqual([8, 9]);
  });
});
