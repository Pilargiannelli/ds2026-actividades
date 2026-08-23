import { useState } from "react";
import { Link } from "react-router-dom";
import type { Libro } from "../types/libro";

interface Props {
  libro: Libro;
}

export default function LibroCard({ libro }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="card h-100 shadow-sm border-0 book-card">
      {libro.img ? (
        <img src={libro.img} className="card-img-top book-card__cover" alt={libro.titulo} />
      ) : (
        <div className="card-img-top book-card__cover d-flex align-items-center justify-content-center bg-light text-muted">
          <i className="bi bi-book" style={{ fontSize: "3rem" }}></i>
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{libro.titulo}</h5>
        <p className="card-text text-muted mb-1">
          <i className="bi bi-person me-1"></i>
          {libro.autor}
        </p>

        {libro.precio !== undefined && (
          <p className="card-text mb-3">
            <span className="fw-bold">${libro.precio.toLocaleString("es-AR")}</span>{" "}
            <span className={`badge ${libro.disponible ? "text-bg-success" : "text-bg-secondary"}`}>
              {libro.disponible ? "Disponible" : "Agotado"}
            </span>
          </p>
        )}

        <div className="mt-auto d-flex gap-2">
          <Link to={`/libros/${libro.id}`} className="btn btn-outline-dark">
            Ver más
          </Link>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => setLiked((prev) => !prev)}
          >
            {liked ? "❤️ Me gusta" : "🤍 Me gusta"}
          </button>
        </div>
      </div>
    </article>
  );
}
