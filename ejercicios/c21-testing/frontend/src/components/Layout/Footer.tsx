import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer text-center">
      {/* La marca con su slogan */}
      <p className="site-footer__marca">
        <Logo />
      </p>
      <p className="site-footer__slogan">Un océano de historias</p>

      <nav aria-label="Secciones">
        <ul className="site-footer__nav">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalogo">Catálogo</Link></li>
          <li><Link to="/favoritos">Favoritos</Link></li>
          <li><Link to="/carrito">Carrito</Link></li>
          <li><Link to="/mi-cuenta">Mi cuenta</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>
      <p className="site-footer__copy">© 2026 Marea · Librería</p>
    </footer>
  );
}
