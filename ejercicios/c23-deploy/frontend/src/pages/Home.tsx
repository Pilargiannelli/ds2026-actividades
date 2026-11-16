import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import EnFoco from "../components/EnFoco";
import PortadaLibro from "../components/PortadaLibro";
import { acentoDe } from "../components/Estante/acentos";
import { IconoCategoria } from "../components/Estante/iconos";
import type { Libro } from "../types/libro";
import { formatearPrecio } from "../utils/formatearPrecio";
import "./tienda.css";

interface Props {
  libros: Libro[];
}

// Los libros con portada propia de la casa (public/img) se ven siempre, aunque no haya red.
const conPortadaLocal = (l: Libro) => !!l.imagen?.startsWith("/");
const conPortada = (l: Libro) => !!l.imagen;

interface Estante {
  nombre: string;
  orden: number;
  cantidad: number;
  muestra: Libro[]; // hasta tres tapas para la tarjeta
}

function estantesDe(libros: Libro[]): Estante[] {
  const porNombre = new Map<string, Estante>();
  for (const libro of libros) {
    for (const c of libro.categorias ?? []) {
      if (c.orden == null) continue; // solo las categorías que son estante
      const e = porNombre.get(c.nombre) ?? { nombre: c.nombre, orden: c.orden, cantidad: 0, muestra: [] };
      e.cantidad += 1;
      if (e.muestra.length < 3 && conPortada(libro)) e.muestra.push(libro);
      porNombre.set(c.nombre, e);
    }
  }
  return [...porNombre.values()].sort((a, b) => a.orden - b.orden);
}

function TarjetaLibro({ libro, etiqueta, className }: { libro: Libro; etiqueta: string; className: string }) {
  return (
    <Link to={`/libros/${libro.id}`} className={`inicio-flotante ${className}`}>
      <PortadaLibro libro={libro} className="inicio-flotante__portada" chica />
      <span className="inicio-flotante__texto">
        <span className="inicio-flotante__etiqueta">{etiqueta}</span>
        <span className="inicio-flotante__titulo">{libro.titulo}</span>
        <span className="inicio-flotante__autor">{libro.autor.nombre}</span>
        <span className="inicio-flotante__precio">{formatearPrecio(libro.precio)}</span>
      </span>
    </Link>
  );
}

