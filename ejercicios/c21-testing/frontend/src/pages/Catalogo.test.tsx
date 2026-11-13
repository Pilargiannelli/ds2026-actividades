import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { Libro } from "../types/libro";
import Catalogo from "./Catalogo";

vi.mock("../services/api", () => ({ apiFetch: vi.fn(async () => ({})) }));

const literatura = { id: 9, nombre: "Literatura", orden: 9 };
const gastronomia = { id: 10, nombre: "Gastronomía", orden: 10 };
const borges = { id: 4, nombre: "Jorge Luis Borges", nacionalidad: "Argentina" };

const libro = (id: number, titulo: string, autor: Libro["autor"], categoria: typeof literatura, generos: string[], anio: number | null): Libro => ({
  id,
  titulo,
  precio: 1000,
  imagen: null,
  disponible: true,
  autorId: autor.id,
  autor,
  categorias: [categoria],
  generos,
  anio,
});

// Cargados en un orden cualquiera: la biblioteca los ordena sola.
const libros: Libro[] = [
  libro(3, "Rayuela", { id: 2, nombre: "Julio Cortázar", nacionalidad: "Argentina" }, literatura, ["Novela"], 1963),
  libro(1, "Ficciones", borges, literatura, ["Cuentos", "Literatura argentina"], 1944),
  libro(5, "The Cake Bible", { id: 8, nombre: "Rose Levy Beranbaum", nacionalidad: null }, gastronomia, ["Repostería"], 1988),
  libro(2, "Fervor de Buenos Aires", borges, literatura, ["Poesía", "Literatura argentina"], 1923),
  libro(4, "Tartine Bread", { id: 7, nombre: "Chad Robertson", nacionalidad: null }, gastronomia, ["Panadería"], 2010),
];

const renderCatalogo = () =>
  render(
    <MemoryRouter>
      <Catalogo libros={libros} loading={false} error={null} />
    </MemoryRouter>,
  );

const lomos = () => screen.queryAllByRole("button", { name: /Abrir ficha/ });
const titulosEn = (estante: string) =>
  within(screen.getByRole("list", { name: estante }))
    .getAllByRole("button")
    .map((b) => b.getAttribute("aria-label")!.split(", de")[0]);
const buscador = () => screen.getByRole("searchbox", { name: "¿Qué te gustaría leer hoy?" });
const chip = (nombre: RegExp | string) => within(screen.getByRole("group", { name: "Explorá lo que te inspira" })).getByRole("button", { name: nombre });
const select = (nombre: string) => screen.getByRole("combobox", { name: nombre });

