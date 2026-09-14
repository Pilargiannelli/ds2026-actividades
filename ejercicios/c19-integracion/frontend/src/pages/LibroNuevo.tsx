import { useEffect, useState } from "react";
import type { z } from "zod";
import { Link } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { libroSchema, type LibroValidado } from "../schemas/libroSchema";
import { apiFetch } from "../services/api";
import type { Autor } from "../types/libro";

type LibroFormInput = z.input<typeof libroSchema>;

export default function LibroNuevo() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LibroFormInput, unknown, LibroValidado>({
    resolver: zodResolver(libroSchema),
    defaultValues: { titulo: "", precio: 0, imagen: "", autorId: 0, disponible: true },
  });

  useEffect(() => {
    apiFetch<Autor[]>("/autores")
      .then(setAutores)
      .catch(() => setAutores([])); // el catálogo de autores es secundario acá
  }, []);

  const onSubmit = async (datos: LibroValidado) => {
    setErrorApi(null);
    try {
      // apiFetch manda el token solo, si hay uno guardado en sesión.
      await apiFetch("/libros", { method: "POST", body: JSON.stringify(datos) });
      // Recarga completa para que el catálogo vuelva a pedir la lista actualizada.
      window.location.href = "/catalogo";
    } catch (err) {
      // acá aparece el 401 (sin token), el 403 (rol CLIENTE) o el 400 (Zod del back)
      setErrorApi(err instanceof Error ? err.message : "Error desconocido al crear el libro.");
    }
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="mb-4">Agregar libro</h1>

        {errorApi && <Alert variant="danger">{errorApi}</Alert>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="titulo">
            <Form.Label>Título</Form.Label>
            <Form.Control type="text" isInvalid={!!errors.titulo} {...register("titulo")} />
            <Form.Control.Feedback type="invalid">{errors.titulo?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="autorId">
            <Form.Label>Autor</Form.Label>
            <Form.Select isInvalid={!!errors.autorId} {...register("autorId")}>
              <option value={0}>Elegí un autor...</option>
              {autores.map((autor) => (
                <option key={autor.id} value={autor.id}>
                  {autor.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.autorId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="precio">
            <Form.Label>Precio</Form.Label>
            <Form.Control type="number" isInvalid={!!errors.precio} {...register("precio")} />
            <Form.Control.Feedback type="invalid">{errors.precio?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="imagen">
            <Form.Label>Imagen (ruta)</Form.Label>
            <Form.Control
              type="text"
              placeholder="/img/mi-libro.jpg"
              isInvalid={!!errors.imagen}
              {...register("imagen")}
            />
            <Form.Control.Feedback type="invalid">{errors.imagen?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="disponible">
            <Form.Check type="checkbox" label="Disponible" {...register("disponible")} />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="dark" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar libro"}
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
