import type { ReactNode } from "react";

// Íconos de trazo fino (24×24, currentColor): toman el color de acento de su categoría.
// Decorativos: el nombre de la categoría siempre está escrito al lado (aria-hidden).

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg className="icono" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export const IconoTodas = () => (
  <Svg>
    <path {...trazo} d="M5 4v16M9 4v16M13.5 5l3.5 14.5M19 4l1 1" />
    <path {...trazo} d="M3 20h18" />
  </Svg>
);

export const IconoLibroAbierto = () => (
  <Svg>
    <path {...trazo} d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zm0 0v13" />
  </Svg>
);

export const IconoCheck = () => (
  <Svg>
    <path {...trazo} strokeWidth={2} d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const IconoEtiqueta = () => (
  <Svg>
    <path {...trazo} d="M3.5 12.5V4.5h8l9 9-8 8-9-9z" />
    <circle cx="8" cy="9" r="1.3" fill="currentColor" />
  </Svg>
);

export const IconoOrden = () => (
  <Svg>
    <path {...trazo} d="M7 4v16M3.5 16.5L7 20l3.5-3.5M14 6h7M14 11h5M14 16h3" />
  </Svg>
);

const ICONOS: Record<string, () => ReactNode> = {
  Arquitectura: () => (
    <Svg>
      <path {...trazo} d="M3 20h18M4 9h16M12 3.5L4 9h16zM6.5 9v11M10.5 9v11M13.5 9v11M17.5 9v11" />
    </Svg>
  ),
  "Diseño gráfico": () => (
    <Svg>
      <path {...trazo} d="M12 3l5.5 10L12 21 6.5 13zM12 3v7.5" />
      <circle cx="12" cy="12" r="1.5" {...trazo} />
    </Svg>
  ),
  Arte: () => (
    <Svg>
      <path {...trazo} d="M12 3.5a8.5 8.5 0 100 17c1.3 0 1.8-1 1.4-2-.5-1.3.3-2.5 1.7-2.5H17a3.5 3.5 0 003.5-3.5C20.5 7 16.7 3.5 12 3.5z" />
      <circle cx="8" cy="10" r="1.1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1.1" fill="currentColor" />
      <circle cx="16" cy="10" r="1.1" fill="currentColor" />
    </Svg>
  ),
  Fotografía: () => (
    <Svg>
      <path {...trazo} d="M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4z" />
      <circle cx="12" cy="13" r="3.5" {...trazo} />
    </Svg>
  ),
  Moda: () => (
    <Svg>
      <path {...trazo} d="M12 7.5a2 2 0 112-2M12 7.5v1.5L3.5 15.5c-.8.6-.4 1.5.5 1.5h16c.9 0 1.3-.9.5-1.5L12 9" />
    </Svg>
  ),
  "Diseño industrial": () => (
    <Svg>
      <path {...trazo} d="M7 3.5v9h10M7 12.5V20M17 12.5V20M7 16h10M7 3.5h3" />
    </Svg>
  ),
  Tipografía: () => (
    <Svg>
      <path {...trazo} d="M4 19l5-13.5L14 19M6 14.5h6M15.5 19v-3.5a2.5 2.5 0 015 0V19M20.5 17.5c-.5 1-1.5 1.5-2.5 1.5" />
    </Svg>
  ),
  "Editorial y publicaciones independientes": () => (
    <Svg>
      <path {...trazo} d="M5 3.5h10l4 4V20.5H5zM15 3.5v4h4M8 11h8M8 14h8M8 17h5" />
    </Svg>
  ),
  Literatura: IconoLibroAbierto,
  Gastronomía: () => (
    <Svg>
      <path {...trazo} d="M7 3.5v7M5 3.5v5a2 2 0 004 0v-5M7 10.5V20.5M16.5 20.5V3.5c-2 1-3 3.5-3 7h3" />
    </Svg>
  ),
};

export function IconoCategoria({ nombre }: { nombre: string }) {
  const Icono = ICONOS[nombre] ?? IconoLibroAbierto;
  return <Icono />;
}
