import { Libro } from "../types/libro.types";

const libros: Libro[] = [
  { id: 1, titulo: "El arca de Noé", autor: "Beatriz Dourmec y Ayax Barnes", genero: "Infantil", img: "/img/arca.jpg", precio: 8500, disponible: true },
  { id: 2, titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Clásico", img: "/img/princ.webp", precio: 6200, disponible: true },
  { id: 3, titulo: "Los días del venado", autor: "Liliana Bodoc", genero: "Fantasía", img: "/img/venado.jpg", precio: 9800, disponible: true },
  { id: 4, titulo: "Rayuela", autor: "Julio Cortázar", genero: "Clásico", img: "/img/rayuela.webp", precio: 11500, disponible: true },
  { id: 5, titulo: "La cocina japonesa", autor: "Hiroko Shimbo", genero: "Gastronomía", img: "/img/hiroko.webp", precio: 15300, disponible: false },
];

let proximoId = 6;

export function findAll(disponible?: boolean): Libro[] {
  if (disponible === undefined) return libros;
  return libros.filter((libro) => libro.disponible === disponible);
}

export function findById(id: number): Libro | undefined {
  return libros.find((libro) => libro.id === id);
}

export function create(datos: Omit<Libro, "id">): Libro {
  const nuevo: Libro = { id: proximoId++, ...datos };
  libros.push(nuevo);
  return nuevo;
}

export function update(id: number, datos: Omit<Libro, "id">): Libro | undefined {
  const libro = libros.find((l) => l.id === id);
  if (!libro) return undefined;

  Object.assign(libro, datos);
  return libro;
}

export function remove(id: number): boolean {
  const index = libros.findIndex((l) => l.id === id);
  if (index === -1) return false;

  libros.splice(index, 1);
  return true;
}
