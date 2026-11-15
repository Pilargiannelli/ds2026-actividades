import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthContext } from "../context/AuthContext";
import { TiendaProvider } from "../context/TiendaContext";
import type { Libro } from "../types/libro";
import Carrito from "./Carrito";
import Favoritos from "./Favoritos";
import LibroDetalle from "./LibroDetalle";
import { Route, Routes } from "react-router-dom";

const autor = { id: 1, nombre: "Julio Cortázar", nacionalidad: "Argentina" };
const libro = (id: number, titulo: string, precio: number, disponible = true): Libro => ({
  id,
  titulo,
  precio,
  imagen: null,
  disponible,
  autorId: 1,
  autor,
  categorias: [],
});
const libros = [libro(1, "Rayuela", 20000), libro(2, "Bestiario", 15000), libro(3, "Final del juego", 18000, false)];

const sinSesion = {
  usuario: null,
  cargando: false,
  estaAutenticado: false,
  tieneRol: () => false,
  login: async () => {},
  logout: () => {},
};

// Ficha, carrito y favoritos comparten el mismo TiendaProvider, como en la app.
function renderTienda(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthContext.Provider value={sinSesion}>
        <TiendaProvider>
          <Routes>
            <Route path="/libros/:id" element={<LibroDetalle libros={libros} loading={false} error={null} />} />
            <Route path="/carrito" element={<Carrito libros={libros} loading={false} />} />
            <Route path="/favoritos" element={<Favoritos libros={libros} loading={false} />} />
          </Routes>
        </TiendaProvider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("Carrito y favoritos", () => {
  beforeEach(() => localStorage.clear());

  it("carrito vacío: invita a ir al catálogo", () => {
    renderTienda("/carrito");
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ir al catálogo/ })).toHaveAttribute("href", "/catalogo");
  });

  it("desde la ficha: agrega al carrito y el carrito suma cantidades y total", () => {
    renderTienda("/libros/1");
    fireEvent.click(screen.getByRole("button", { name: /Agregar al carrito/ }));
    // Ya agregado, el botón lleva al carrito.
    fireEvent.click(screen.getByRole("button", { name: /Ver carrito/ }));

    const lista = screen.getByRole("list", { name: "Libros en el carrito" });
    // Por el enlace: la portada provisional también lleva el título.
    expect(within(lista).getByRole("link", { name: "Rayuela" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sumar uno" }));

    const resumen = screen.getByRole("complementary", { name: "Resumen de compra" });
    expect(within(resumen).getByText("2")).toBeInTheDocument();
    expect(within(resumen).getByText(/40\.000/)).toBeInTheDocument();
  });

  it("restar la última unidad saca el libro del carrito", () => {
    localStorage.setItem("libreria:carrito", JSON.stringify([{ libroId: 2, cantidad: 1 }]));
    renderTienda("/carrito");
    fireEvent.click(screen.getByRole("button", { name: "Quitar Bestiario" }));
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  it("un libro agotado no se puede agregar", () => {
    renderTienda("/libros/3");
    expect(screen.getByRole("button", { name: /Agotado/ })).toBeDisabled();
  });

  it("guardar en favoritos desde la ficha lo muestra en /favoritos (y persiste)", () => {
    const { unmount } = renderTienda("/libros/2");
    fireEvent.click(screen.getByRole("button", { name: /Guardar en favoritos/ }));
    expect(screen.getByRole("button", { name: /En favoritos/ })).toHaveAttribute("aria-pressed", "true");
    unmount();

    renderTienda("/favoritos");
    const lista = screen.getByRole("list", { name: "Libros favoritos" });
    expect(within(lista).getByRole("link", { name: "Bestiario" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Quitar Bestiario de favoritos" }));
    expect(screen.getByText("Todavía no guardaste libros.")).toBeInTheDocument();
  });
});
