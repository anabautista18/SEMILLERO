import { useState } from "react";
import { C } from "../data/colors";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = () => { if (form.name && form.email) { setSent(true); setTimeout(() => setSent(false), 4000); setForm({ name: "", email: "", subject: "", message: "" }); } };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4,
    color: C.white, padding: "14px 16px", fontFamily: "inherit", fontSize: "0.9rem", width: "100%", outline: "none",
  };

  return (
    <section style={{ padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.orange, marginBottom: 12 }}>HABLEMOS</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>
            CONTACTO
          </h2>
          <p style={{ color: C.muted, marginTop: 16 }}>Universidad San Buenaventura Cali · Cra. 2 A #49-26</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <input placeholder="Nombre *" value={form.name} onChange={handle("name")} style={inputStyle} />
          <input placeholder="Correo electrónico *" type="email" value={form.email} onChange={handle("email")} style={inputStyle} />
          <input placeholder="Asunto" value={form.subject} onChange={handle("subject")} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <textarea placeholder="Mensaje" rows={6} value={form.message} onChange={handle("message")} style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }} />
          <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
            <button onClick={submit}
              style={{ background: sent ? `${C.purple}` : `linear-gradient(90deg, ${C.orange}, ${C.purple})`, color: "#fff", border: "none", padding: "14px 48px", fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", letterSpacing: 2, cursor: "pointer", fontWeight: 700, borderRadius: 2, transition: "all 0.3s" }}>
              {sent ? "✓ ENVIADO" : "ENVIAR MENSAJE"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
