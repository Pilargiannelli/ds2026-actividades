import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PortadaLibro from "../components/PortadaLibro";
import { useAuth } from "../context/AuthContext";
import { useTienda } from "../context/TiendaContext";
import {
  ASUNTOS,
  AVISOS,
  DIAS_MAXIMOS_PARA_RETIRAR,
  HORAS_DE_RESERVA,
  PAGOS,
  consultaSchema,
  crearReservaSchema,
  fechaLocal,
  sumarDias,
} from "../schemas/contactoSchema";
import type { ConsultaValidada, ReservaEntrada, ReservaValidada } from "../schemas/contactoSchema";
import type { Libro } from "../types/libro";
import { formatearPrecio } from "../utils/formatearPrecio";
import "./tienda.css";

interface Props {
  libros: Libro[];
}

type Modo = "reserva" | "consulta";

interface ReservaHecha {
  codigo: string;
  datos: ReservaValidada;
  libros: { titulo: string; cantidad: number }[];
  total: number;
}

const fechaLarga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

// Código corto para identificar la reserva al retirarla (sin letras confusas: 0/O, 1/I).
function codigoDeReserva(): string {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "R-" + Array.from({ length: 6 }, () => letras[Math.floor(Math.random() * letras.length)]).join("");
}

// ---------- Información de la librería (columna lateral) ----------

