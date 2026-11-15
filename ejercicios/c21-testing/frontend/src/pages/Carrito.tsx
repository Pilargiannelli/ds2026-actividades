import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import PortadaLibro from "../components/PortadaLibro";
import { MAX_POR_LIBRO, useTienda } from "../context/TiendaContext";
import { useAuth } from "../context/AuthContext";
import type { Libro } from "../types/libro";
import { formatearPrecio } from "../utils/formatearPrecio";
import "./tienda.css";

interface Props {
  libros: Libro[];
  loading: boolean;
}

export default function Carrito({ libros, loading }: Props) {
  const { carrito, cambiarCantidad, quitarDelCarrito, vaciarCarrito, unidadesEnCarrito } = useTienda();
  const { usuario } = useAuth();

  useEffect(() => {
    document.title = "Carrito | Libreria - Pilar Giannelli";
    return () => {
      document.title = "Libreria - Pilar Giannelli";
    };
  }, []);

  // Precio y datos siempre del catálogo: el carrito solo guarda ids y cantidades.
  const items = carrito
    .map((i) => ({ ...i, libro: libros.find((l) => l.id === i.libroId) }))
    .filter((i): i is typeof i & { libro: Libro } => i.libro !== undefined);
  const total = items.reduce((s, i) => s + i.libro.precio * i.cantidad, 0);

  return (
    <section className="tienda">
      <header className="tienda__cabecera container">
        <p className="tienda__volanta">Tu selección</p>
        <h1 className="tienda__titulo">Carrito</h1>
      </header>

      <div className="container">
        {loading ? (
          <div className="tienda__vacio" role="status">
            <Spinner animation="border" size="sm" className="me-2" /> Cargando…
          </div>
        ) : items.length === 0 ? (
          <div className="tienda__vacio">
            <i className="bi bi-bag tienda__vacio-icono" aria-hidden="true"></i>
            <p className="tienda__vacio-titulo">Tu carrito está vacío.</p>
            <p>Recorré los estantes y sumá los libros que quieras llevarte.</p>
            <Link to="/catalogo" className="tienda__boton">
              Ir al catálogo <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        ) : (
          <div className="carrito">
            <ul className="carrito__lista" aria-label="Libros en el carrito">
              {items.map(({ libro, cantidad }) => (
                <li key={libro.id} className="carrito__item">
                  <Link to={`/libros/${libro.id}`} className="carrito__portada" tabIndex={-1} aria-hidden="true">
                    <PortadaLibro libro={libro} className="carrito__imagen" />
                  </Link>
                  <div className="carrito__datos">
                    <Link to={`/libros/${libro.id}`} className="carrito__titulo">
                      {libro.titulo}
                    </Link>
                    <p className="carrito__autor">{libro.autor.nombre}</p>
                    <p className="carrito__unitario">{formatearPrecio(libro.precio)} c/u</p>
                    {!libro.disponible && <p className="carrito__aviso">Este libro se agotó.</p>}
                  </div>
                  <div className="carrito__cantidad" role="group" aria-label={`Cantidad de ${libro.titulo}`}>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(libro.id, cantidad - 1)}
                      aria-label={cantidad === 1 ? `Quitar ${libro.titulo}` : "Restar uno"}
                    >
                      −
                    </button>
                    <span aria-live="polite">{cantidad}</span>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(libro.id, cantidad + 1)}
                      disabled={cantidad >= MAX_POR_LIBRO}
                      aria-label="Sumar uno"
                    >
                      +
                    </button>
                  </div>
                  <p className="carrito__subtotal">{formatearPrecio(libro.precio * cantidad)}</p>
                  <button
                    type="button"
                    className="carrito__quitar"
                    onClick={() => quitarDelCarrito(libro.id)}
                    aria-label={`Quitar ${libro.titulo} del carrito`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                </li>
              ))}
            </ul>

            <aside className="carrito__resumen" aria-label="Resumen de compra">
              <h2 className="carrito__resumen-titulo">Resumen</h2>
              <dl>
                <div>
                  <dt>Libros</dt>
                  <dd>{unidadesEnCarrito}</dd>
                </div>
                <div className="carrito__total">
                  <dt>Total al retirar</dt>
                  <dd>{formatearPrecio(total)}</dd>
                </div>
              </dl>
              {/* La librería no cobra en línea: el carrito termina en una reserva. */}
              <p className="carrito__nota">
                No cobramos en línea: reservás estos libros sin costo y los pagás al retirarlos en la librería.
              </p>
              <Link to="/contacto" className="tienda__boton w-100">
                Reservar estos libros
              </Link>
              {!usuario && (
                <p className="carrito__nota">
                  <Link to="/login">Ingresá</Link> para ver tu carrito desde Mi cuenta.
                </p>
              )}
              <button type="button" className="tienda__enlace" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
