import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import type { Libro } from "../types/libro";
import { formatearPrecio } from "../utils/formatearPrecio";
import PortadaLibro from "../components/PortadaLibro";
import { useTienda } from "../context/TiendaContext";

interface Props {
  libros: Libro[];
  loading: boolean;
  error: string | null;
}

export default function LibroDetalle({ libros, loading, error }: Props) {
  const { id } = useParams();
  const libro = libros.find((l) => l.id === Number(id));
  const navigate = useNavigate();
  const { agregarAlCarrito, estaEnCarrito, esFavorito, alternarFavorito } = useTienda();

  useEffect(() => {
    document.title = libro
      ? `${libro.titulo} | Libreria - Pilar Giannelli`
      : "Libreria - Pilar Giannelli";
    return () => {
      document.title = "Libreria - Pilar Giannelli";
    };
  }, [libro]);

  if (loading) {
    return (
      <section className="book-detail py-5">
        <div className="container d-flex flex-column align-items-center py-5">
          <Spinner animation="border" role="status" className="text-brand mb-3">
            <span className="visually-hidden">Cargando libro...</span>
          </Spinner>
          <p className="text-muted">Cargando libro...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="book-detail py-5">
        <div className="container">
          <Alert variant="danger">No pudimos cargar el libro: {error}</Alert>
        </div>
      </section>
    );
  }

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
              <PortadaLibro libro={libro} className="book-detail__cover" conNota />
            </div>
          </div>

          <div className="col-12 col-md-8">
            {libro.categorias && libro.categorias.length > 0 && (
              <p className="book-detail__genre">
                <i className="bi bi-bookmark me-1"></i>
                {libro.categorias.map((c) => c.nombre).join(", ")}
              </p>
            )}

            <h1 className="book-detail__title">{libro.titulo}</h1>

            <p className="book-detail__author">
              <i className="bi bi-person me-1"></i>
              {libro.autor.nombre}
              {libro.autor.nacionalidad && ` (${libro.autor.nacionalidad})`}
            </p>

            {(libro.editorial || libro.anio) && (
              <p className="book-detail__author">
                Primera edición: {[libro.editorial, libro.anio].filter(Boolean).join(", ")}
              </p>
            )}

            {libro.generos && libro.generos.length > 0 && (
              <ul className="book-detail__generos" aria-label="Géneros">
                {libro.generos.map((g) => (
                  <li key={g} className="book-detail__genero">
                    {g}
                  </li>
                ))}
              </ul>
            )}

            {libro.descripcion ? (
              <p className="book-detail__description">{libro.descripcion}</p>
            ) : (
              <p className="book-detail__description book-detail__description--pendiente">
                Todavía no tenemos una reseña de este libro.
              </p>
            )}

            <p className="book-detail__author">
              <span className="fw-bold">{formatearPrecio(libro.precio)}</span>{" "}
              <span className={`badge ${libro.disponible ? "text-bg-success" : "text-bg-secondary"}`}>
                {libro.disponible ? "Disponible" : "Agotado"}
              </span>
            </p>

            <hr className="book-detail__divider" />

            <div className="book-detail__actions">
              {estaEnCarrito(libro.id) ? (
                <button type="button" className="btn book-detail__btn-buy" onClick={() => navigate("/carrito")}>
                  <i className="bi bi-bag-check me-2"></i>En tu carrito · Ver carrito
                </button>
              ) : (
                <button
                  type="button"
                  className="btn book-detail__btn-buy"
                  disabled={!libro.disponible}
                  onClick={() => agregarAlCarrito(libro.id)}
                >
                  <i className="bi bi-bag me-2"></i>
                  {libro.disponible ? "Agregar al carrito" : "Agotado"}
                </button>
              )}
              <button
                type="button"
                className="btn book-detail__btn-back"
                aria-pressed={esFavorito(libro.id)}
                onClick={() => alternarFavorito(libro.id)}
              >
                <i className={`bi ${esFavorito(libro.id) ? "bi-heart-fill" : "bi-heart"} me-2`}></i>
                {esFavorito(libro.id) ? "En favoritos" : "Guardar en favoritos"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
