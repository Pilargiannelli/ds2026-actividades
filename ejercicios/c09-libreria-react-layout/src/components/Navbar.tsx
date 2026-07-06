import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-book-half fs-4 me-2"></i>
          <span>Cúspide</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainNav"
          aria-expanded={open}
          aria-label="Abrir menú de navegación"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
                aria-current={pathname === "/" ? "page" : undefined}
                to="/"
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${pathname === "/catalogo" ? "active" : ""}`}
                to="/catalogo"
              >
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${pathname === "/contacto" ? "active" : ""}`}
                to="/contacto"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
