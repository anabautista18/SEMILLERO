import { useState } from "react";
import { C } from "../data/colors";

const emptyForm = { name: "", email: "", subject: "", message: "" };

export function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  const handle = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo enviar el mensaje.");
      setStatus({ type: "success", message: "Mensaje enviado. Gracias por contactarnos." });
      setForm(emptyForm);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "No se pudo enviar el mensaje. Inténtalo más tarde." });
    } finally {
      setSending(false);
    }
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
            <p role="status" style={{ gridColumn: "1 / -1", color: status.type === "success" ? "#8de1b0" : "#ff9b9b", lineHeight: 1.5 }}>
              {status.message}
            </p>
          )}
          <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
            <button type="submit" disabled={sending}
              style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.purple})`, color: "#fff", border: "none", padding: "14px 48px", fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", letterSpacing: 2, cursor: sending ? "wait" : "pointer", fontWeight: 700, borderRadius: 2, opacity: sending ? 0.7 : 1 }}>
              {sending ? "ENVIANDO..." : "ENVIAR MENSAJE"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
