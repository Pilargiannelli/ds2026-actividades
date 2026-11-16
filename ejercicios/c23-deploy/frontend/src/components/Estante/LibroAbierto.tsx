import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useTienda } from "../../context/TiendaContext";
import { apiFetch } from "../../services/api";
import type { Categoria, Libro } from "../../types/libro";
import { formatearPrecio } from "../../utils/formatearPrecio";
import { LomoCara, PortadaTipografica } from "./Caras";
import { aparienciaDelLibro, notaDePortada, tamanoAbierto } from "./libroVisual";
import { usePortada } from "./usePortada";

// Estados del libro seleccionado. "cerrado" = en el estante (hover es CSS puro).
export type Fase = "cerrado" | "extrayendo" | "girando" | "abriendo" | "abierto" | "cerrando" | "regresando";

interface Props {
  libro: Libro;
  origen: HTMLElement; // el botón-lomo en el estante
  meGusta: boolean;
  onMeGusta: () => void;
  onFase: (fase: Fase) => void;
  onTerminar: () => void;
}

interface Geometria {
  W: number; // ancho de tapa
  H: number; // alto
  D: number; // grosor (lomo)
  w: number; // ancho del lomo en el estante
  h: number; // alto del lomo en el estante
  movil: boolean;
}

interface Pose {
  x: number;
  y: number;
  z: number;
  s: number;
  ry: number;
}

// Curvas: salida rápida y asentada; giro y apertura con aceleración y frenado largos.
const SALIDA = "cubic-bezier(.2, .7, .3, 1)";
const GIRO = "cubic-bezier(.62, 0, .24, 1)";
const APERTURA = "cubic-bezier(.45, .05, .2, 1)";
const ENTRADA = "cubic-bezier(.4, 0, .6, 1)";

const pose = (p: Pose) =>
  `translate3d(${p.x}px, ${p.y}px, ${p.z}px) scale3d(${p.s}, ${p.s}, ${p.s}) rotateY(${p.ry}deg)`;
const tapa = (D: number, angulo: number) => `translateZ(${D / 2}px) rotateY(${angulo}deg)`;

// FLIP: la pose que hace coincidir el libro 3D (tamaño final) con el lomo del estante.
// rotateY(90°) deja el lomo de frente; scale lleva el alto final al del estante;
// el translateZ compensa la perspectiva para que el lomo quede del mismo tamaño en pantalla.
function posesDesde(rect: DOMRect, g: Geometria) {
  const s = rect.height / g.H || 0.0001;
  const base: Pose = {
    x: rect.left + rect.width / 2 - g.W / 2,
    y: rect.top + rect.height / 2 - g.H / 2,
    z: -(g.W * s) / 2,
    s,
    ry: 90,
  };
  // Fuera del estante: un poco hacia arriba y hacia el espectador.
  const afuera: Pose = { ...base, y: base.y - 22, z: base.z + 150 };
  return { base, afuera };
}

function posesCentro(g: Geometria) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const x = vw / 2 - g.W / 2;
  // Siempre por debajo del botón Cerrar (que queda bajo la barra de navegación).
  const y = g.movil ? Math.max(150, (vh - g.H) / 2 + 30) : Math.max(160, (vh - g.H) / 2 + 24);
  // z = -D/2: la tapa (y después las páginas) quedan en z = 0, sin agrandarse por la
  // perspectiva, así el texto de la ficha se ve nítido.
  const centro: Pose = { x, y, z: -g.D / 2, s: 1, ry: 0 };
  // Abierto: en escritorio se corre W/2 para centrar la doble página;
  // en móvil queda centrada la página derecha (la ficha).
  const abierto: Pose = { ...centro, x: g.movil ? x : x + g.W / 2 };
  return { centro, abierto };
}

function calcularGeometria(origen: HTMLElement, proporcion: number): Geometria {
  const w = origen.offsetWidth || 40;
  const h = origen.offsetHeight || 280;
  const { W, H, movil } = tamanoAbierto(window.innerWidth, window.innerHeight, proporcion);
  // Mismo cociente grosor/alto que en el estante: el libro mantiene su identidad.
  return { W, H, D: Math.round((w * H) / h), w, h, movil };
}

