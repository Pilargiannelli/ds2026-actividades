import { useEffect, useState } from "react";
import type { RefObject } from "react";

// Un único IntersectionObserver para todos los lomos (con cientos de libros, uno por
// lomo sería caro). Avisa una sola vez cuando el elemento se acerca a la vista.
type Aviso = () => void;
const avisos = new WeakMap<Element, Aviso>();
let observador: IntersectionObserver | null = null;

function obtenerObservador(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  observador ??= new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        avisos.get(e.target)?.();
        avisos.delete(e.target);
        observador?.unobserve(e.target);
      }
    },
    { rootMargin: "300px 600px" }, // un margen generoso: la imagen ya está al llegar
  );
  return observador;
}

export function useCercania(ref: RefObject<Element | null>, habilitado: boolean): boolean {
  const [cerca, setCerca] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!habilitado || cerca || !el) return;
    const obs = obtenerObservador();
    if (!obs) {
      setCerca(true); // sin IntersectionObserver (tests, navegadores viejos): carga directa
      return;
    }
    avisos.set(el, () => setCerca(true));
    obs.observe(el);
    return () => {
      avisos.delete(el);
      obs.unobserve(el);
    };
  }, [ref, habilitado, cerca]);

  return cerca;
}
