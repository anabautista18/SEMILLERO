import { useState } from "react";
import { C } from "../data/colors";
import { areas } from "../data/areas";
import { AreaCanvas } from "./AreaCanvas";

export function AreasSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <section style={{ padding: "8rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.orange, marginBottom: 12 }}>LÍNEAS DE INVESTIGACIÓN</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>
          ÁREAS DEL <span style={{ color: C.purpleGlow }}>SEMILLERO</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {areas.map((a, i) => (
          <div key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              background: C.blackCard, border: `1px solid ${hoveredIdx === i ? (i % 2 === 0 ? C.orange : C.purple) : "rgba(255,255,255,0.06)"}`,
              borderRadius: 4, overflow: "hidden", cursor: "default",
              transition: "all 0.3s ease",
              transform: hoveredIdx === i ? "translateY(-6px)" : "none",
              boxShadow: hoveredIdx === i ? `0 20px 40px rgba(${i % 2 === 0 ? "229,114,36" : "124,58,237"},0.2)` : "none",
            }}>
            {/* 3D preview */}
            <div style={{ height: 160, background: "#080811" }}>
              <AreaCanvas color={a.color} shape={a.shape} />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", letterSpacing: 4, color: i % 2 === 0 ? C.orange : C.purpleGlow, marginBottom: 10 }}>
                {String(i + 1).padStart(2, "0")} ──
              </div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "0.9rem", color: C.white, marginBottom: 12, letterSpacing: 1 }}>{a.name.toUpperCase()}</h3>
              <p style={{ color: C.muted, fontSize: "0.85rem", lineHeight: 1.65 }}>{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