function prefiereMenosMovimiento(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const pausa = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Animaciones con Web Animations API. Al terminar, la pose final queda escrita en el
// style y la animación se cancela: nunca se acumulan animaciones con fill.
function crearAnimador(sinMovimiento: boolean) {
  const activas = new Set<Animation>();
  return {
    async animar(el: HTMLElement, desde: string, hasta: string, ms: number, easing: string) {
      if (sinMovimiento || typeof el.animate !== "function") {
        el.style.transform = hasta;
        return;
      }
      const a = el.animate([{ transform: desde }, { transform: hasta }], { duration: ms, easing, fill: "forwards" });
      activas.add(a);
      try {
        await a.finished;
        el.style.transform = hasta;
      } finally {
        activas.delete(a);
        a.cancel();
      }
    },
    cancelarTodo() {
      activas.forEach((a) => a.cancel());
      activas.clear();
    },
  };
}

type Animador = ReturnType<typeof crearAnimador>;

export default function LibroAbierto({ libro, origen, meGusta, onMeGusta, onFase, onTerminar }: Props) {
  const portada = usePortada(libro.imagen ?? undefined);
  const apariencia = aparienciaDelLibro(libro, portada);
  const { agregarAlCarrito, estaEnCarrito } = useTienda();
  const [g] = useState(() => calcularGeometria(origen, portada.proporcion));
  // Sin animaciones (movimiento reducido, o un entorno sin Web Animations) no hay pausas
  // de presentación: cada pose se aplica de inmediato.
  const [reducido] = useState(() => prefiereMenosMovimiento() || typeof Element.prototype.animate !== "function");
  const [fase, setFase] = useState<Fase>("extrayendo");
  // El listado ya trae las categorías; si no vinieran, se piden al detalle.
  const [categorias, setCategorias] = useState<Categoria[] | null>(libro.categorias ?? null);

  const raizRef = useRef<HTMLDivElement>(null);
  const libroRef = useRef<HTMLDivElement>(null);
  const tapaRef = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const faseRef = useRef<Fase>("extrayendo");
  const cierrePendiente = useRef(false);
  const animadorRef = useRef<Animador | null>(null);
  const tituloId = useId();

  const cambiarFase = useCallback(
    (f: Fase) => {
      faseRef.current = f;
      setFase(f);
      onFase(f);
    },
    [onFase],
  );

  const cerrar = useCallback(async () => {
    const actual = faseRef.current;
    if (actual === "cerrando" || actual === "regresando") return;
    // Todavía abriéndose: cierra apenas termine, sin cortar la animación a la mitad.
    if (actual !== "abierto") {
      cierrePendiente.current = true;
      return;
    }

    const an = animadorRef.current;
    const libroEl = libroRef.current;
    const tapaEl = tapaRef.current;
    if (!an || !libroEl || !tapaEl) return;
    const { centro, abierto } = posesCentro(g);

    try {
      cambiarFase("cerrando"); // la ficha se desvanece (CSS)
      await pausa(reducido ? 0 : 140);
      await Promise.all([
        an.animar(tapaEl, tapa(g.D, -180), tapa(g.D, 0), 420, APERTURA),
        an.animar(libroEl, pose(abierto), pose(centro), 420, APERTURA),
      ]);

      // El estante pudo moverse (scroll, resize): se mide recién ahora.
      origen.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "instant" });
      const { base, afuera } = posesDesde(origen.getBoundingClientRect(), g);
      cambiarFase("regresando");
      await an.animar(libroEl, pose(centro), pose(afuera), 440, GIRO);
      await an.animar(libroEl, pose(afuera), pose(base), 220, ENTRADA);
      if (reducido) await pausa(220); // el fundido de salida (CSS)
      onTerminar();
    } catch {
      // animación cancelada al desmontar
    }
  }, [g, reducido, origen, cambiarFase, onTerminar]);

  // Secuencia de apertura: estante → afuera → gira y se centra → se abre.
  useLayoutEffect(() => {
    const libroEl = libroRef.current;
    const tapaEl = tapaRef.current;
    if (!libroEl || !tapaEl) return;

    const { base, afuera } = posesDesde(origen.getBoundingClientRect(), g);
    const { centro, abierto } = posesCentro(g);
    // Antes del primer paint: el libro 3D aparece exactamente encima del lomo.
    libroEl.style.transform = pose(base);
    tapaEl.style.transform = tapa(g.D, 0);

    const an = crearAnimador(reducido);
    animadorRef.current = an;
    let vivo = true;
    cambiarFase("extrayendo");

    (async () => {
      try {
        await an.animar(libroEl, pose(base), pose(afuera), 220, SALIDA);
        if (!vivo) return;
        cambiarFase("girando");
        await an.animar(libroEl, pose(afuera), pose(centro), 480, GIRO);
        if (!vivo) return;
        // Una pausa breve con la portada de frente, a tamaño completo, para reconocerla.
        await pausa(reducido ? 0 : 90);
        if (!vivo) return;
        cambiarFase("abriendo");
        await Promise.all([
          an.animar(tapaEl, tapa(g.D, 0), tapa(g.D, -180), 540, APERTURA),
          an.animar(libroEl, pose(centro), pose(abierto), 540, APERTURA),
        ]);
        if (!vivo) return;
        cambiarFase("abierto");
        cerrarRef.current?.focus({ preventScroll: true });
        if (cierrePendiente.current) void cerrar();
      } catch {
        // cancelada (StrictMode desmonta y vuelve a montar en desarrollo)
      }
    })();

    return () => {
      vivo = false;
      an.cancelarTodo();
    };
    // Solo al montar: cada selección monta un LibroAbierto nuevo (key = id).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape cierra; Tab queda dentro de la ficha mientras está abierta.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        void cerrar();
        return;
      }
      if (e.key !== "Tab" || !raizRef.current) return;
      const enfocables = raizRef.current.querySelectorAll<HTMLElement>("button, a[href]");
      if (enfocables.length === 0) return;
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      } else if (!raizRef.current.contains(document.activeElement)) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [cerrar]);

  // Si cambia el tamaño de la ventana con el libro abierto, se recoloca al centro.
  useEffect(() => {
    const alRedimensionar = () => {
      if (faseRef.current === "abierto" && libroRef.current) {
        libroRef.current.style.transform = pose(posesCentro(g).abierto);
      }
    };
    window.addEventListener("resize", alRedimensionar);
    return () => window.removeEventListener("resize", alRedimensionar);
  }, [g]);

  useEffect(() => {
    if (libro.categorias) return;
    let vivo = true;
    apiFetch<Libro>(`/libros/${libro.id}`)
      .then((detalle) => vivo && setCategorias(detalle.categorias ?? []))
      .catch(() => vivo && setCategorias([]));
    return () => {
      vivo = false;
    };
  }, [libro.id, libro.categorias]);

  const conImagen = portada.estado === "ok";
  // Primero la categoría del estante (las que tienen orden), después las etiquetas.
  const nombresCategorias = [...(categorias ?? [])]
    .sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity))
    .map((c) => c.nombre);
  const edicion = [libro.editorial, libro.anio].filter(Boolean).join(", ");

  const cuerpo = (
    <div
      ref={raizRef}
      className={`lb${reducido ? " lb--reducido" : ""}${g.movil ? " lb--movil" : ""}`}
      data-fase={fase}
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
    >
      <div className="lb__fondo" onClick={() => void cerrar()} aria-hidden="true" />

      <button ref={cerrarRef} type="button" className="lb__cerrar" onClick={() => void cerrar()}>
        Cerrar <span aria-hidden="true">×</span>
      </button>

      <div className="lb__escena">
        <div
          ref={libroRef}
          className="lb__libro"
          style={{ width: g.W, height: g.H, "--D": `${g.D}px`, "--base": apariencia.base } as CSSProperties}
        >
          <div className="lb-cara lb-cara--contratapa" />
          <div className="lb-cara lb-cara--lomo">
            <div className="lb-cara__lomo-escala" style={{ width: g.w, height: g.h, transform: `scale(${g.H / g.h})` }}>
              <LomoCara libro={libro} apariencia={apariencia} />
            </div>
          </div>
          <div className="lb-cara lb-cara--canto" />
          <div className="lb-cara lb-cara--cabeza" />
          <div className="lb-cara lb-cara--pie" />

          {/* Página derecha: la ficha */}
          <div className="lb-pagina lb-pagina--der">
            <div className="lb-info">
              {g.movil && conImagen && <img className="lb-info__miniatura" src={libro.imagen ?? undefined} alt="" />}

              <p className="lb-info__volanta">{nombresCategorias.join(" · ")}</p>
              <h2 id={tituloId} className="lb-info__titulo">
                {libro.titulo}
              </h2>
              <p className="lb-info__autor">{libro.autor.nombre}</p>

              {libro.descripcion && <p className="lb-info__descripcion">{libro.descripcion}</p>}

              <dl className="lb-info__datos">
                {edicion && (
                  <div>
                    <dt>Primera edición</dt>
                    <dd>{edicion}</dd>
                  </div>
                )}
                {libro.autor.nacionalidad && (
                  <div>
                    <dt>Nacionalidad del autor</dt>
                    <dd>{libro.autor.nacionalidad}</dd>
                  </div>
                )}
                {nombresCategorias.length > 0 && (
                  <div>
                    <dt>{nombresCategorias.length > 1 ? "Categorías" : "Categoría"}</dt>
                    <dd>{nombresCategorias.join(", ")}</dd>
                  </div>
                )}
                <div>
                  <dt>Precio</dt>
                  <dd>{formatearPrecio(libro.precio)}</dd>
                </div>
                <div>
                  <dt>Estado</dt>
                  <dd className={libro.disponible ? "" : "lb-info__agotado"}>
                    {libro.disponible ? "Disponible" : "Agotado"}
                  </dd>
                </div>
              </dl>

              <div className="lb-info__acciones">
                <button type="button" className="lb-info__megusta" aria-pressed={meGusta} onClick={onMeGusta}>
                  <span aria-hidden="true">{meGusta ? "♥" : "♡"}</span> {meGusta ? "Te gusta" : "Me gusta"}
                </button>
                {libro.disponible && (
                  <button
                    type="button"
                    className="lb-info__megusta"
                    aria-pressed={estaEnCarrito(libro.id)}
                    onClick={() => agregarAlCarrito(libro.id)}
                  >
                    <span aria-hidden="true">{estaEnCarrito(libro.id) ? "✓" : "+"}</span>{" "}
                    {estaEnCarrito(libro.id) ? "En el carrito" : "Al carrito"}
                  </button>
                )}
                <Link to={`/libros/${libro.id}`} className="lb-info__enlace">
                  Ver ficha completa <span aria-hidden="true">→</span>
                </Link>
              </div>

              <button type="button" className="lb-info__volver" onClick={() => void cerrar()}>
                <span aria-hidden="true">←</span> Volver al estante
              </button>
            </div>
          </div>

          {/* La tapa: por fuera la portada, por dentro la página izquierda */}
          <div ref={tapaRef} className="lb-tapa">
            <div className="lb-tapa__frente">
              {conImagen ? (
                <img src={libro.imagen ?? undefined} alt="" className="lb-tapa__imagen" />
              ) : (
                <PortadaTipografica libro={libro} apariencia={apariencia} />
              )}
            </div>
            <div className="lb-tapa__dorso lb-pagina lb-pagina--izq">
              <figure className="lb-lamina">
                {conImagen ? (
                  <>
                    <img src={libro.imagen ?? undefined} alt={`Portada de ${libro.titulo}`} className="lb-lamina__imagen" />
                    {notaDePortada(libro.imagen) && (
                      <figcaption className="lb-lamina__nota">{notaDePortada(libro.imagen)}</figcaption>
                    )}
                  </>
                ) : (
                  <>
                    <div className="lb-lamina__tipo">
                      <PortadaTipografica libro={libro} apariencia={apariencia} />
                    </div>
                    <figcaption className="lb-lamina__nota">
                      Representación provisional · no es la portada oficial
                    </figcaption>
                  </>
                )}
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(cuerpo, document.body);
}
