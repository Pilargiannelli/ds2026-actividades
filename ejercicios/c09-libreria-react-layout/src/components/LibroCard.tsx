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
      <img src={libro.img} className="card-img-top book-card__cover" alt={libro.titulo} />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{libro.titulo}</h5>
        <p className="card-text text-muted mb-3">
          <i className="bi bi-person me-1"></i>
          {libro.autor}
        </p>

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
