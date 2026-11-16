// Punto de entrada del catálogo: une los lotes. Para sumar una disciplina, crear su
// archivo de lote, agregar la categoría (con orden) en base.ts y sumarla acá.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { arquitectura } from "./arquitectura";
import { arte } from "./arte";
import { autoresBase, categorias, librosBase } from "./base";
import { disenoGrafico } from "./diseno-grafico";
import { disenoIndustrial } from "./diseno-industrial";
import { editorial } from "./editorial";
import { fotografia } from "./fotografia";
import { gastronomia } from "./gastronomia";
import { generosDerivados } from "./generos";
import { literatura, nacionalidadesLiteratura } from "./literatura";
import { moda } from "./moda";
import { tipografia } from "./tipografia";
import type { AutorSemilla, LibroSemilla } from "./tipos";

export { categorias };
export { precioDeReferencia } from "./tipos";
export type { AutorSemilla, CategoriaSemilla, LibroSemilla } from "./tipos";

export const lotes: Record<string, LibroSemilla[]> = {
  base: librosBase,
  arquitectura,
  disenoGrafico,
  arte,
  fotografia,
  moda,
  disenoIndustrial,
  tipografia,
  editorial,
  literatura,
  gastronomia,
};

// Nacionalidades verificadas: las del lote base y las que aporta cada lote. El resto, null
// (no se inventa).
const conNacionalidad = new Map<string, string | null>([
  ...autoresBase.map((a) => [a.nombre, a.nacionalidad] as const),
  ...Object.entries(nacionalidadesLiteratura),
]);

// Portadas de Open Library. Solo para los libros sin imagen propia. Primero la tapa de la
// 1.ª edición (primeras-ediciones.ts); si no hay, la de otra edición (portadas.ts).
// El fragmento #primera-edicion no llega al servidor: le avisa al front qué leyenda poner.
const leerJson = (archivo: string): Record<string, number | null> =>
  existsSync(join(__dirname, archivo)) ? JSON.parse(readFileSync(join(__dirname, archivo), "utf8")) : {};
const primeras = leerJson("primeras-ediciones.json");
const otras = leerJson("portadas.json");
const urlPortada = (clave: string) => {
  if (primeras[clave]) return `https://covers.openlibrary.org/b/id/${primeras[clave]}-L.jpg#primera-edicion`;
  if (otras[clave]) return `https://covers.openlibrary.org/b/id/${otras[clave]}-L.jpg`;
  return undefined;
};

// Cada libro con sus géneros cargados + los derivados por regla (ver generos.ts) y su portada.
export const libros: LibroSemilla[] = Object.values(lotes)
  .flat()
  .map((l) => {
    const derivados = generosDerivados(l.cats, l.anio, conNacionalidad.get(l.autor) ?? null);
    return {
      ...l,
      generos: [...new Set([...(l.generos ?? []), ...derivados])],
      imagen: l.imagen ?? urlPortada(`${l.titulo}|${l.autor}`),
    };
  });

export const autores: AutorSemilla[] = [...new Set(libros.map((l) => l.autor))].map((nombre) => ({
  nombre,
  nacionalidad: conNacionalidad.get(nombre) ?? null,
}));
