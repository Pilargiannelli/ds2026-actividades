import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

// Carrito y favoritos: estado global con el mismo patrón que AuthContext (contexto,
// proveedor y hooks propios). Por ahora viven en el navegador (localStorage): el back
// todavía no tiene pedidos ni favoritos. Se guarda solo el id del libro: precio, título
// y portada se leen siempre del catálogo, así nunca quedan desactualizados.
export interface ItemCarrito {
  libroId: number;
  cantidad: number;
}

interface TiendaContextType {
  carrito: ItemCarrito[];
  unidadesEnCarrito: number;
  agregarAlCarrito: (libroId: number) => void;
  cambiarCantidad: (libroId: number, cantidad: number) => void;
  quitarDelCarrito: (libroId: number) => void;
  vaciarCarrito: () => void;
  estaEnCarrito: (libroId: number) => boolean;

  favoritos: ReadonlySet<number>;
  esFavorito: (libroId: number) => boolean;
  alternarFavorito: (libroId: number) => void;
}

const CLAVE_CARRITO = "libreria:carrito";
const CLAVE_FAVORITOS = "libreria:favoritos";
export const MAX_POR_LIBRO = 10;

// localStorage puede no estar (modo privado, tests): se usa si está, si no, solo memoria.
function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin almacenamiento: el estado sigue funcionando en esta pestaña
  }
}

// eslint-disable-next-line react/only-export-components
export const TiendaContext = createContext<TiendaContextType | null>(null);

export function TiendaProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>(() =>
    leer<ItemCarrito[]>(CLAVE_CARRITO, []).filter((i) => Number.isInteger(i.libroId) && i.cantidad > 0),
  );
  const [favoritos, setFavoritos] = useState<ReadonlySet<number>>(() => new Set(leer<number[]>(CLAVE_FAVORITOS, [])));

  useEffect(() => guardar(CLAVE_CARRITO, carrito), [carrito]);
  useEffect(() => guardar(CLAVE_FAVORITOS, [...favoritos]), [favoritos]);

  const agregarAlCarrito = useCallback((libroId: number) => {
    setCarrito((prev) => {
      const item = prev.find((i) => i.libroId === libroId);
      if (!item) return [...prev, { libroId, cantidad: 1 }];
      return prev.map((i) => (i.libroId === libroId ? { ...i, cantidad: Math.min(i.cantidad + 1, MAX_POR_LIBRO) } : i));
    });
  }, []);

  const cambiarCantidad = useCallback((libroId: number, cantidad: number) => {
    setCarrito((prev) =>
      cantidad < 1
        ? prev.filter((i) => i.libroId !== libroId)
        : prev.map((i) => (i.libroId === libroId ? { ...i, cantidad: Math.min(cantidad, MAX_POR_LIBRO) } : i)),
    );
  }, []);

  const quitarDelCarrito = useCallback((libroId: number) => {
    setCarrito((prev) => prev.filter((i) => i.libroId !== libroId));
  }, []);

  const vaciarCarrito = useCallback(() => setCarrito([]), []);

  const alternarFavorito = useCallback((libroId: number) => {
    setFavoritos((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(libroId)) siguiente.delete(libroId);
      else siguiente.add(libroId);
      return siguiente;
    });
  }, []);

  const valor = useMemo<TiendaContextType>(
    () => ({
      carrito,
      unidadesEnCarrito: carrito.reduce((n, i) => n + i.cantidad, 0),
      agregarAlCarrito,
      cambiarCantidad,
      quitarDelCarrito,
      vaciarCarrito,
      estaEnCarrito: (id) => carrito.some((i) => i.libroId === id),
      favoritos,
      esFavorito: (id) => favoritos.has(id),
      alternarFavorito,
    }),
    [carrito, favoritos, agregarAlCarrito, cambiarCantidad, quitarDelCarrito, vaciarCarrito, alternarFavorito],
  );

  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useTienda(): TiendaContextType {
  const contexto = useContext(TiendaContext);
  if (!contexto) throw new Error("useTienda debe usarse dentro de <TiendaProvider>");
  return contexto;
}
