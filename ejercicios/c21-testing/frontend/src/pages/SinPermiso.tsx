import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

// La cara del 403: sabemos quién sos, pero tu rol no alcanza. No cierra la sesión.
export default function SinPermiso() {
  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 640 }}>
        <Alert variant="warning">
          <Alert.Heading>No tenés permiso</Alert.Heading>
          <p className="mb-0">Tu usuario no tiene acceso a esta sección.</p>
        </Alert>
        <Link to="/catalogo" className="btn btn-dark">
          Volver al catálogo
        </Link>
      </div>
    </section>
  );
}
