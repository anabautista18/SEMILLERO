import { C } from "../data/colors";

export function Footer() {
  return (
    <footer style={{ background: "#050508", borderTop: `1px solid rgba(124,58,237,0.2)`, padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "1.3rem", marginBottom: 16 }}>
              <span style={{ color: C.orange }}>SEMILLERO DIDI</span><span style={{ color: C.purpleGlow }}> 4.0</span>
            </div>
            <p style={{ color: C.muted, fontSize: "0.82rem", lineHeight: 1.7 }}>Diseño, interacción y desarrollo en la Industria 4.0 · Universidad San Buenaventura Cali</p>
          </div>
          {[
            { title: "Áreas", items: ["Multimedia e Interacción", "IA e Industria 4.0", "Salud Digital", "Sistemas Ciberfísicos", "Realidad Mixta"] },
            { title: "Información", items: ["Inicio", "Acerca de", "Proyectos", "Publicaciones", "Contacto"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 4, color: i % 2 === 0 ? C.orange : C.purpleGlow, marginBottom: 16 }}>{col.title.toUpperCase()}</div>
              {col.items.map((item, j) => <div key={j} style={{ color: C.muted, fontSize: "0.82rem", marginBottom: 8 }}>{item}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ color: C.muted, fontSize: "0.78rem", fontFamily: "'Orbitron', monospace", letterSpacing: 2 }}>© 2025 SEMILLERO DIDI 4.0 · USB CALI · AMBR </div>
          <div style={{ color: C.muted, fontSize: "0.78rem" }}>cmparedesv@usbcali.edu.co · +57 315 494 789</div>
        </div>
      </div>
    </footer>
  );
}