export default function Home({ libros }: Props) {
  useEffect(() => {
    document.title = "Marea — Un océano de historias | Pilar Giannelli";
  }, []);

  const estantes = useMemo(() => estantesDe(libros), [libros]);
  const [elegido, otro] = useMemo(() => {
    const locales = libros.filter((l) => conPortadaLocal(l) && l.disponible);
    return [locales[0], locales[1]];
  }, [libros]);

  return (
    <div className="inicio">
      {/* 1. Portada: texto a la izquierda, la sala de lectura de fondo y dos fichas flotando */}
      <section className="inicio-hero">
        <img src="/img/biblio.avif" alt="" className="inicio-hero__foto" />
        <div className="inicio-hero__velo" aria-hidden="true" />
        <div className="container inicio-hero__contenido">
          <p className="inicio-volanta">Un océano de historias</p>
          <h1 className="inicio-hero__titulo">
            Leé sin
            <br />
            <span className="acento-script">apuro.</span>
          </h1>
          <p className="inicio-hero__bajada">
            Arquitectura, diseño, arte, fotografía y literatura: {libros.length > 0 ? `${libros.length} libros` : "libros"}{" "}
            elegidos uno por uno, ordenados en estantes para recorrer con calma.
          </p>
          <div className="inicio-hero__acciones">
            <Link to="/catalogo" className="tienda__boton">
              Explorar el catálogo <i className="bi bi-arrow-right ms-1" aria-hidden="true"></i>
            </Link>
            <Link to="/contacto" className="inicio-hero__secundario">
              <i className="bi bi-geo-alt me-1" aria-hidden="true"></i>Visitanos en la librería
            </Link>
          </div>
        </div>

        {elegido && <TarjetaLibro libro={elegido} etiqueta="Elegido del estante" className="inicio-flotante--uno" />}
        {otro && <TarjetaLibro libro={otro} etiqueta="Para empezar" className="inicio-flotante--dos" />}

        <span className="inicio-hero__scroll" aria-hidden="true">
          Bajá
        </span>
      </section>

      {/* 2. Un estante para cada búsqueda */}
      {estantes.length > 0 && (
        <section className="inicio-estantes container" aria-labelledby="inicio-estantes-titulo">
          <p className="inicio-volanta">Elegí tu estante</p>
          <h2 id="inicio-estantes-titulo" className="inicio-seccion__titulo">
            Un libro para cada búsqueda.
          </h2>
          <ul className="inicio-estantes__grilla">
            {estantes.map((e) => (
              <li key={e.nombre}>
                <Link
                  to={`/catalogo?categoria=${encodeURIComponent(e.nombre)}`}
                  className="inicio-estante"
                  style={{ "--acento": acentoDe(e.nombre) } as CSSProperties}
                >
                  <span className="inicio-estante__tapas" aria-hidden="true">
                    {/* Sin tapas cargadas: el ícono del estante, grande */}
                    <span className="inicio-estante__fondo">
                      <IconoCategoria nombre={e.nombre} />
                    </span>
                    {e.muestra.map((l) => (
                      <PortadaLibro key={l.id} libro={l} className="inicio-estante__tapa" chica soloImagen />
                    ))}
                  </span>
                  <span className="inicio-estante__pie">
                    <span className="inicio-estante__icono" aria-hidden="true">
                      <IconoCategoria nombre={e.nombre} />
                    </span>
                    <span className="inicio-estante__textos">
                      <span className="inicio-estante__nombre">{e.nombre}</span>
                      <span className="inicio-estante__cantidad">{e.cantidad} libros</span>
                    </span>
                    <span className="inicio-estante__flecha" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Banda ondulada: cómo usar la librería */}
      <section className="inicio-banda" aria-labelledby="inicio-banda-titulo">
        <svg className="inicio-banda__ola inicio-banda__ola--arriba" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C 240 90, 480 0, 720 40 S 1200 80, 1440 30 L1440 0 L0 0 Z" />
        </svg>
        <div className="container">
          <p className="inicio-volanta inicio-volanta--clara">Tu biblioteca, a tu manera</p>
          <h2 id="inicio-banda-titulo" className="inicio-seccion__titulo inicio-seccion__titulo--claro">
            Guardá, elegí y <span className="acento-script">llevate.</span>
          </h2>
          <div className="inicio-banda__tarjetas">
            <Link to="/favoritos" className="inicio-paso">
              <span className="inicio-paso__icono">
                <i className="bi bi-heart" aria-hidden="true"></i>
              </span>
              <span className="inicio-paso__titulo">Favoritos</span>
              <span className="inicio-paso__texto">Marcá con «Me gusta» los libros que querés tener a mano.</span>
            </Link>
            <Link to="/carrito" className="inicio-paso">
              <span className="inicio-paso__icono">
                <i className="bi bi-bag" aria-hidden="true"></i>
              </span>
              <span className="inicio-paso__titulo">Carrito</span>
              <span className="inicio-paso__texto">Sumá los que te llevás y mirá el total antes de reservar.</span>
            </Link>
            <Link to="/mi-cuenta" className="inicio-paso">
              <span className="inicio-paso__icono">
                <i className="bi bi-person" aria-hidden="true"></i>
              </span>
              <span className="inicio-paso__titulo">Mi cuenta</span>
              <span className="inicio-paso__texto">Tus datos, tus favoritos y tu carrito, en un solo lugar.</span>
            </Link>
          </div>
        </div>
        <svg className="inicio-banda__ola inicio-banda__ola--abajo" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 50 C 300 0, 520 90, 820 40 S 1260 10, 1440 50 L1440 80 L0 80 Z" />
        </svg>
      </section>

      {/* 4. Selección de la semana */}
      <EnFoco />

      {/* 5. Cierre: contacto */}
      <section className="inicio-cierre container">
        <div className="inicio-cierre__caja">
          <div>
            <p className="inicio-volanta">¿Buscás algo puntual?</p>
            <h2 className="inicio-seccion__titulo">Te ayudamos a encontrarlo.</h2>
            <p className="inicio-cierre__texto">
              Escribinos y te contamos si lo tenemos, cuándo llega o qué otro libro te puede gustar.
            </p>
          </div>
          <Link to="/contacto" className="tienda__boton">
            Escribinos <i className="bi bi-envelope ms-1" aria-hidden="true"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
