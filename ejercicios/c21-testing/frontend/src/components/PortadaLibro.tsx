import type { Libro } from "../types/libro";
import { PortadaTipografica } from "./Estante/Caras";
import { aparienciaDelLibro, notaDePortada } from "./Estante/libroVisual";
import { usePortada } from "./Estante/usePortada";
import "./Estante/estante.css";

interface Props {
  libro: Libro;
  className?: string;
  conNota?: boolean; // muestra de dónde sale la portada (Open Library / primera edición)
  chica?: boolean; // miniatura: pide a Open Library la versión mediana, más liviana
  soloImagen?: boolean; // sin imagen (o si falla) no muestra nada: para collages decorativos
}

// La portada de un libro en cualquier parte del sitio: la imagen real si carga; si no hay
// o falla, la portada tipográfica (rotulada "provisional") que se ve en el estante.
export default function PortadaLibro({ libro, className = "", conNota = false, chica = false, soloImagen = false }: Props) {
  const src = chica ? libro.imagen?.replace(/-L\.jpg/, "-M.jpg") : libro.imagen;
  const portada = usePortada(src);
  const apariencia = aparienciaDelLibro(libro, portada);
  const nota = conNota ? notaDePortada(libro.imagen) : null;

  if (src && portada.estado !== "error") {
    return (
      <figure className="portada-libro m-0">
        <img src={src} alt={`Portada de ${libro.titulo}`} className={className} loading="lazy" />
        {nota && <figcaption className="portada-libro__nota">{nota}</figcaption>}
      </figure>
    );
  }
  if (soloImagen) return null;
  return (
    <div className={`${className} portada-libro--provisional`} role="img" aria-label={`Portada provisional de ${libro.titulo}`}>
      <PortadaTipografica libro={libro} apariencia={apariencia} />
    </div>
  );
}
