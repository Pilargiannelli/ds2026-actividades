// Vocabulario de géneros por categoría. El verificador rechaza géneros fuera de esta lista,
// así no aparecen variantes ("Ensayos", "ensayo"...) que fragmenten el filtro.
//
// Literatura: además de los géneros de forma cargados en cada fila, se derivan con reglas
// fijas (no a mano): "Literatura argentina" / "Literatura latinoamericana" por la
// nacionalidad verificada del autor, y "Clásicos" (1.ª ed. anterior a 1945) o
// "Contemporánea" (1980 en adelante) por el año.
export const vocabulario: Record<string, readonly string[]> = {
  Arquitectura: ["Teoría y ensayo", "Historia", "Monografía", "Urbanismo", "Manual y técnica", "Biografía y memorias"],
  "Diseño gráfico": ["Teoría y ensayo", "Historia", "Monografía", "Identidad y marca", "Visualización de datos", "Manual y técnica", "Cartel"],
  Arte: ["Teoría y crítica", "Historia del arte", "Contemporáneo", "Clásico", "Pintura", "Escultura", "Vanguardias", "Escritos de artista", "Monografía"],
  Fotografía: ["Documental", "Retrato", "Calle", "Paisaje y territorio", "Moda", "Experimental", "Conceptual", "Arquitectura", "Teoría y ensayo"],
  Moda: ["Teoría y ensayo", "Historia", "Monografía de diseñador", "Catálogo de exposición", "Memorias y biografía", "Fotografía de moda", "Oficio y patronaje", "Industria y sostenibilidad"],
  "Diseño industrial": ["Teoría y ensayo", "Monografía", "Historia", "Método y proceso", "Ergonomía", "Sostenibilidad", "Mobiliario", "Diseño especulativo"],
  Tipografía: ["Manual", "Historia", "Ensayo", "Diseño de tipos", "Muestrario", "Caligrafía y rotulación", "Diseño de libros"],
  "Editorial y publicaciones independientes": ["Revista", "Libro de artista", "Diseño de libros", "Teoría y ensayo", "Historia", "Autoedición"],
  Literatura: [
    "Novela", "Cuentos", "Poesía", "Ensayo", "Teatro", "Ciencia ficción", "Fantasía", "Literatura experimental", "No ficción",
    "Literatura argentina", "Literatura latinoamericana", "Clásicos", "Contemporánea",
  ],
  Gastronomía: [
    "Cocina internacional", "Alta cocina", "Cocina de autor", "Repostería", "Panadería", "Cocina regional y tradicional",
    "Cultura gastronómica", "Historia de la alimentación", "Técnica y ciencia", "Fermentación", "Memorias",
    "Fotografía y diseño editorial",
  ],
};

const LATINOAMERICA = [
  "Argentina", "Uruguay", "Chile", "Perú", "México", "Colombia", "Brasil", "Cuba", "Venezuela", "Bolivia",
  "Paraguay", "Ecuador", "Guatemala", "Nicaragua", "Honduras", "Puerto Rico", "República Dominicana",
];

// Géneros derivados de datos ya cargados (reglas fijas, documentadas arriba).
export function generosDerivados(cats: string[], anio: number | null | undefined, nacionalidad: string | null): string[] {
  if (!cats.includes("Literatura")) return [];
  const extra: string[] = [];
  const paises = (nacionalidad ?? "").split("/").map((p) => p.trim());
  if (paises.includes("Argentina")) extra.push("Literatura argentina");
  if (paises.some((p) => LATINOAMERICA.includes(p))) extra.push("Literatura latinoamericana");
  if (anio != null && anio < 1945) extra.push("Clásicos");
  if (anio != null && anio >= 1980) extra.push("Contemporánea");
  return extra;
}
