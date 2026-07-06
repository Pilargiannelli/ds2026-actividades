import { Link } from "react-router-dom";

interface Libro {
  titulo: string;
  autor: string;
  img: string;
  badge: "Novedad" | "Disponible";
}

const libros: Libro[] = [
  { titulo: "El arca de Noé", autor: "Beatriz Dourmec y Ayax Barnes", img: "/img/arca.jpg", badge: "Novedad" },
  { titulo: "El principito", autor: "Antoine de Saint-Exupéry", img: "/img/princ.webp", badge: "Disponible" },
  { titulo: "Los dias del venado (Saga confines 1)", autor: "Liliana Bodoc", img: "/img/venado.jpg", badge: "Novedad" },
  { titulo: "Rayuela", autor: "Julio Cortázar", img: "/img/rayuela.webp", badge: "Disponible" },
  { titulo: "La cocina japonesa", autor: "Hiroko Shimbo", img: "/img/hiroko.webp", badge: "Novedad" },
  { titulo: "El faro del fin del mundo", autor: "Julio Verne", img: "/img/faro.jpg", badge: "Disponible" },
  { titulo: "La felicidad conyugal", autor: "León Tolstoi", img: "/img/felicidad.webp", badge: "Novedad" },
];

export default function EnFoco() {
  return (
    <section className="books-scroll py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="books-scroll__label">Selección de la semana</p>
            <h2 className="books-scroll__title">En foco</h2>
          </div>
          <Link to="/catalogo" className="btn books-scroll__catalogue-btn">
            Ir al catálogo
          </Link>
        </div>
      </div>

      <div
        className="books-scroll__track"
        role="region"
        aria-label="Lista de libros deslizable horizontalmente"
        tabIndex={0}
      >
        <div className="books-scroll__spacer" aria-hidden="true"></div>

        {libros.map((libro) => (
          <div className="books-scroll__item" key={libro.titulo}>
            <div className="books-scroll__cover-wrapper">
              <img src={libro.img} alt={libro.titulo} className="books-scroll__cover" />
              <span
                className={`books-scroll__badge ${
                  libro.badge === "Disponible" ? "books-scroll__badge--available" : ""
                }`}
              >
                {libro.badge}
              </span>
            </div>
            <p className="books-scroll__book-title">{libro.titulo}</p>
            <p className="books-scroll__book-author">{libro.autor}</p>
          </div>
        ))}

        <div className="books-scroll__spacer" aria-hidden="true"></div>
      </div>

      <p className="text-center text-muted small mt-2">
        <i className="bi bi-arrow-left-right me-1"></i>
        Deslizá para descubrir más títulos
      </p>
    </section>
  );
}
