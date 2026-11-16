import { useEffect, useState } from "react";
import { PROPORCION_DEFAULT, colorDominante } from "./libroVisual";

export interface Portada {
  estado: "cargando" | "ok" | "error";
  color: string | null; // color dominante del borde izquierdo (el que toca el lomo)
  proporcion: number; // ancho / alto real de la imagen
}

const CARGANDO: Portada = { estado: "cargando", color: null, proporcion: PROPORCION_DEFAULT };
const SIN_IMAGEN: Portada = { estado: "error", color: null, proporcion: PROPORCION_DEFAULT };

// Caché de módulo: el lomo y el libro abierto leen la misma portada sin volver a analizarla.
const cache = new Map<string, Portada>();
const pendientes = new Map<string, Promise<Portada>>();

function analizar(src: string): Promise<Portada> {
  const enCurso = pendientes.get(src);
  if (enCurso) return enCurso;

  const promesa = new Promise<Portada>((resolve) => {
    const img = new Image();
    img.decoding = "async";

    img.onload = () => {
      let color: string | null = null;
      try {
        const alto = 48;
        const ancho = Math.max(4, Math.round((alto * img.naturalWidth) / img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0, ancho, alto);
          // La franja izquierda de la tapa es la que continúa en el lomo de un libro real.
          const franja = Math.max(2, Math.round(ancho * 0.18));
          color = colorDominante(ctx.getImageData(0, 0, franja, alto).data);
        }
      } catch {
        color = null; // canvas bloqueado: queda el color de reserva
      }
      resolve({ estado: "ok", color, proporcion: img.naturalWidth / img.naturalHeight });
    };
    img.onerror = () => resolve(SIN_IMAGEN);
    img.src = src;
  }).then((portada) => {
    cache.set(src, portada);
    pendientes.delete(src);
    return portada;
  });

  pendientes.set(src, promesa);
  return promesa;
}

// `activo` = false posterga la descarga (carga diferida: el lomo todavía no está cerca
// de la vista). Lo ya analizado sale de la caché igual.
export function usePortada(src: string | null | undefined, activo = true): Portada {
  const [portada, setPortada] = useState<Portada>(() =>
    src ? (cache.get(src) ?? CARGANDO) : SIN_IMAGEN,
  );

  useEffect(() => {
    if (!src || !activo) return;
    let vivo = true;
    analizar(src).then((p) => {
      if (vivo) setPortada(p);
    });
    return () => {
      vivo = false;
    };
  }, [src, activo]);

  return portada;
}
