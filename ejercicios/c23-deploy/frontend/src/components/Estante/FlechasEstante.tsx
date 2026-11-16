import { useEffect, useState } from "react";

interface Props {
  nombre: string;
  pistaId: string;
  obtenerPista: (id: string) => HTMLDivElement | undefined; // estable
}

const prefiereMenosMovimiento = () =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Flechas discretas para recorrer un estante largo con mouse (sin trackpad, el scroll
// horizontal es incómodo). Solo aparecen si el estante desborda.
export default function FlechasEstante({ nombre, pistaId, obtenerPista }: Props) {
  const [estado, setEstado] = useState({ desborda: false, inicio: true, fin: false });

  useEffect(() => {
    const pista = obtenerPista(pistaId);
    if (!pista) return;
    let cuadro = 0;
    const medir = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        const desborda = pista.scrollWidth > pista.clientWidth + 1;
        setEstado({
          desborda,
          inicio: pista.scrollLeft <= 1,
          fin: pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 1,
        });
      });
    };
    medir();
    pista.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      cancelAnimationFrame(cuadro);
      pista.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, [pistaId, obtenerPista]);

  if (!estado.desborda) return null;

  const mover = (sentido: 1 | -1) => {
    const pista = obtenerPista(pistaId);
    if (!pista) return;
    pista.scrollBy({ left: sentido * pista.clientWidth * 0.8, behavior: prefiereMenosMovimiento() ? "auto" : "smooth" });
  };

  return (
    <span className="flechas">
      <button type="button" className="flechas__boton" onClick={() => mover(-1)} disabled={estado.inicio} aria-label={`Desplazar ${nombre} hacia atrás`}>
        <span aria-hidden="true">←</span>
      </button>
      <button type="button" className="flechas__boton" onClick={() => mover(1)} disabled={estado.fin} aria-label={`Desplazar ${nombre} hacia adelante`}>
        <span aria-hidden="true">→</span>
      </button>
    </span>
  );
}
