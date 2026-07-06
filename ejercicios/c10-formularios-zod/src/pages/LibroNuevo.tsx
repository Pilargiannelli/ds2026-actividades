import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { libroSchema } from "../schemas/libroSchema";
import type { NuevoLibro } from "../types/libro";

interface Props {
  agregarLibro: (libro: NuevoLibro) => void;
}

interface FormState {
  titulo: string;
  autor: string;
  precio: string;
  disponible: boolean;
}

interface Errores {
  titulo?: string;
  autor?: string;
  precio?: string;
}

const initialForm: FormState = { titulo: "", autor: "", precio: "", disponible: true };

export default function LibroNuevo({ agregarLibro }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errores, setErrores] = useState<Errores>({});
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resultado = libroSchema.safeParse(form);

    if (!resultado.success) {
      const nuevosErrores: Errores = {};
      resultado.error.issues.forEach((issue) => {
        const campo = issue.path[0] as keyof Errores;
        nuevosErrores[campo] = issue.message;
      });
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    agregarLibro(resultado.data);
    navigate("/catalogo");
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="mb-4">Agregar libro</h1>

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="titulo">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              isInvalid={!!errores.titulo}
            />
            <Form.Control.Feedback type="invalid">{errores.titulo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="autor">
            <Form.Label>Autor</Form.Label>
            <Form.Control
              type="text"
              name="autor"
              value={form.autor}
              onChange={handleChange}
              isInvalid={!!errores.autor}
            />
            <Form.Control.Feedback type="invalid">{errores.autor}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="precio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              isInvalid={!!errores.precio}
            />
            <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="disponible">
            <Form.Check
              type="checkbox"
              name="disponible"
              label="Disponible"
              checked={form.disponible}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="dark">
              Agregar libro
            </Button>
            <Link to="/catalogo" className="btn btn-outline-secondary">
              Cancelar
            </Link>
          </div>
        </Form>
      </div>
    </section>
  );
}
