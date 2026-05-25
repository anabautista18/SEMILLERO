import { HeroCanvas } from "./HeroCanvas";
import { C } from "../data/colors";

export function HeroSection({ setActive }) {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <HeroCanvas />
      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      {/* Gradient fade bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: `linear-gradient(transparent, ${C.black})` }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 2rem", paddingTop: 100 }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", letterSpacing: 6, color: C.orange, marginBottom: 16 }}>
            — UNIVERSIDAD SAN BUENAVENTURA CALI —
          </div>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.05, marginBottom: 24, color: C.white }}>
            DISEÑO &amp;<br />
            <span style={{ WebkitTextStroke: `2px ${C.orange}`, color: "transparent" }}>INTERACCIÓN</span><br />
            <span style={{ color: C.purpleGlow }}>INDUSTRIA 4.0</span>
          </h1>
          <p style={{ color: C.muted, fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 520, marginBottom: 40 }}>
            Semillero de investigación que integra inteligencia artificial, realidad mixta y sistemas ciberfísicos para construir el futuro tecnológico de Colombia.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => setActive("Proyectos")}
              style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.purple})`, color: "#fff", border: "none", padding: "14px 36px", fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", letterSpacing: 2, cursor: "pointer", fontWeight: 700, borderRadius: 2 }}>
              VER PROYECTOS →
            </button>
            <button onClick={() => setActive("Acerca")}
              style={{ background: "transparent", color: C.purpleGlow, border: `1px solid ${C.purple}`, padding: "14px 36px", fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", letterSpacing: 2, cursor: "pointer", borderRadius: 2 }}>
              CONÓCENOS
            </button>
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 2s ease-in-out infinite" }}>
        <div style={{ width: 1, height: 60, background: `linear-gradient(${C.orange}, transparent)` }} />
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", letterSpacing: 4, color: C.muted }}>SCROLL</span>
      </div>
    </section>
  );
}
