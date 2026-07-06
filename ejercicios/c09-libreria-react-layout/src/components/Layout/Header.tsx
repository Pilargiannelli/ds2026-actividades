import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <Navbar expand="lg" variant="dark" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <i className="bi bi-book-half fs-4 me-2"></i>
          <span>Cúspide</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="mainNav" />

        <Navbar.Collapse id="mainNav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" active={pathname === "/"}>
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/catalogo" active={pathname === "/catalogo"}>
              Catálogo
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto" active={pathname === "/contacto"}>
              Contacto
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
