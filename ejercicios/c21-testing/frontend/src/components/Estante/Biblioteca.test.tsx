import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { Libro } from "../../types/libro";
import { TiendaProvider } from "../../context/TiendaContext";
import Biblioteca from "./Biblioteca";

// Las categorías ya vienen en el listado: la ficha no debería pedir nada.
vi.mock("../../services/api", () => ({ apiFetch: vi.fn(async () => ({})) }));

const arquitectura = { id: 1, nombre: "Arquitectura", orden: 1 };
const tipografia = { id: 7, nombre: "Tipografía", orden: 7 };
const literatura = { id: 9, nombre: "Literatura", orden: 9 };
const clasico = { id: 20, nombre: "Clásico", orden: null };

const libros: Libro[] = [
  {
    id: 10,
    titulo: "Delirious New York",
    precio: 30000,
    imagen: null,
    disponible: true,
    anio: 1978,
    editorial: "Oxford University Press",
    descripcion: "«Manifiesto retroactivo» de Manhattan.",
    autorId: 3,
    autor: { id: 3, nombre: "Rem Koolhaas", nacionalidad: "Países Bajos" },
    categorias: [arquitectura],
  },
  {
    id: 11,
    titulo: "Typographie",
    precio: 25000,
    imagen: null,
    disponible: true,
    anio: 1967,
    editorial: "Arthur Niggli",
    autorId: 4,
    autor: { id: 4, nombre: "Emil Ruder", nacionalidad: "Suiza" },
    categorias: [tipografia],
  },
  {
    id: 2,
    titulo: "Rayuela",
    precio: 11500,
    imagen: "/img/rayuela.webp",
    disponible: true,
    autorId: 2,
    autor: { id: 2, nombre: "Julio Cortázar", nacionalidad: "Argentina" },
    categorias: [literatura, clasico],
  },
];

function renderBiblioteca() {
  return render(
    <MemoryRouter>
      <TiendaProvider>
        <Biblioteca libros={libros} meGusta={new Set()} onMeGusta={() => {}} />
      </TiendaProvider>
    </MemoryRouter>,
  );
}

// jsdom no implementa Web Animations: el libro salta directo a cada pose final.
describe("Biblioteca", () => {
  it("arma un estante por categoría, en el orden de las categorías", () => {
    renderBiblioteca();
    const titulos = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titulos).toEqual(["Arquitectura", "Tipografía", "Literatura"]);

    const estante = screen.getByRole("list", { name: "Tipografía" });
    expect(within(estante).getAllByRole("button")).toHaveLength(1);
    expect(within(estante).getByRole("button", { name: /Typographie, de Emil Ruder/ })).toBeInTheDocument();
  });

  it("abre la ficha con los datos bibliográficos y rotula la portada provisional", async () => {
    renderBiblioteca();
    fireEvent.click(screen.getByRole("button", { name: /Delirious New York/ }));

    const ficha = await screen.findByRole("dialog", { name: "Delirious New York" });
    expect(ficha).toHaveTextContent("Oxford University Press, 1978");
    expect(ficha).toHaveTextContent("«Manifiesto retroactivo» de Manhattan.");
    expect(ficha).toHaveTextContent("Arquitectura");
    expect(ficha).toHaveTextContent(/no es la portada oficial/);
  });

  it("solo un libro abierto a la vez, aunque estén en estantes distintos", async () => {
    renderBiblioteca();
    fireEvent.click(screen.getByRole("button", { name: /Delirious New York/ }));
    await screen.findByRole("dialog");

    fireEvent.click(screen.getByRole("button", { name: /Typographie/, hidden: true }));
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("Escape cierra la ficha y el libro vuelve a su estante con el foco", async () => {
    renderBiblioteca();
    fireEvent.click(screen.getByRole("button", { name: /Rayuela/ }));
    await screen.findByRole("dialog");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    const lomo = within(screen.getByRole("list", { name: "Literatura" })).getByRole("button", { name: /Rayuela/ });
    expect(lomo).not.toHaveAttribute("data-fuera");
    expect(lomo).toHaveFocus();
  });
});
