// Color de acento por categoría (tokens de style.css): variaciones de la misma paleta.
const ACENTOS: Record<string, string> = {
  Arquitectura: "var(--color-topo-oscuro)",
  "Diseño gráfico": "var(--color-marron-claro)",
  Arte: "var(--color-oliva)",
  Fotografía: "var(--color-salvia)",
  Moda: "var(--color-malva)",
  "Diseño industrial": "var(--color-oliva-oscuro)",
  Tipografía: "var(--color-marron)",
  "Editorial y publicaciones independientes": "var(--color-ocre)",
  Literatura: "var(--color-marron-calido)",
  Gastronomía: "var(--color-terracota)",
};

export const acentoDe = (categoria: string) => ACENTOS[categoria] ?? "var(--color-marron)";
