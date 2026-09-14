import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValidado } from "../schemas/loginSchema";
import { apiFetch } from "../services/api";
import { guardarToken } from "../services/sesion";
import type { Sesion } from "../types/auth";

export default function Login() {
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValidado>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (datos: LoginValidado) => {
    setErrorApi(null);
    try {
      const sesion = await apiFetch<Sesion>("/auth/login", {
        method: "POST",
        body: JSON.stringify(datos),
      });
      guardarToken(sesion.token);
      navigate("/catalogo");
    } catch (err) {
      // el mensaje real del back: "Credenciales inválidas", genérico en los dos casos de falla
      setErrorApi(err instanceof Error ? err.message : "Error desconocido al iniciar sesión.");
    }
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1 className="mb-4">Iniciar sesión</h1>

        {errorApi && <Alert variant="danger">{errorApi}</Alert>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" isInvalid={!!errors.email} {...register("email")} />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" isInvalid={!!errors.password} {...register("password")} />
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="dark" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Ingresar"}
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
