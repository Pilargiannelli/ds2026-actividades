import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

interface FormState {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

const initialForm: FormState = { nombre: "", email: "", asunto: "", mensaje: "" };

export default function Contacto() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [validated, setValidated] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;

    if (!formEl.checkValidity()) {
      setValidated(true);
      setEnviado(false);
      return;
    }

    setValidated(false);
    setEnviado(true);
    setForm(initialForm);
  };

  return (
    <>
      <section className="contact__hero">
        <div className="container">
          <h1 className="contact__hero-title">Contacto</h1>
          <p className="contact__hero-subtitle">
            Estamos para ayudarte. Completá el formulario y te respondemos a la brevedad.
          </p>
        </div>
      </section>

      <section className="contact__body py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-12 col-lg-4">
              <div className="contact__info">
                <h2 className="contact__info-title">Información</h2>

                <ul className="contact__info-list">
                  <li className="contact__info-item">
                    <span className="contact__info-icon">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <div>
                      <strong>Dirección</strong>
                      <p>
                        C. Cantilo 56
                        <br />
                        Buenos Aires, Argentina
                      </p>
                    </div>
                  </li>

                  <li className="contact__info-item">
                    <span className="contact__info-icon">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <div>
                      <strong>Teléfono</strong>
                      <p>221 123 4567</p>
                    </div>
                  </li>

                  <li className="contact__info-item">
                    <span className="contact__info-icon">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <div>
                      <strong>Email</strong>
                      <p>cuspide@gmail.com</p>
                    </div>
                  </li>

                  <li className="contact__info-item">
                    <span className="contact__info-icon">
                      <i className="bi bi-clock"></i>
                    </span>
                    <div>
                      <strong>Horarios</strong>
                      <p>
                        Lunes a Viernes: 9:00 – 20:00
                        <br />
                        Sábados: 10:00 – 18:00
                        <br />
                        Domingos: cerrado
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-lg-8">
              <div className="contact__form-wrapper">
                <h2 className="contact__form-title">Envianos un mensaje</h2>

                <form
                  className={`needs-validation ${validated ? "was-validated" : ""}`}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4">
                    <label htmlFor="nombre" className="form-label contact__label">
                      Nombre completo <span className="contact__required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="form-control contact__input"
                      placeholder="Ej: Pilar Giannelli"
                      required
                      minLength={2}
                      value={form.nombre}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      Por favor ingresá tu nombre completo.
                    </div>
                    <div className="valid-feedback">¡Perfecto!</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label contact__label">
                      Email <span className="contact__required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control contact__input"
                      placeholder="Ej: pilargiannelli@email.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">Ingresá un email válido.</div>
                    <div className="valid-feedback">¡Perfecto!</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="asunto" className="form-label contact__label">
                      Asunto <span className="contact__required">*</span>
                    </label>
                    <select
                      id="asunto"
                      name="asunto"
                      className="form-select contact__input"
                      required
                      value={form.asunto}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Seleccioná un asunto...
                      </option>
                      <option value="consulta">Consulta</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                    </select>
                    <div className="invalid-feedback">Seleccioná un asunto.</div>
                    <div className="valid-feedback">¡Perfecto!</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="mensaje" className="form-label contact__label">
                      Mensaje <span className="contact__required">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      className="form-control contact__input"
                      rows={5}
                      placeholder="Escribí tu mensaje aquí..."
                      required
                      minLength={10}
                      value={form.mensaje}
                      onChange={handleChange}
                    ></textarea>
                    <div className="invalid-feedback">
                      El mensaje debe tener al menos 10 caracteres.
                    </div>
                    <div className="valid-feedback">¡Perfecto!</div>
                  </div>

                  <p className="contact__required-note">
                    <span className="contact__required">*</span> Todos los campos son
                    obligatorios.
                  </p>

                  <button type="submit" className="btn contact__btn-submit w-100">
                    <i className="bi bi-send me-2"></i>
                    Enviar mensaje
                  </button>

                  {enviado && (
                    <div className="alert alert-success mt-4" role="alert">
                      <i className="bi bi-check-circle me-2"></i>
                      <strong>¡Mensaje enviado!</strong> Te responderemos a la brevedad.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
