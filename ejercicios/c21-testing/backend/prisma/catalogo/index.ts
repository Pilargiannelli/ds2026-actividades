// Punto de entrada del catálogo: une los lotes. Para sumar una disciplina, crear su
// archivo de lote, agregar la categoría (con orden) en base.ts y sumarla acá.
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

// Cada libro con sus géneros cargados + los derivados por regla (ver generos.ts).
export const libros: LibroSemilla[] = Object.values(lotes)
  .flat()
  .map((l) => {
    const derivados = generosDerivados(l.cats, l.anio, conNacionalidad.get(l.autor) ?? null);
    return { ...l, generos: [...new Set([...(l.generos ?? []), ...derivados])] };
  });

export const autores: AutorSemilla[] = [...new Set(libros.map((l) => l.autor))].map((nombre) => ({
  nombre,
  nacionalidad: conNacionalidad.get(nombre) ?? null,
}));
