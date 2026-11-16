import { z } from "zod";

// La librería no cobra en línea: los libros se RESERVAN y se pagan al retirarlos.
// Plazos de la reserva (se muestran en la página y se validan acá).
export const DIAS_MAXIMOS_PARA_RETIRAR = 30; // fecha de retiro: hasta 30 días desde hoy
export const HORAS_DE_RESERVA = 72; // una vez avisado, el libro se guarda 72 h hábiles

// "AAAA-MM-DD" en la hora local (no UTC: a la noche toISOString ya daría mañana).
export function fechaLocal(fecha = new Date()): string {
  const d = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60_000);
  return d.toISOString().slice(0, 10);
}

export function sumarDias(dias: number, desde = new Date()): Date {
  const d = new Date(desde);
  d.setDate(d.getDate() + dias);
  return d;
}

const nombre = z.string().trim().min(2, "Ingresá tu nombre y apellido.").max(80, "Máximo 80 caracteres.");
const email = z.string().trim().toLowerCase().pipe(z.email("Ingresá un email válido."));

export const AVISOS = { whatsapp: "WhatsApp", email: "Email", llamada: "Llamada" } as const;
export const PAGOS = {
  efectivo: "Efectivo",
  debito: "Tarjeta de débito",
  credito: "Tarjeta de crédito",
  transferencia: "Transferencia",
} as const;
export const ASUNTOS = {
  disponibilidad: "¿Tienen este libro?",
  consulta: "Consulta general",
  reserva: "Una reserva que ya hice",
  sugerencia: "Sugerencia",
  reclamo: "Reclamo",
} as const;

const claves = <T extends Record<string, string>>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

// La reserva necesita al menos un libro: del carrito o escrito a mano. Como el carrito
// no es parte del formulario, el esquema se arma sabiendo si tiene libros.
export function crearReservaSchema(hayLibrosEnCarrito: boolean, hoy = new Date()) {
  const minimo = fechaLocal(hoy);
  const maximo = fechaLocal(sumarDias(DIAS_MAXIMOS_PARA_RETIRAR, hoy));

  // A nivel de campo (no un refine del objeto): así el error aparece junto con los demás,
  // y no recién cuando todo lo otro ya es válido.
  const otrosLibros = hayLibrosEnCarrito
    ? z.string().trim().max(500, "Máximo 500 caracteres.")
    : z.string().trim().min(1, "Tu carrito está vacío: escribí qué libro querés reservar.").max(500, "Máximo 500 caracteres.");

  return z.object({
      nombre,
      dni: z
        .string()
        .trim()
        .transform((s) => s.replace(/\./g, ""))
        .pipe(z.string().regex(/^\d{7,8}$/, "El DNI tiene 7 u 8 números (con o sin puntos).")),
      email,
      telefono: z
        .string()
        .trim()
        .refine((s) => /^[\d\s()+-]+$/.test(s) && s.replace(/\D/g, "").length >= 8, "Ingresá un teléfono con código de área."),
      aviso: z.enum(claves(AVISOS), { error: "Elegí cómo querés que te avisemos." }),
      retiro: z
        .string()
        .min(1, "Elegí qué día pensás pasar.")
        .refine((f) => f >= minimo, "La fecha no puede ser anterior a hoy.")
        .refine((f) => f <= maximo, `Podés reservar con hasta ${DIAS_MAXIMOS_PARA_RETIRAR} días de anticipación.`),
      pago: z.enum(claves(PAGOS), { error: "Elegí cómo vas a pagar al retirar." }),
      otrosLibros,
      comentarios: z.string().trim().max(500, "Máximo 500 caracteres."),
      condiciones: z.literal(true, { error: "Tenés que aceptar las condiciones de la reserva." }),
    });
}

export type ReservaEntrada = z.input<ReturnType<typeof crearReservaSchema>>;
export type ReservaValidada = z.output<ReturnType<typeof crearReservaSchema>>;

export const consultaSchema = z.object({
  nombre,
  email,
  asunto: z.enum(claves(ASUNTOS), { error: "Elegí un asunto." }),
  mensaje: z.string().trim().min(10, "Contanos un poco más (al menos 10 caracteres).").max(1000, "Máximo 1000 caracteres."),
});

export type ConsultaValidada = z.infer<typeof consultaSchema>;
