import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTienda } from "../../context/TiendaContext";
import Logo from "./Logo";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { usuario, cargando, logout, tieneRol } = useAuth();
  const { favoritos, unidadesEnCarrito } = useTienda();

  const manejarSesion = () => {
    if (usuario) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <Navbar expand="lg" variant="dark" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo" aria-label="Marea, inicio">
          <Logo />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="mainNav" />

        <Navbar.Collapse id="mainNav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/" active={pathname === "/"}>
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/catalogo" active={pathname === "/catalogo"}>
              Catálogo
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto" active={pathname === "/contacto"}>
              Contacto
            </Nav.Link>
            {/* Esconder ≠ proteger: la ruta además está detrás de PrivateRoute */}
            {tieneRol("ADMIN") && (
              <Nav.Link as={Link} to="/libros/nuevo" active={pathname === "/libros/nuevo"}>
                Nuevo libro
              </Nav.Link>
            )}

            {/* Íconos de la tienda: el número es la cantidad, también para lectores de pantalla */}
            <Nav.Link
              as={Link}
              to="/favoritos"
              active={pathname === "/favoritos"}
              className="header-icono ms-lg-2"
              aria-label={`Favoritos (${favoritos.size})`}
            >
              <i className="bi bi-heart" aria-hidden="true"></i>
              <span className="d-lg-none ms-2">Favoritos</span>
              {favoritos.size > 0 && <span className="header-icono__cuenta" aria-hidden="true">{favoritos.size}</span>}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/carrito"
              active={pathname === "/carrito"}
              className="header-icono"
              aria-label={`Carrito (${unidadesEnCarrito})`}
            >
              <i className="bi bi-bag" aria-hidden="true"></i>
              <span className="d-lg-none ms-2">Carrito</span>
              {unidadesEnCarrito > 0 && (
                <span className="header-icono__cuenta" aria-hidden="true">{unidadesEnCarrito}</span>
              )}
            </Nav.Link>
            {usuario && (
              <Nav.Link
                as={Link}
                to="/mi-cuenta"
                active={pathname === "/mi-cuenta"}
                className="header-icono"
                aria-label="Mi cuenta"
              >
                <i className="bi bi-person" aria-hidden="true"></i>
                <span className="d-lg-none ms-2">Mi cuenta</span>
              </Nav.Link>
            )}

            {usuario && <Navbar.Text className="ms-lg-3">Hola, {usuario.nombre}</Navbar.Text>}
            {/* Mientras cargando no sabemos si hay sesión: no mostramos ninguno de los dos */}
            {!cargando && (
              <Button
                variant="outline-light"
                size="sm"
                className="ms-lg-3 mt-2 mt-lg-0"
                onClick={manejarSesion}
              >
                {usuario ? "Salir" : "Ingresar"}
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
