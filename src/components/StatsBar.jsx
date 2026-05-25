import { C } from "../data/colors";
import { stats } from "../data/stats";
import { CountUp } from "./CountUp";

export function StatsBar() {
  return (
    <div style={{ background: `linear-gradient(90deg, rgba(229,114,36,0.08), rgba(124,58,237,0.08))`, borderTop: `1px solid rgba(229,114,36,0.2)`, borderBottom: `1px solid rgba(124,58,237,0.2)`, padding: "3rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "2.8rem", background: `linear-gradient(90deg, ${C.orange}, ${C.purpleGlow})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <CountUp target={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 3, color: C.muted, marginTop: 6 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
