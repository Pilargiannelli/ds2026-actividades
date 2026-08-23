import { Autor } from "../types/autor.types";

const autores: Autor[] = [
  { id: 1, nombre: "Antoine de Saint-Exupéry", nacionalidad: "Francia" },
  { id: 2, nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { id: 3, nombre: "Liliana Bodoc", nacionalidad: "Argentina" },
];

let proximoId = 4;

export function findAll(): Autor[] {
  return autores;
}

export function findById(id: number): Autor | undefined {
  return autores.find((autor) => autor.id === id);
}

export function create(datos: Omit<Autor, "id">): Autor {
  const nuevo: Autor = { id: proximoId++, ...datos };
  autores.push(nuevo);
  return nuevo;
}

export function update(id: number, datos: Omit<Autor, "id">): Autor | undefined {
  const autor = autores.find((a) => a.id === id);
  if (!autor) return undefined;

  Object.assign(autor, datos);
  return autor;
}

export function remove(id: number): boolean {
  const index = autores.findIndex((a) => a.id === id);
  if (index === -1) return false;

  autores.splice(index, 1);
  return true;
}