function Lateral() {
  return (
    <aside className="contacto__lateral">
      <div className="contacto__tarjeta">
        <h2 className="contacto__subtitulo">Cómo funciona la reserva</h2>
        <ol className="contacto__pasos">
          <li>
            <strong>Elegís tus libros</strong> y completás tus datos. No pagás nada en línea.
          </li>
          <li>
            <strong>Te avisamos</strong> por el medio que elijas cuando estén separados (1 o 2 días hábiles).
          </li>
          <li>
            <strong>Los retirás y pagás</strong> en la librería. Los guardamos {HORAS_DE_RESERVA} h hábiles desde el aviso.
          </li>
        </ol>
      </div>

      <div className="contacto__tarjeta">
        <h2 className="contacto__subtitulo">La librería</h2>
        <ul className="contacto__datos">
          <li>
            <i className="bi bi-geo-alt" aria-hidden="true"></i>
            <span>
              <strong>Dirección</strong>
              C. Cantilo 56, Buenos Aires
            </span>
          </li>
          <li>
            <i className="bi bi-telephone" aria-hidden="true"></i>
            <span>
              <strong>Teléfono y WhatsApp</strong>
              221 123 4567
            </span>
          </li>
          <li>
            <i className="bi bi-envelope" aria-hidden="true"></i>
            <span>
              <strong>Email</strong>
              marea.libreria@gmail.com
            </span>
          </li>
          <li>
            <i className="bi bi-clock" aria-hidden="true"></i>
            <span>
              <strong>Horarios de retiro</strong>
              Lunes a viernes, 9 a 20 h
              <br />
              Sábados, 10 a 18 h · Domingos, cerrado
            </span>
          </li>
          <li>
            <i className="bi bi-wallet2" aria-hidden="true"></i>
            <span>
              <strong>Pagás al retirar</strong>
              Efectivo, débito, crédito o transferencia
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

// ---------- Reserva ----------

function FormularioReserva({ libros, onReservada }: { libros: Libro[]; onReservada: (r: ReservaHecha) => void }) {
  const { usuario } = useAuth();
  const { carrito, vaciarCarrito } = useTienda();

  const items = carrito
    .map((i) => ({ ...i, libro: libros.find((l) => l.id === i.libroId) }))
    .filter((i): i is typeof i & { libro: Libro } => i.libro !== undefined);
  const total = items.reduce((s, i) => s + i.libro.precio * i.cantidad, 0);
  const hayLibros = items.length > 0;

  const esquema = useMemo(() => crearReservaSchema(hayLibros), [hayLibros]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReservaEntrada, unknown, ReservaValidada>({
    resolver: zodResolver(esquema),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      dni: "",
      email: usuario?.email ?? "",
      telefono: "",
      aviso: "whatsapp",
      retiro: "",
      pago: undefined,
      otrosLibros: "",
      comentarios: "",
      condiciones: false as unknown as true,
    },
  });

  const onSubmit = (datos: ReservaValidada) => {
    onReservada({
      codigo: codigoDeReserva(),
      datos,
      libros: items.map((i) => ({ titulo: i.libro.titulo, cantidad: i.cantidad })),
      total,
    });
    vaciarCarrito();
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className="contacto__form" aria-label="Formulario de reserva">
      {/* 1. Libros */}
      <fieldset className="contacto__bloque">
        <legend className="contacto__leyenda">
          <span className="contacto__numero">1</span> Tus libros
        </legend>

        {hayLibros ? (
          <>
            <ul className="reserva__libros" aria-label="Libros a reservar">
              {items.map(({ libro, cantidad }) => (
                <li key={libro.id} className="reserva__libro">
                  <PortadaLibro libro={libro} className="reserva__tapa" chica />
                  <span className="reserva__libro-texto">
                    <span className="reserva__libro-titulo">{libro.titulo}</span>
                    <span className="reserva__libro-autor">{libro.autor.nombre}</span>
                  </span>
                  <span className="reserva__libro-cantidad">× {cantidad}</span>
                  <span className="reserva__libro-precio">{formatearPrecio(libro.precio * cantidad)}</span>
                </li>
              ))}
            </ul>
            <p className="reserva__total">
              <span>Total a pagar al retirar</span>
              <strong>{formatearPrecio(total)}</strong>
            </p>
            <Link to="/carrito" className="tienda__enlace d-inline-block mt-0 mb-3">
              Editar el carrito
            </Link>
          </>
        ) : (
          <p className="reserva__vacio">
            Tu carrito está vacío. Podés <Link to="/catalogo">elegir libros del catálogo</Link> o escribir abajo cuál
            querés reservar.
          </p>
        )}

        <Form.Group controlId="otrosLibros">
          <Form.Label className="contacto__label">
            {hayLibros ? "¿Otro libro? (opcional)" : "¿Qué libro querés reservar?"}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            className="contacto__input"
            placeholder="Título y autor. Si no lo tenemos, lo pedimos y te avisamos."
            isInvalid={!!errors.otrosLibros}
            {...register("otrosLibros")}
          />
          <Form.Control.Feedback type="invalid">{errors.otrosLibros?.message}</Form.Control.Feedback>
        </Form.Group>
      </fieldset>

      {/* 2. Datos */}
      <fieldset className="contacto__bloque">
        <legend className="contacto__leyenda">
          <span className="contacto__numero">2</span> Tus datos
        </legend>
        <div className="contacto__grilla">
          <Form.Group controlId="nombre">
            <Form.Label className="contacto__label">Nombre y apellido</Form.Label>
            <Form.Control className="contacto__input" autoComplete="name" isInvalid={!!errors.nombre} {...register("nombre")} />
            <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="dni">
            <Form.Label className="contacto__label">DNI de quien retira</Form.Label>
            <Form.Control className="contacto__input" inputMode="numeric" placeholder="30.123.456" isInvalid={!!errors.dni} {...register("dni")} />
            <Form.Control.Feedback type="invalid">{errors.dni?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label className="contacto__label">Email</Form.Label>
            <Form.Control type="email" className="contacto__input" autoComplete="email" isInvalid={!!errors.email} {...register("email")} />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="telefono">
            <Form.Label className="contacto__label">Teléfono</Form.Label>
            <Form.Control type="tel" className="contacto__input" autoComplete="tel" placeholder="11 2345 6789" isInvalid={!!errors.telefono} {...register("telefono")} />
            <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
          </Form.Group>
        </div>
      </fieldset>

      {/* 3. Retiro */}
      <fieldset className="contacto__bloque">
        <legend className="contacto__leyenda">
          <span className="contacto__numero">3</span> Retiro y aviso
        </legend>
        <div className="contacto__grilla">
          <Form.Group controlId="retiro">
            <Form.Label className="contacto__label">¿Qué día pensás pasar?</Form.Label>
            <Form.Control
              type="date"
              className="contacto__input"
              min={fechaLocal()}
              max={fechaLocal(sumarDias(DIAS_MAXIMOS_PARA_RETIRAR))}
              isInvalid={!!errors.retiro}
              {...register("retiro")}
            />
            <Form.Text className="contacto__ayuda">Fecha aproximada, hasta {DIAS_MAXIMOS_PARA_RETIRAR} días.</Form.Text>
            <Form.Control.Feedback type="invalid">{errors.retiro?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="pago">
            <Form.Label className="contacto__label">¿Cómo vas a pagar al retirar?</Form.Label>
            <Form.Select className="contacto__input" isInvalid={!!errors.pago} defaultValue="" {...register("pago")}>
              <option value="" disabled>
                Elegí un medio de pago…
              </option>
              {Object.entries(PAGOS).map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.pago?.message}</Form.Control.Feedback>
          </Form.Group>
        </div>

        <fieldset className="contacto__opciones" aria-describedby={errors.aviso ? "aviso-error" : undefined}>
          <legend className="contacto__label">¿Cómo te avisamos que está lista?</legend>
          <div className="contacto__chips">
            {Object.entries(AVISOS).map(([valor, texto]) => (
              <label key={valor} className="contacto__chip">
                <input type="radio" value={valor} {...register("aviso")} />
                <span>{texto}</span>
              </label>
            ))}
          </div>
          {errors.aviso && (
            <p id="aviso-error" className="contacto__error">
              {errors.aviso.message}
            </p>
          )}
        </fieldset>

        <Form.Group controlId="comentarios">
          <Form.Label className="contacto__label">Comentarios (opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            className="contacto__input"
            placeholder="Por ejemplo: retira otra persona, es para regalo…"
            isInvalid={!!errors.comentarios}
            {...register("comentarios")}
          />
          <Form.Control.Feedback type="invalid">{errors.comentarios?.message}</Form.Control.Feedback>
        </Form.Group>
      </fieldset>

      <Form.Group controlId="condiciones" className="contacto__condiciones">
        <Form.Check
          type="checkbox"
          isInvalid={!!errors.condiciones}
          feedback={errors.condiciones?.message}
          feedbackType="invalid"
          label={`Entiendo que la reserva no tiene costo, que pago al retirar y que el libro se guarda ${HORAS_DE_RESERVA} h hábiles desde que me avisan.`}
          {...register("condiciones")}
        />
      </Form.Group>

      <button type="submit" className="tienda__boton w-100" disabled={isSubmitting}>
        <i className="bi bi-bookmark-check me-2" aria-hidden="true"></i>Enviar reserva
      </button>
    </Form>
  );
}

function ReservaConfirmada({ reserva, onOtra }: { reserva: ReservaHecha; onOtra: () => void }) {
  const { datos } = reserva;
  return (
    <div className="contacto__form contacto__confirmacion" role="status">
      <span className="contacto__confirmacion-icono" aria-hidden="true">
        <i className="bi bi-bookmark-check"></i>
      </span>
      <p className="tienda__volanta mb-1">Reserva {reserva.codigo}</p>
      <h2 className="contacto__confirmacion-titulo">¡Listo, {datos.nombre.split(" ")[0]}!</h2>
      <p>
        Te avisamos por <strong>{AVISOS[datos.aviso]}</strong> cuando los libros estén separados. Guardá el código{" "}
        <strong>{reserva.codigo}</strong> y presentá tu DNI al retirar.
      </p>

      <dl className="contacto__resumen">
        {reserva.libros.length > 0 && (
          <div>
            <dt>Libros</dt>
            <dd>
              {reserva.libros.map((l) => (
                <span key={l.titulo} className="d-block">
                  {l.titulo} × {l.cantidad}
                </span>
              ))}
            </dd>
          </div>
        )}
        {datos.otrosLibros && (
          <div>
            <dt>{reserva.libros.length > 0 ? "Además" : "Libro pedido"}</dt>
            <dd>{datos.otrosLibros}</dd>
          </div>
        )}
        <div>
          <dt>Retiro estimado</dt>
          <dd>{fechaLarga(datos.retiro)}</dd>
        </div>
        <div>
          <dt>Pago al retirar</dt>
          <dd>
            {PAGOS[datos.pago]}
            {reserva.total > 0 && ` · ${formatearPrecio(reserva.total)}`}
          </dd>
        </div>
      </dl>

      <div className="d-flex flex-wrap gap-3 align-items-center">
        <Link to="/catalogo" className="tienda__boton">
          Seguir explorando
        </Link>
        <button type="button" className="tienda__enlace mt-0" onClick={onOtra}>
          Hacer otra reserva
        </button>
      </div>
    </div>
  );
}

// ---------- Consulta ----------

function FormularioConsulta() {
  const { usuario } = useAuth();
  const [enviada, setEnviada] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultaValidada>({
    resolver: zodResolver(consultaSchema),
    defaultValues: { nombre: usuario?.nombre ?? "", email: usuario?.email ?? "", asunto: undefined, mensaje: "" },
  });

  const onSubmit = () => {
    setEnviada(true);
    reset();
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className="contacto__form" aria-label="Formulario de consulta">
      <div className="contacto__grilla">
        <Form.Group controlId="consulta-nombre">
          <Form.Label className="contacto__label">Nombre y apellido</Form.Label>
          <Form.Control className="contacto__input" autoComplete="name" isInvalid={!!errors.nombre} {...register("nombre")} />
          <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="consulta-email">
          <Form.Label className="contacto__label">Email</Form.Label>
          <Form.Control type="email" className="contacto__input" autoComplete="email" isInvalid={!!errors.email} {...register("email")} />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>
      </div>
      <Form.Group controlId="consulta-asunto" className="mt-3">
        <Form.Label className="contacto__label">Asunto</Form.Label>
        <Form.Select className="contacto__input" defaultValue="" isInvalid={!!errors.asunto} {...register("asunto")}>
          <option value="" disabled>
            Elegí un asunto…
          </option>
          {Object.entries(ASUNTOS).map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.asunto?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="consulta-mensaje" className="mt-3 mb-4">
        <Form.Label className="contacto__label">Mensaje</Form.Label>
        <Form.Control as="textarea" rows={5} className="contacto__input" isInvalid={!!errors.mensaje} {...register("mensaje")} />
        <Form.Control.Feedback type="invalid">{errors.mensaje?.message}</Form.Control.Feedback>
      </Form.Group>

      <button type="submit" className="tienda__boton w-100">
        <i className="bi bi-send me-2" aria-hidden="true"></i>Enviar consulta
      </button>

      {enviada && (
        <p className="contacto__exito" role="status">
          <i className="bi bi-check-circle me-2" aria-hidden="true"></i>
          ¡Gracias! Te respondemos por email dentro de las 48 h hábiles.
        </p>
      )}
    </Form>
  );
}

// ---------- Página ----------

export default function Contacto({ libros }: Props) {
  const [params, setParams] = useSearchParams();
  const modo: Modo = params.get("motivo") === "consulta" ? "consulta" : "reserva";
  const [reserva, setReserva] = useState<ReservaHecha | null>(null);

  useEffect(() => {
    document.title = "Reservas y contacto | Libreria - Pilar Giannelli";
    return () => {
      document.title = "Libreria - Pilar Giannelli";
    };
  }, []);

  const elegir = (m: Modo) => setParams(m === "consulta" ? { motivo: "consulta" } : {}, { replace: true });

  return (
    <section className="tienda">
      <header className="tienda__cabecera container">
        <p className="tienda__volanta">Reservas y consultas</p>
        <h1 className="tienda__titulo">Contacto</h1>
        <p className="tienda__bajada contacto__bajada">
          No cobramos en línea: reservás tus libros sin costo, te avisamos cuando están separados y los pagás al
          retirarlos en la librería.
        </p>
      </header>

      <div className="container contacto">
        <div>
          <div className="contacto__modos" role="group" aria-label="¿Qué querés hacer?">
            <button type="button" aria-pressed={modo === "reserva"} onClick={() => elegir("reserva")}>
              <i className="bi bi-bookmark me-2" aria-hidden="true"></i>Reservar libros
            </button>
            <button type="button" aria-pressed={modo === "consulta"} onClick={() => elegir("consulta")}>
              <i className="bi bi-chat me-2" aria-hidden="true"></i>Hacer una consulta
            </button>
          </div>

          {modo === "consulta" ? (
            <FormularioConsulta />
          ) : reserva ? (
            <ReservaConfirmada reserva={reserva} onOtra={() => setReserva(null)} />
          ) : (
            <FormularioReserva libros={libros} onReservada={setReserva} />
          )}
        </div>

        <Lateral />
      </div>
    </section>
  );
}
