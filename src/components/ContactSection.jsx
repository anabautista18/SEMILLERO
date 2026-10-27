import { useState } from "react";
import { C } from "../data/colors";

const emptyForm = { name: "", email: "", subject: "", message: "" };
const CONTACT_EMAIL = "cmparedesv@usbcali.edu.co";

export function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const handle = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  function submit(event) {
    event.preventDefault();
    const subject = form.subject.trim() || "Contacto desde SEMILLERO DIDI 4.0";
    const body = `Nombre: ${form.name.trim()}\nCorreo: ${form.email.trim()}\n\n${form.message.trim()}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus({ type: "info", message: `Se abrió tu aplicación de correo para enviar el mensaje. Si no se abre, escribe a ${CONTACT_EMAIL}.` });
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4,
    color: C.white, padding: "14px 16px", fontFamily: "inherit", fontSize: "0.9rem", width: "100%", outline: "none",
  };

  return (
    <section style={{ padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.orange, marginBottom: 12 }}>HABLEMOS</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>CONTACTO</h2>
          <p style={{ color: C.muted, marginTop: 16 }}>Universidad San Buenaventura Cali · Carrera 122 # 6-65, Barrio Pance (Avenida 10 de Mayo, La Umbría, Vía a Pance)</p>
        </div>
        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
          <input placeholder="Nombre *" autoComplete="name" required maxLength={120} value={form.name} onChange={handle("name")} style={inputStyle} />
          <input placeholder="Correo electrónico *" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={handle("email")} style={inputStyle} />
          <input placeholder="Asunto" maxLength={160} value={form.subject} onChange={handle("subject")} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <textarea placeholder="Mensaje *" rows={6} required maxLength={10000} value={form.message} onChange={handle("message")} style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }} />
          {status.message && (
            <p role="status" style={{ gridColumn: "1 / -1", color: status.type === "error" ? "#ff9b9b" : C.muted, lineHeight: 1.5 }}>
              {status.message}
            </p>
          )}
          <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
            <button type="submit"
              style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.purple})`, color: "#fff", border: "none", padding: "14px 48px", fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", letterSpacing: 2, cursor: "pointer", fontWeight: 700, borderRadius: 2 }}>
              ABRIR CORREO
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
