import { Link, useParams } from "react-router-dom";
import type { Libro } from "../types/libro";

interface Props {
  libros: Libro[];
}

export default function LibroDetalle({ libros }: Props) {
  const { id } = useParams();
  const libro = libros.find((l) => l.id === Number(id));

  if (!libro) {
    return (
      <section className="book-detail py-5">
        <div className="container text-center">
          <h1 className="book-detail__title">Libro no encontrado</h1>
          <Link to="/catalogo" className="btn book-detail__btn-back mt-3">
            Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="book-detail py-5">
      <div className="container">
        <div className="mb-4">
          <Link to="/catalogo" className="book-detail__back">
            <i className="bi bi-arrow-left me-2"></i>Volver al catálogo
          </Link>
        </div>

        <div className="row g-5 align-items-start">
          <div className="col-12 col-md-4">
            <div className="book-detail__cover-wrapper">
              {libro.img ? (
                <img src={libro.img} alt={libro.titulo} className="book-detail__cover" />
              ) : (
                <div className="book-detail__cover d-flex align-items-center justify-content-center bg-light text-muted">
                  <i className="bi bi-book" style={{ fontSize: "4rem" }}></i>
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-md-8">
            <p className="book-detail__genre">
              <i className="bi bi-bookmark me-1"></i>
              {libro.genero}
            </p>

            <h1 className="book-detail__title">{libro.titulo}</h1>

            <p className="book-detail__author">
              <i className="bi bi-person me-1"></i>
              {libro.autor}
            </p>

            {libro.precio !== undefined && (
              <p className="book-detail__author">
                <span className="fw-bold">${libro.precio.toLocaleString("es-AR")}</span>{" "}
                <span className={`badge ${libro.disponible ? "text-bg-success" : "text-bg-secondary"}`}>
                  {libro.disponible ? "Disponible" : "Agotado"}
                </span>
              </p>
            )}

            <hr className="book-detail__divider" />

            <div className="book-detail__actions">
              <button type="button" className="btn book-detail__btn-buy">
                <i className="bi bi-bag me-2"></i>Comprar
              </button>
              <Link to="/catalogo" className="btn book-detail__btn-back">
                <i className="bi bi-grid me-2"></i>Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
