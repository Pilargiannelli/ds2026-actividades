import { useId, useRef } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { acentoDe } from "./acentos";
import type { Filtros, GrupoGeneros, Orden } from "./busqueda";
import { ORDENES, hayFiltros } from "./busqueda";
import { IconoCategoria, IconoCheck, IconoEtiqueta, IconoOrden, IconoTodas } from "./iconos";
import "./filtros.css";

interface Props {
  filtros: Filtros;
  onCambiar: (f: Filtros) => void;
  categorias: { nombre: string; cantidad: number }[];
  generos: GrupoGeneros[]; // ya adaptados a la categoría elegida
  resultados: number;
  total: number;
  onAbrirPrimero: () => void; // Enter en el buscador
}

// Nombre corto para el chip cuando la categoría es muy larga.
const CORTOS: Record<string, string> = { "Editorial y publicaciones independientes": "Editorial independiente" };

// Recorrido: buscar → explorar (categorías) → refinar (género y orden) → descubrir.
export default function FiltrosBiblioteca({ filtros, onCambiar, categorias, generos, resultados, total, onAbrirPrimero }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const activos = hayFiltros(filtros);
  const variosGrupos = generos.length > 1;
  const sinGeneros = generos.length === 0;

  const cambiar = (parcial: Partial<Filtros>) => onCambiar({ ...filtros, ...parcial });

  const alTeclear = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && resultados > 0) {
      e.preventDefault();
      onAbrirPrimero();
    } else if (e.key === "Escape" && filtros.texto) {
      e.preventDefault();
      cambiar({ texto: "" });
    }
  };

  const limpiarTexto = () => {
    cambiar({ texto: "" });
    inputRef.current?.focus();
  };

  return (
    <div className="filtros" role="search" aria-label="Buscar y explorar libros">
      {/* Búsqueda */}
      <div className="filtros__buscar">
        <label htmlFor={`${id}-texto`} className="filtros__pregunta">
          ¿Qué te gustaría leer hoy?
        </label>
        <div className="filtros__busqueda">
          <svg className="filtros__lupa" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            id={`${id}-texto`}
            className="filtros__input"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Buscá un libro, autor o tema..."
            value={filtros.texto}
            onChange={(e) => cambiar({ texto: e.target.value })}
            onKeyDown={alTeclear}
          />
          {filtros.texto && (
            <button type="button" className="filtros__borrar" onClick={limpiarTexto} aria-label="Borrar la búsqueda">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Exploración: categorías */}
      <section className="filtros__explorar" aria-labelledby={`${id}-cat`}>
        <h2 className="filtros__titulo" id={`${id}-cat`}>
          Explorá lo que te inspira
        </h2>
        <p className="filtros__ayuda">Elegí una categoría para empezar.</p>
        <div className="filtros__chips" role="group" aria-labelledby={`${id}-cat`}>
          <button
            type="button"
            className="chip"
            style={{ "--acento": "var(--color-oliva)" } as CSSProperties}
            aria-pressed={filtros.categoria === null}
            aria-label={`Todas las categorías, ${total} libros`}
            onClick={() => cambiar({ categoria: null })}
          >
            <span className="chip__icono">{filtros.categoria === null ? <IconoCheck /> : <IconoTodas />}</span>
            <span className="chip__nombre">Todas</span>
            <span className="chip__cantidad" aria-hidden="true">
              {total}
            </span>
          </button>
          {categorias.map((c) => {
            const elegida = filtros.categoria === c.nombre;
            return (
              <button
                key={c.nombre}
                type="button"
                className="chip"
                style={{ "--acento": acentoDe(c.nombre) } as CSSProperties}
                aria-pressed={elegida}
                aria-label={`${c.nombre}, ${c.cantidad} libros`}
                onClick={() => cambiar({ categoria: elegida ? null : c.nombre })}
              >
                {/* Seleccionada: el ícono pasa a ser un tilde (no solo cambia el color). */}
                <span className="chip__icono">{elegida ? <IconoCheck /> : <IconoCategoria nombre={c.nombre} />}</span>
                <span className="chip__nombre">{CORTOS[c.nombre] ?? c.nombre}</span>
                <span className="chip__cantidad" aria-hidden="true">
                  {c.cantidad}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Refinamiento: género (destacado) y orden (secundario) */}
      <div className="filtros__refinar">
        <label className={`filtros__campo filtros__campo--genero${filtros.genero ? " filtros__campo--activo" : ""}`}>
          <span className="filtros__etiqueta">¿Qué tipo de libro buscás?</span>
          <span className="filtros__control">
            <span className="filtros__control-icono">
              <IconoEtiqueta />
            </span>
            <select
              className="filtros__select"
              value={filtros.genero ?? ""}
              disabled={sinGeneros}
              onChange={(e) => cambiar({ genero: e.target.value || null })}
            >
              <option value="">{filtros.categoria ? `Todos los tipos de ${filtros.categoria}` : "Todos los tipos"}</option>
              {variosGrupos
                ? generos.map((g) => (
                    <optgroup key={g.categoria} label={g.categoria}>
                      {g.generos.map((o) => (
                        <option key={`${g.categoria}-${o.nombre}`} value={o.nombre}>
                          {o.nombre}
                        </option>
                      ))}
                    </optgroup>
                  ))
                : generos[0]?.generos.map((o) => (
                    <option key={o.nombre} value={o.nombre}>
                      {o.nombre} ({o.cantidad})
                    </option>
                  ))}
            </select>
          </span>
        </label>

        <label className="filtros__campo filtros__campo--orden">
          <span className="filtros__etiqueta">Ordenar libros por</span>
          <span className="filtros__control">
            <span className="filtros__control-icono">
              <IconoOrden />
            </span>
            <select className="filtros__select" value={filtros.orden} onChange={(e) => cambiar({ orden: e.target.value as Orden })}>
              {ORDENES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.etiqueta}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

      {/* Orientación: cuántos hay y qué está aplicado */}
      <div className="filtros__estado">
        <p className="filtros__conteo" aria-live="polite">
          {activos ? (
            <>
              <strong>{resultados}</strong> {resultados === 1 ? "libro encontrado" : "libros encontrados"} de {total}
            </>
          ) : (
            <>
              <strong>{total}</strong> libros para descubrir
            </>
          )}
        </p>

        {activos && (
          <ul className="filtros__activos" aria-label="Filtros activos">
            {filtros.texto.trim() && (
              <li>
                <button type="button" className="activo" onClick={() => cambiar({ texto: "" })} aria-label={`Quitar búsqueda: ${filtros.texto.trim()}`}>
                  «{filtros.texto.trim()}» <span aria-hidden="true">×</span>
                </button>
              </li>
            )}
            {filtros.categoria && (
              <li>
                <button
                  type="button"
                  className="activo"
                  style={{ "--acento": acentoDe(filtros.categoria) } as CSSProperties}
                  onClick={() => cambiar({ categoria: null, genero: null })}
                  aria-label={`Quitar categoría: ${filtros.categoria}`}
                >
                  {filtros.categoria} <span aria-hidden="true">×</span>
                </button>
              </li>
            )}
            {filtros.genero && (
              <li>
                <button type="button" className="activo" onClick={() => cambiar({ genero: null })} aria-label={`Quitar género: ${filtros.genero}`}>
                  {filtros.genero} <span aria-hidden="true">×</span>
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                className="filtros__limpiar"
                onClick={() => onCambiar({ texto: "", categoria: null, genero: null, orden: filtros.orden })}
              >
                Ver toda la colección
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
