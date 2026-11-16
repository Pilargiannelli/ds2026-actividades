import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { Ref } from "react";
import type { Libro } from "../../types/libro";
import Estante from "./Estante";
import FlechasEstante from "./FlechasEstante";
import LibroAbierto from "./LibroAbierto";
import type { Fase } from "./LibroAbierto";
import { agruparEnSecciones } from "./secciones";
import "./biblioteca.css";

// Lo que la biblioteca expone hacia afuera (el buscador abre el primer resultado).
export interface BibliotecaApi {
  localizarYAbrir: (libro: Libro) => void;
}

interface Props {
  libros: Libro[]; // ya filtrados: la biblioteca solo los acomoda en sus estantes
  meGusta: ReadonlySet<number>;
  onMeGusta: (id: number) => void;
  ref?: Ref<BibliotecaApi>;
}

interface Seleccion {
  libro: Libro;
  origen: HTMLButtonElement;
}

const prefiereMenosMovimiento = () =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Espera a que termine un desplazamiento suave (scrollend, con un tope por si no llega).
function finDeDesplazamiento(elementos: (EventTarget | null)[], tope = 1100): Promise<void> {
  return new Promise((resolve) => {
    let listo = false;
    const terminar = () => {
      if (listo) return;
      listo = true;
      elementos.forEach((el) => el?.removeEventListener("scrollend", alTerminar));
      resolve();
    };
    // Un solo scrollend no alcanza: puede terminar primero el estante y después la página.
    let pendientes = 0;
    const alTerminar = () => {
      pendientes -= 1;
      if (pendientes <= 0) setTimeout(terminar, 60);
    };
    elementos.forEach((el) => {
      if (!el) return;
      pendientes += 1;
      el.addEventListener("scrollend", alTerminar);
    });
    setTimeout(terminar, tope);
  });
}

