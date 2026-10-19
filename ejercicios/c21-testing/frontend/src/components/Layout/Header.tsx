import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { usuario, cargando, logout, tieneRol } = useAuth();

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
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <i className="bi bi-book-half fs-4 me-2"></i>
          <span>Cúspide</span>
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
