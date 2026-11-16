// Logo de Marea: una luna que se asoma sobre dos olas (la marea) y el nombre en serif
// itálica. El símbolo usa currentColor, así toma el color del texto donde se ponga.
// El mismo dibujo es el ícono de la pestaña (public/favicon.svg).
export function SimboloMarea({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="15" r="8" fill="currentColor" />
      <path
        d="M3 24.5c4.25 0 4.25-3.5 8.5-3.5s4.25 3.5 8.5 3.5 4.25-3.5 8.5-3.5 4.25 3.5 8.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M3 31.5c4.25 0 4.25-3.5 8.5-3.5s4.25 3.5 8.5 3.5 4.25-3.5 8.5-3.5 4.25 3.5 8.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="marea-logo">
      <SimboloMarea className="marea-logo__simbolo" />
      <span className="marea-logo__nombre">Marea</span>
    </span>
  );
}
