import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import Biblioteca from "../components/Estante/Biblioteca";
import type { BibliotecaApi } from "../components/Estante/Biblioteca";
import FiltrosBiblioteca from "../components/Estante/FiltrosBiblioteca";
import { IconoLibroAbierto } from "../components/Estante/iconos";
import {
  SIN_FILTROS,
  categoriasDelIndice,
  filtrar,
  generosDisponibles,
  hayFiltros,
  indexar,
} from "../components/Estante/busqueda";
import type { Filtros } from "../components/Estante/busqueda";
import type { Libro } from "../types/libro";

interface Props {
  libros: Libro[];
  loading: boolean;
  error: string | null;
}

export default function Catalogo({ libros, loading, error }: Props) {
  const [meGusta, setMeGusta] = useState<ReadonlySet<number>>(() => new Set());
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS);
  const bibliotecaRef = useRef<BibliotecaApi>(null);

  useEffect(() => {
    document.title = "Catálogo | Libreria - Pilar Giannelli";
    return () => {
      document.title = "Libreria - Pilar Giannelli";
    };
  }, []);

  // El índice se arma una vez por catálogo; filtrar recorre cadenas ya normalizadas.
  const indice = useMemo(() => indexar(libros), [libros]);
  const categorias = useMemo(() => categoriasDelIndice(indice), [indice]);
  const generos = useMemo(() => generosDisponibles(indice, filtros.categoria), [indice, filtros.categoria]);

  // useDeferredValue: el input responde al instante y los estantes se reacomodan apenas
  // React tiene un momento libre (nunca se traba el tipeo).
  const filtrosDiferidos = useDeferredValue(filtros);
  const resultados = useMemo(() => filtrar(indice, filtrosDiferidos), [indice, filtrosDiferidos]);

  const cambiarFiltros = useCallback(
    (f: Filtros) => {
      // El género tiene que existir en la categoría elegida; si no, se descarta.
      const validos = generosDisponibles(indice, f.categoria).flatMap((g) => g.generos.map((o) => o.nombre));
      setFiltros(f.genero && !validos.includes(f.genero) ? { ...f, genero: null } : f);
    },
    [indice],
  );

  const alternarMeGusta = useCallback((id: number) => {
    setMeGusta((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  }, []);

  // Limpiar quita búsqueda, categoría y género, pero respeta el orden elegido.
  const limpiar = () => setFiltros((f) => ({ ...SIN_FILTROS, orden: f.orden }));

  return (
    <section className="coleccion">
      <header className="coleccion__cabecera container">
        <h1 className="coleccion__titulo">Encontrá tu próximo libro.</h1>
        <p className="coleccion__bajada">
          Historias, ideas e inspiración te esperan. Explorá nuestra colección y descubrí ese libro que todavía no sabías
          que estabas buscando.
        </p>

        {!loading && !error && (
          <FiltrosBiblioteca
            filtros={filtros}
            onCambiar={cambiarFiltros}
            categorias={categorias}
            generos={generos}
            resultados={resultados.length}
            total={libros.length}
            onAbrirPrimero={() => resultados[0] && bibliotecaRef.current?.localizarYAbrir(resultados[0])}
          />
        )}

        {!loading && !error && resultados.length > 0 && (
          <p className="coleccion__instruccion">
            <span className="coleccion__instruccion-icono">
              <IconoLibroAbierto />
            </span>
            Elegí un libro y descubrí qué tiene para contar.
          </p>
        )}
      </header>

      {loading ? (
        <div className="coleccion__estado" role="status">
          <Spinner animation="border" size="sm" className="me-2" />
          Cargando catálogo…
        </div>
      ) : error ? (
        <div className="container py-4">
          <Alert variant="danger">No pudimos cargar el catálogo: {error}</Alert>
        </div>
      ) : resultados.length > 0 ? (
        // Mientras React prepara los resultados nuevos, los estantes se atenúan apenas:
        // una señal discreta de que la búsqueda se está aplicando.
        <div className="coleccion__resultados" data-actualizando={filtros !== filtrosDiferidos || undefined}>
          <Biblioteca ref={bibliotecaRef} libros={resultados} meGusta={meGusta} onMeGusta={alternarMeGusta} />
        </div>
      ) : hayFiltros(filtrosDiferidos) ? (
        <div className="filtros-vacio container" role="status">
          <span className="filtros-vacio__icono" aria-hidden="true">
            <IconoLibroAbierto />
          </span>
          <p className="filtros-vacio__titulo">No encontramos ese libro, pero todavía hay mucho por descubrir.</p>
          <button type="button" className="filtros-vacio__boton" onClick={limpiar}>
            Ver todos los libros
          </button>
        </div>
      ) : (
        <div className="coleccion__estado">
          <p className="coleccion__vacio-titulo">La biblioteca está vacía</p>
        </div>
      )}
    </section>
  );
}
