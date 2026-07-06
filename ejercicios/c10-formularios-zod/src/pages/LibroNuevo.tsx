import type { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { libroSchema, type LibroValidado } from "../schemas/libroSchema";
import type { NuevoLibro } from "../types/libro";

interface Props {
  agregarLibro: (libro: NuevoLibro) => void;
}

type LibroFormInput = z.input<typeof libroSchema>;

export default function LibroNuevo({ agregarLibro }: Props) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LibroFormInput, unknown, LibroValidado>({
    resolver: zodResolver(libroSchema),
    defaultValues: { titulo: "", autor: "", precio: 0, disponible: true },
  });

  const onSubmit = (data: LibroValidado) => {
    agregarLibro(data);
    navigate("/catalogo");
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="mb-4">Agregar libro</h1>

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="titulo">
            <Form.Label>Título</Form.Label>
            <Form.Control type="text" isInvalid={!!errors.titulo} {...register("titulo")} />
            <Form.Control.Feedback type="invalid">{errors.titulo?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="autor">
            <Form.Label>Autor</Form.Label>
            <Form.Control type="text" isInvalid={!!errors.autor} {...register("autor")} />
            <Form.Control.Feedback type="invalid">{errors.autor?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="precio">
            <Form.Label>Precio</Form.Label>
            <Form.Control type="number" isInvalid={!!errors.precio} {...register("precio")} />
            <Form.Control.Feedback type="invalid">{errors.precio?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="disponible">
            <Form.Check type="checkbox" label="Disponible" {...register("disponible")} />
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
