import type { CSSProperties } from "react";
import type { Libro } from "../../types/libro";
import { selloEditorial } from "./libroVisual";
import type { Apariencia } from "./libroVisual";

interface Props {
  libro: Libro;
  apariencia: Apariencia;
}

function variables(a: Apariencia): CSSProperties {
  return {
    "--fondo": a.fondo,
    "--tinta": a.tinta,
    "--acento": a.acento,
    "--base": a.base,
    "--banda": a.banda,
  } as CSSProperties;
}

// El lomo. Se usa igual en el estante y en la cara lateral del libro 3D:
// así el libro que sale del estante es literalmente el mismo objeto visual.
export function LomoCara({ libro, apariencia }: Props) {
  return (
    <span
      className={`lomo-cara lomo-cara--${apariencia.estilo} lomo-cara--${apariencia.tipografia} lomo-cara--${apariencia.orientacion}`}
      style={
        {
          ...variables(apariencia),
          // El CSS achica la letra de los títulos y autores largos para que entren en el lomo.
          "--largo-titulo": Math.max(libro.titulo.length, 8),
          "--largo-autor": Math.max(libro.autor.nombre.length, 8),
          backgroundImage: apariencia.estilo === "imagen" && libro.imagen ? `url("${libro.imagen}")` : undefined,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {/* Título y autor juntos: el bloque se lee de arriba abajo o de abajo arriba */}
      <span className="lomo-cara__textos">
        <span className="lomo-cara__titulo">{libro.titulo}</span>
        <span className="lomo-cara__autor">{libro.autor.nombre}</span>
      </span>
      <span className="lomo-cara__sello">{selloEditorial(libro.editorial)}</span>
    </span>
  );
}

// Portada armada solo con tipografía y los datos reales del libro, para los que no
// tienen imagen. Lleva el rótulo "Portada provisional": no imita una portada oficial.
export function PortadaTipografica({ libro, apariencia }: Props) {
  return (
    <div className="portada-tipo" style={variables(apariencia)}>
      <p className="portada-tipo__autor">{libro.autor.nombre}</p>
      <p className="portada-tipo__titulo">{libro.titulo}</p>
      <div className="portada-tipo__pie">
        {libro.editorial && <p className="portada-tipo__sello">{libro.editorial}</p>}
        <p className="portada-tipo__provisional">Portada provisional</p>
      </div>
    </div>
  );
}
