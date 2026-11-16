import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import PortadaLibro from "../components/PortadaLibro";
import { useTienda } from "../context/TiendaContext";
import type { Libro } from "../types/libro";
import { formatearPrecio } from "../utils/formatearPrecio";
import "./tienda.css";

interface Props {
  libros: Libro[];
  loading: boolean;
}

export default function Favoritos({ libros, loading }: Props) {
  const { favoritos, alternarFavorito, agregarAlCarrito, estaEnCarrito } = useTienda();

  useEffect(() => {
    document.title = "Favoritos | Libreria - Pilar Giannelli";
    return () => {
      document.title = "Libreria - Pilar Giannelli";
    };
  }, []);

  const guardados = libros.filter((l) => favoritos.has(l.id));

  return (
    <section className="tienda">
      <header className="tienda__cabecera container">
        <p className="tienda__volanta">Para leer después</p>
        <h1 className="tienda__titulo">Favoritos</h1>
        {guardados.length > 0 && (
          <p className="tienda__bajada">
            {guardados.length === 1 ? "1 libro guardado" : `${guardados.length} libros guardados`}
          </p>
        )}
      </header>

      <div className="container">
        {loading ? (
          <div className="tienda__vacio" role="status">
            <Spinner animation="border" size="sm" className="me-2" /> Cargando…
          </div>
        ) : guardados.length === 0 ? (
          <div className="tienda__vacio">
            <i className="bi bi-heart tienda__vacio-icono" aria-hidden="true"></i>
            <p className="tienda__vacio-titulo">Todavía no guardaste libros.</p>
            <p>Abrí un libro del estante y tocá «Me gusta» para encontrarlo acá.</p>
            <Link to="/catalogo" className="tienda__boton">
              Explorar el catálogo <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        ) : (
          <ul className="favoritos" aria-label="Libros favoritos">
            {guardados.map((libro) => (
              <li key={libro.id} className="favoritos__item">
                <Link to={`/libros/${libro.id}`} className="favoritos__portada">
                  <PortadaLibro libro={libro} className="favoritos__imagen" />
                </Link>
                <button
                  type="button"
                  className="favoritos__corazon"
                  onClick={() => alternarFavorito(libro.id)}
                  aria-label={`Quitar ${libro.titulo} de favoritos`}
                >
                  <i className="bi bi-heart-fill" aria-hidden="true"></i>
                </button>
                <Link to={`/libros/${libro.id}`} className="favoritos__titulo">
                  {libro.titulo}
                </Link>
                <p className="favoritos__autor">{libro.autor.nombre}</p>
                <div className="favoritos__pie">
                  <span className="favoritos__precio">{formatearPrecio(libro.precio)}</span>
                  {libro.disponible ? (
                    <button
                      type="button"
                      className="favoritos__carrito"
                      onClick={() => agregarAlCarrito(libro.id)}
                      disabled={estaEnCarrito(libro.id)}
                    >
                      {estaEnCarrito(libro.id) ? "En el carrito" : "Al carrito"}
                    </button>
                  ) : (
                    <span className="favoritos__agotado">Agotado</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
