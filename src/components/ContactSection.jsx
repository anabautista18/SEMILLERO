import { C } from "../data/colors";

export function ContactSection() {
  return (
    <section style={{ padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.orange, marginBottom: 12 }}>HABLEMOS</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>CONTACTO</h2>
          <p style={{ color: C.muted, marginTop: 16 }}>Universidad San Buenaventura Cali · Carrera 122 # 6-65, Barrio Pance (Avenida 10 de Mayo, La Umbría, Vía a Pance)</p>
        </div>
      </div>
    </section>
  );
}
