import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTienda } from "../context/TiendaContext";
import "./tienda.css";

// Detrás de <PrivateRoute />: acá siempre hay usuario.
export default function MiCuenta() {
  const { usuario, logout, tieneRol } = useAuth();
  const { unidadesEnCarrito, favoritos } = useTienda();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Mi cuenta | Libreria - Pilar Giannelli";
    return () => {
      document.title = "Libreria - Pilar Giannelli";
    };
  }, []);

  if (!usuario) return null;

  const salir = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="tienda">
      <header className="tienda__cabecera container">
        <p className="tienda__volanta">Mi cuenta</p>
        <h1 className="tienda__titulo">Hola, {usuario.nombre}.</h1>
      </header>

      <div className="container cuenta">
        <div className="cuenta__tarjeta cuenta__tarjeta--datos">
          <h2 className="cuenta__subtitulo">Tus datos</h2>
          <dl className="cuenta__datos">
            <div>
              <dt>Nombre</dt>
              <dd>{usuario.nombre}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{usuario.email}</dd>
            </div>
            <div>
              <dt>Tipo de cuenta</dt>
              <dd>{usuario.rol === "ADMIN" ? "Administración" : "Cliente"}</dd>
            </div>
          </dl>
          <button type="button" className="tienda__enlace" onClick={salir}>
            Cerrar sesión
          </button>
        </div>

        <Link to="/favoritos" className="cuenta__tarjeta cuenta__acceso">
          <i className="bi bi-heart" aria-hidden="true"></i>
          <span className="cuenta__numero">{favoritos.size}</span>
          <span className="cuenta__etiqueta">{favoritos.size === 1 ? "libro en favoritos" : "libros en favoritos"}</span>
        </Link>

        <Link to="/carrito" className="cuenta__tarjeta cuenta__acceso">
          <i className="bi bi-bag" aria-hidden="true"></i>
          <span className="cuenta__numero">{unidadesEnCarrito}</span>
          <span className="cuenta__etiqueta">{unidadesEnCarrito === 1 ? "libro en el carrito" : "libros en el carrito"}</span>
        </Link>

        {tieneRol("ADMIN") && (
          <Link to="/libros/nuevo" className="cuenta__tarjeta cuenta__acceso">
            <i className="bi bi-plus-lg" aria-hidden="true"></i>
            <span className="cuenta__etiqueta">Cargar un libro nuevo</span>
          </Link>
        )}
      </div>
    </section>
  );
}