describe("Biblioteca: jerarquía, orden y filtros", () => {
  it("muestra el título, el total, la instrucción y los libros de la A a la Z", () => {
    renderCatalogo();
    expect(screen.getByRole("heading", { level: 1, name: "Encontrá tu próximo libro." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Explorá lo que te inspira" })).toBeInTheDocument();
    expect(screen.getByText(/libros para descubrir/)).toHaveTextContent("5 libros para descubrir");
    expect(screen.getByText("Elegí un libro y descubrí qué tiene para contar.")).toBeInTheDocument();
    expect(chip(/^Todas las categorías/)).toHaveAttribute("aria-pressed", "true");
    expect(lomos()).toHaveLength(5);
    expect(titulosEn("Literatura")).toEqual(["Fervor de Buenos Aires", "Ficciones", "Rayuela"]);
    expect(titulosEn("Gastronomía")).toEqual(["Tartine Bread", "The Cake Bible"]);
    expect(screen.queryByRole("button", { name: "Ver toda la colección" })).not.toBeInTheDocument();
  });

  it("el selector de orden reordena los estantes (Z–A y por año)", () => {
    renderCatalogo();
    fireEvent.change(select("Ordenar libros por"), { target: { value: "titulo-desc" } });
    expect(titulosEn("Literatura")).toEqual(["Rayuela", "Ficciones", "Fervor de Buenos Aires"]);
    fireEvent.change(select("Ordenar libros por"), { target: { value: "anio-asc" } });
    expect(titulosEn("Literatura")).toEqual(["Fervor de Buenos Aires", "Ficciones", "Rayuela"]);
    fireEvent.change(select("Ordenar libros por"), { target: { value: "anio-desc" } });
    expect(titulosEn("Gastronomía")).toEqual(["Tartine Bread", "The Cake Bible"]);
  });

  it("el buscador filtra mientras se escribe, mantiene el orden A–Z y tiene un botón para borrar", async () => {
    renderCatalogo();
    fireEvent.change(buscador(), { target: { value: "borges" } });
    await waitFor(() => expect(lomos()).toHaveLength(2));
    expect(titulosEn("Literatura")).toEqual(["Fervor de Buenos Aires", "Ficciones"]);
    expect(screen.getByText(/libros encontrados de 5/)).toHaveTextContent("2 libros encontrados de 5");
    fireEvent.click(screen.getByRole("button", { name: "Borrar la búsqueda" }));
    await waitFor(() => expect(lomos()).toHaveLength(5));
  });

  it("chips de categoría + género + búsqueda se combinan; cada filtro activo se puede quitar", async () => {
    renderCatalogo();
    fireEvent.change(buscador(), { target: { value: "borges" } });
    fireEvent.click(chip(/^Literatura/));
    expect(chip(/^Literatura/)).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(select("¿Qué tipo de libro buscás?"), { target: { value: "Cuentos" } });
    await waitFor(() => expect(lomos()).toHaveLength(1));
    expect(lomos()[0]).toHaveAccessibleName(/Ficciones/);

    const activos = screen.getByRole("list", { name: "Filtros activos" });
    expect(within(activos).getByRole("button", { name: "Quitar género: Cuentos" })).toBeInTheDocument();
    fireEvent.click(within(activos).getByRole("button", { name: "Quitar género: Cuentos" }));
    await waitFor(() => expect(lomos()).toHaveLength(2));
  });

  it("tocar otra vez la categoría elegida la deselecciona", () => {
    renderCatalogo();
    fireEvent.click(chip(/^Gastronomía/));
    expect(chip(/^Gastronomía/)).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(chip(/^Gastronomía/));
    expect(chip(/^Gastronomía/)).toHaveAttribute("aria-pressed", "false");
    expect(chip(/^Todas las categorías/)).toHaveAttribute("aria-pressed", "true");
  });

  it("el género se adapta a la categoría y se descarta si no existe en la nueva", async () => {
    renderCatalogo();
    fireEvent.click(chip(/^Gastronomía/));
    const opciones = within(select("¿Qué tipo de libro buscás?")).getAllByRole("option").map((o) => o.textContent);
    expect(opciones).toEqual(["Todos los tipos de Gastronomía", "Panadería (1)", "Repostería (1)"]);

    fireEvent.click(chip(/^Literatura/));
    fireEvent.change(select("¿Qué tipo de libro buscás?"), { target: { value: "Poesía" } });
    fireEvent.click(chip(/^Gastronomía/));
    expect(select("¿Qué tipo de libro buscás?")).toHaveValue("");
    await waitFor(() => expect(lomos()).toHaveLength(2));
  });

  it("sin coincidencias invita a seguir explorando; «Ver todos los libros» conserva el orden elegido", async () => {
    renderCatalogo();
    fireEvent.change(select("Ordenar libros por"), { target: { value: "titulo-desc" } });
    fireEvent.change(buscador(), { target: { value: "xyz inexistente" } });
    expect(await screen.findByText("No encontramos ese libro, pero todavía hay mucho por descubrir.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ver todos los libros" }));
    await waitFor(() => expect(lomos()).toHaveLength(5));
    expect(buscador()).toHaveValue("");
    expect(select("Ordenar libros por")).toHaveValue("titulo-desc");
  });

  it("Enter en el buscador abre el primer resultado con la ficha", async () => {
    renderCatalogo();
    fireEvent.change(buscador(), { target: { value: "tartine" } });
    await waitFor(() => expect(lomos()).toHaveLength(1));
    fireEvent.keyDown(buscador(), { key: "Enter" });
    expect(await screen.findByRole("dialog", { name: "Tartine Bread" })).toBeInTheDocument();
  });
});