// La biblioteca: un índice de categorías y un estante por categoría.
// Coordina la selección para todos los estantes: un único libro abierto por vez.
export default function Biblioteca({ libros, meGusta, onMeGusta, ref }: Props) {
  const secciones = useMemo(() => agruparEnSecciones(libros), [libros]);
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [fase, setFase] = useState<Fase>("cerrado");
  const raizRef = useRef<HTMLDivElement>(null);
  const devolverFoco = useRef<HTMLButtonElement | null>(null);
  const pistas = useRef(new Map<string, HTMLDivElement>());
  // La selección también en un ref: `abrir` queda estable y los lomos memorizados
  // no se vuelven a pintar cada vez que se abre o cierra un libro.
  const seleccionRef = useRef<Seleccion | null>(null);
  seleccionRef.current = seleccion;
  const localizando = useRef(false);

  const obtenerPista = useCallback((id: string) => pistas.current.get(id), []);

  // Un callback ref estable por estante (uno nuevo en cada render anularía el memo).
  const refsDePista = useMemo(
    () =>
      new Map(
        secciones.map((s) => [
          s.id,
          (el: HTMLDivElement | null) => {
            if (el) pistas.current.set(s.id, el);
            else pistas.current.delete(s.id);
          },
        ]),
      ),
    [secciones],
  );

  const abrir = useCallback((libro: Libro, origen: HTMLButtonElement) => {
    if (seleccionRef.current) return; // un libro por vez: evita animaciones cruzadas
    setSeleccion({ libro, origen });
  }, []);

  // Desde el buscador: lleva el lomo a la vista (página y estante) y lo abre con la
  // misma animación que un clic.
  const localizarYAbrir = useCallback(
    async (libro: Libro) => {
      const boton = raizRef.current?.querySelector<HTMLButtonElement>(`.lomo[data-libro="${libro.id}"]`);
      if (!boton || seleccionRef.current || localizando.current) return;
      localizando.current = true;
      try {
        if (typeof boton.scrollIntoView === "function") {
          const suave = !prefiereMenosMovimiento();
          boton.scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "center", inline: "center" });
          if (suave) await finDeDesplazamiento([window, boton.closest(".estante__pista")]);
          // Ajuste final instantáneo (las secciones fuera de vista se pintan recién ahora).
          boton.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
        }
        boton.focus({ preventScroll: true });
        abrir(libro, boton);
      } finally {
        localizando.current = false;
      }
    },
    [abrir],
  );

  useImperativeHandle(ref, () => ({ localizarYAbrir }), [localizarYAbrir]);

  const terminar = useCallback(() => {
    devolverFoco.current = seleccion?.origen ?? null;
    setSeleccion(null);
    setFase("cerrado");
  }, [seleccion]);

  // El foco vuelve al lomo del que salió el libro. En un efecto (después del commit):
  // antes, el lomo todavía está oculto y no puede recibir foco.
  useEffect(() => {
    if (seleccion || !devolverFoco.current) return;
    devolverFoco.current.focus({ preventScroll: true });
    devolverFoco.current = null;
  }, [seleccion]);

  // Primera visita (una vez por sesión): un libro del primer estante se adelanta un
  // instante y muestra "Abrir libro", para comunicar que los lomos se abren. Sin
  // ventanas ni tutoriales; con movimiento reducido no se ejecuta.
  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    try {
      if (sessionStorage.getItem("biblioteca-invitacion")) return;
    } catch {
      return; // sin sessionStorage (modo privado estricto): mejor no repetirla en cada carga
    }
    let lomo: HTMLElement | null = null;
    const inicio = window.setTimeout(() => {
      // La marca se guarda recién cuando la invitación arranca (React en modo estricto
      // monta dos veces en desarrollo: marcar antes la cancelaría).
      try {
        sessionStorage.setItem("biblioteca-invitacion", "1");
      } catch {
        /* sin almacenamiento: igual se muestra esta vez */
      }
      const visibles = [...(raizRef.current?.querySelectorAll<HTMLElement>(".lomo") ?? [])].slice(0, 8);
      lomo = visibles[Math.min(2, visibles.length - 1)] ?? null;
      lomo?.classList.add("lomo--invitacion");
    }, 1100);
    const fin = window.setTimeout(() => lomo?.classList.remove("lomo--invitacion"), 1100 + 2600);
    return () => {
      window.clearTimeout(inicio);
      window.clearTimeout(fin);
      lomo?.classList.remove("lomo--invitacion");
    };
  }, []);

  return (
    <div ref={raizRef} className="biblioteca" data-fase={fase}>
      {secciones.map((s, i) => (
        <section key={s.id} id={s.id} className="biblioteca__seccion" aria-labelledby={`${s.id}-titulo`}>
          <header className="biblioteca__cabecera container">
            <span className="biblioteca__numero" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 id={`${s.id}-titulo`} className="biblioteca__titulo" tabIndex={-1}>
              {s.nombre}
            </h2>
            <span className="biblioteca__cantidad">
              {s.libros.length} {s.libros.length === 1 ? "título" : "títulos"}
            </span>
            <FlechasEstante nombre={s.nombre} pistaId={s.id} obtenerPista={obtenerPista} />
          </header>

          <Estante
            libros={s.libros}
            categoria={s.nombre}
            etiqueta={s.nombre}
            pistaRef={refsDePista.get(s.id)}
            seleccionId={seleccion?.libro.id ?? null}
            bloqueado={seleccion !== null}
            onAbrir={abrir}
          />
        </section>
      ))}

      {seleccion && (
        <LibroAbierto
          key={seleccion.libro.id}
          libro={seleccion.libro}
          origen={seleccion.origen}
          meGusta={meGusta.has(seleccion.libro.id)}
          onMeGusta={() => onMeGusta(seleccion.libro.id)}
          onFase={setFase}
          onTerminar={terminar}
        />
      )}
    </div>
  );
}
