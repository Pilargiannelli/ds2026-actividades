import { memo, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, Ref } from "react";
import type { Libro } from "../../types/libro";
import { LomoCara } from "./Caras";
import { aparienciaDelLibro, medidasDelLomo } from "./libroVisual";
import { useCercania } from "./useCercania";
import { usePortada } from "./usePortada";
import "./estante.css";

interface Props {
  libros: Libro[];
  categoria: string; // la disciplina: define el rango de formatos de los lomos
  etiqueta: string; // nombre accesible del estante
  seleccionId: number | null; // el libro que está fuera del estante (en toda la biblioteca)
  bloqueado: boolean; // hay un libro abierto: los lomos salen del orden de tabulación
  onAbrir: (libro: Libro, boton: HTMLButtonElement) => void; // estable (no cambia entre renders)
  pistaRef?: Ref<HTMLDivElement>;
}

interface LomoProps {
  libro: Libro;
  categoria: string;
  indice: number;
  fuera: boolean;
  tabIndex: number;
  onAbrir: (libro: Libro, boton: HTMLButtonElement) => void;
  onFoco: (indice: number) => void;
}

// memo: con cientos de lomos, abrir o cerrar un libro solo vuelve a pintar los que cambian.
const LomoEnEstante = memo(function LomoEnEstante({ libro, categoria, indice, fuera, tabIndex, onAbrir, onFoco }: LomoProps) {
  const ref = useRef<HTMLButtonElement>(null);
  // Carga diferida: la portada se descarga y analiza cuando el lomo se acerca a la vista.
  const cerca = useCercania(ref, Boolean(libro.imagen));
  const portada = usePortada(libro.imagen, cerca);
  const apariencia = useMemo(() => aparienciaDelLibro(libro, portada), [libro, portada]);
  const { alto, grosor } = useMemo(() => medidasDelLomo(libro.id, categoria), [libro.id, categoria]);

  return (
    <div role="listitem" className="estante__hueco" style={{ "--alto": alto, "--grosor": grosor } as CSSProperties}>
      <button
        ref={ref}
        type="button"
        className="lomo"
        data-libro={libro.id}
        data-fuera={fuera || undefined}
        aria-label={`${libro.titulo}, de ${libro.autor.nombre}. Abrir ficha`}
        aria-haspopup="dialog"
        tabIndex={tabIndex}
        onFocus={() => onFoco(indice)}
        onClick={(e) => onAbrir(libro, e.currentTarget)}
      >
        <LomoCara libro={libro} apariencia={apariencia} />
      </button>
    </div>
  );
});

// Un estante horizontal. Si no entra, se desplaza: nunca pasa a una segunda fila.
// Teclado: un solo lomo por estante entra en el orden de Tab; flechas, Inicio y Fin
// recorren el estante (con muchos estantes, Tab salta de estante en estante).
function Estante({ libros, categoria, etiqueta, seleccionId, bloqueado, onAbrir, pistaRef }: Props) {
  const [activo, setActivo] = useState(0);
  const indiceActivo = Math.min(activo, libros.length - 1);

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    const lomos = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(".lomo"));
    const actual = lomos.indexOf(document.activeElement as HTMLButtonElement);
    if (actual === -1) return;

    const destino =
      e.key === "ArrowRight" ? Math.min(actual + 1, lomos.length - 1)
      : e.key === "ArrowLeft" ? Math.max(actual - 1, 0)
      : e.key === "Home" ? 0
      : e.key === "End" ? lomos.length - 1
      : null;
    if (destino === null) return;

    e.preventDefault();
    lomos[destino].focus();
    lomos[destino].scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div className="estante">
      <div ref={pistaRef} className="estante__pista" role="list" aria-label={etiqueta} onKeyDown={alTeclear}>
        {libros.map((libro, i) => (
          <LomoEnEstante
            key={libro.id}
            libro={libro}
            categoria={categoria}
            indice={i}
            fuera={seleccionId === libro.id}
            tabIndex={!bloqueado && i === indiceActivo ? 0 : -1}
            onFoco={setActivo}
            onAbrir={onAbrir}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Estante);
