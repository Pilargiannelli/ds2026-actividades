import { useMemo, useState } from "react";
import LibroCard from "../components/LibroCard";
import { libros } from "../data/libros";

export default function Catalogo() {
  const [termino, setTermino] = useState("");

  const resultados = useMemo(() => {
    const q = termino.trim().toLowerCase();
    if (!q) return libros;
    return libros.filter((libro) =>
      `${libro.titulo} ${libro.autor} ${libro.genero}`.toLowerCase().includes(q)
    );
  }, [termino]);

  return (
    <>
      <section className="catalogo__hero">
        <div className="container">
          <h1 className="catalogo__hero-title">Catálogo de libros</h1>
          <p className="catalogo__hero-subtitle">
            Buscá entre los títulos disponibles en Cúspide.
          </p>

          <div className="catalogo__search">
            <div className="input-group input-group-lg catalogo__input-group">
              <span className="input-group-text catalogo__input-icon">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control catalogo__input"
                placeholder="Buscá por título, autor o género..."
                aria-label="Buscar libros"
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
              />
              <button className="btn catalogo__btn-search" type="button">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="catalogo__results py-5">
        <div className="container">
          {resultados.length > 0 ? (
            <>
              <p className="catalogo__results-count mb-4">
                {termino ? (
                  <>
                    Se encontraron <strong>{resultados.length}</strong> resultados para "
                    <em>{termino}</em>".
                  </>
                ) : (
                  <>
                    Mostrando los <strong>{libros.length}</strong> libros de nuestro catálogo.
                  </>
                )}
              </p>

              <div className="row g-4">
                {resultados.map((libro) => (
                  <div className="col-12 col-sm-6 col-lg-4" key={libro.id}>
                    <LibroCard libro={libro} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="catalogo__initial text-center py-5">
              <i className="bi bi-book catalogo__initial-icon"></i>
              <h2 className="catalogo__initial-title">Sin resultados</h2>
              <p className="text-muted">
                No encontramos libros para "{termino}". Probá con otro término.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
