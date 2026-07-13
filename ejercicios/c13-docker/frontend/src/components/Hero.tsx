import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__left">
        <div className="hero__text-inner">
          <p className="hero__eyebrow">Tu próxima historia te espera</p>

          <h1 className="hero__title">
            Librería<br />
            <span>Cúspide</span>
          </h1>

          <p className="hero__subtitle">
            Explorá nuestra colección de libros cuidadosamente seleccionados:
            clásicos, novedades y los títulos que están definiendo la
            literatura de hoy.
          </p>

          <div className="hero__actions">
            <Link to="/catalogo" className="hero__link">
              Ver catálogo <i className="bi bi-arrow-right"></i>
            </Link>
            <Link to="/contacto" className="hero__link hero__link--secondary">
              Contacto
            </Link>
          </div>
        </div>
      </div>

      <div className="hero__right">
        <img
          src="/img/biblio.avif"
          alt="Estantería de libros de Cúspide"
          className="hero__image"
        />
      </div>
    </section>
  );
}
