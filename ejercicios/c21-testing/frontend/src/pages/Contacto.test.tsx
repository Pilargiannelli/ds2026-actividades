import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthContext } from "../context/AuthContext";
import { TiendaProvider } from "../context/TiendaContext";
import { crearReservaSchema, fechaLocal, sumarDias } from "../schemas/contactoSchema";
import type { Libro } from "../types/libro";
import Contacto from "./Contacto";

const libros: Libro[] = [
  {
    id: 1,
    titulo: "Rayuela",
    precio: 20000,
    imagen: null,
    disponible: true,
    autorId: 1,
    autor: { id: 1, nombre: "Julio Cortázar", nacionalidad: "Argentina" },
    categorias: [],
  },
];

const sinSesion = {
  usuario: null,
  cargando: false,
  estaAutenticado: false,
  tieneRol: () => false,
  login: async () => {},
  logout: () => {},
};

function renderContacto(ruta = "/contacto") {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthContext.Provider value={sinSesion}>
        <TiendaProvider>
          <Contacto libros={libros} />
        </TiendaProvider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

const escribir = (etiqueta: string | RegExp, valor: string) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe("Contacto: reserva", () => {
  beforeEach(() => localStorage.clear());

  it("muestra los libros del carrito con el total a pagar al retirar", () => {
    localStorage.setItem("libreria:carrito", JSON.stringify([{ libroId: 1, cantidad: 2 }]));
    renderContacto();
    const lista = screen.getByRole("list", { name: "Libros a reservar" });
    expect(within(lista).getByText("Rayuela", { selector: ".reserva__libro-titulo" })).toBeInTheDocument();
    expect(screen.getByText("Total a pagar al retirar").nextSibling).toHaveTextContent(/40\.000/);
  });

  it("sin datos: marca los campos obligatorios y no confirma", async () => {
    renderContacto();
    fireEvent.click(screen.getByRole("button", { name: /Enviar reserva/ }));
    expect(await screen.findByText(/escribí qué libro querés reservar/)).toBeInTheDocument();
    expect(screen.getByText("Ingresá tu nombre y apellido.")).toBeInTheDocument();
    expect(screen.getByText(/El DNI tiene 7 u 8 números/)).toBeInTheDocument();
    expect(screen.getByText("Tenés que aceptar las condiciones de la reserva.")).toBeInTheDocument();
    expect(screen.queryByText(/Reserva R-/)).not.toBeInTheDocument();
  });

  it("completa: confirma con código, resume el retiro y vacía el carrito", async () => {
    localStorage.setItem("libreria:carrito", JSON.stringify([{ libroId: 1, cantidad: 1 }]));
    renderContacto();
    escribir("Nombre y apellido", "Ana Pérez");
    escribir("DNI de quien retira", "30.123.456");
    // "Email" también es una opción de aviso: el campo es el input de tipo email.
    fireEvent.change(screen.getByLabelText("Email", { selector: "input[type=email]" }), {
      target: { value: "ana@ejemplo.com" },
    });
    escribir("Teléfono", "11 2345 6789");
    escribir("¿Qué día pensás pasar?", fechaLocal(sumarDias(2)));
    fireEvent.change(screen.getByLabelText("¿Cómo vas a pagar al retirar?"), { target: { value: "debito" } });
    fireEvent.click(screen.getByLabelText(/Entiendo que la reserva no tiene costo/));
    fireEvent.click(screen.getByRole("button", { name: /Enviar reserva/ }));

    expect(await screen.findByText("¡Listo, Ana!")).toBeInTheDocument();
    expect(screen.getByText(/^Reserva R-[A-Z0-9]{6}$/)).toBeInTheDocument();
    expect(screen.getByText(/Tarjeta de débito/)).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem("libreria:carrito")!)).toEqual([]));
  });
});

describe("Contacto: consulta", () => {
  it("?motivo=consulta abre el formulario de consulta", () => {
    renderContacto("/contacto?motivo=consulta");
    expect(screen.getByRole("button", { name: /Hacer una consulta/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("form", { name: "Formulario de consulta" })).toBeInTheDocument();
  });
});

describe("crearReservaSchema", () => {
  const base = {
    nombre: "Ana Pérez",
    dni: "30.123.456",
    email: "ANA@ejemplo.com ",
    telefono: "11 2345 6789",
    aviso: "email",
    retiro: fechaLocal(),
    pago: "efectivo",
    otrosLibros: "",
    comentarios: "",
    condiciones: true,
  };

  it("normaliza el DNI y el email", () => {
    const r = crearReservaSchema(true).parse(base);
    expect(r.dni).toBe("30123456");
    expect(r.email).toBe("ana@ejemplo.com");
  });

  it("rechaza fechas pasadas y demasiado lejanas", () => {
    const esquema = crearReservaSchema(true);
    expect(esquema.safeParse({ ...base, retiro: fechaLocal(sumarDias(-1)) }).success).toBe(false);
    expect(esquema.safeParse({ ...base, retiro: fechaLocal(sumarDias(31)) }).success).toBe(false);
    expect(esquema.safeParse({ ...base, retiro: fechaLocal(sumarDias(30)) }).success).toBe(true);
  });

  it("con el carrito vacío exige escribir un libro", () => {
    expect(crearReservaSchema(false).safeParse(base).success).toBe(false);
    expect(crearReservaSchema(false).safeParse({ ...base, otrosLibros: "Bestiario, Cortázar" }).success).toBe(true);
  });
});
