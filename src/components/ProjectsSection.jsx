import { useState, useEffect } from "react";
import { C } from "../data/colors";
import { projects as projectsFallback } from "../data/projects";

export function ProjectsSection() {
  const [hov, setHov] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : projectsFallback)
      .then((data) => setProjects(data && data.length ? data : projectsFallback))
      .catch(() => setProjects(projectsFallback));
  }, []);

  return (
    <section style={{ padding: "8rem 2rem", background: `linear-gradient(180deg, ${C.black}, #0a0618, ${C.black})` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.purpleGlow, marginBottom: 12 }}>INVESTIGACIÓN ACTIVA</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>
            <span style={{ color: C.orange }}>PROYECTOS</span> DESTACADOS
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {projects.length > 0 ? projects.map((p, i) => {
            const color = p.color || C.orange;
            const link = p.link || '#';
            return (
              <a key={p.id || i} href={link} target="_blank" rel="noreferrer"
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                style={{
                  textDecoration: "none", display: "block",
                  background: hov === i ? "rgba(255,255,255,0.04)" : C.blackCard,
                  border: `1px solid ${hov === i ? color : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 4, padding: "1.8rem",
                  transition: "all 0.3s ease",
                  transform: hov === i ? "translateY(-4px)" : "none",
                  boxShadow: hov === i ? `0 0 30px ${color}22` : "none",
                }}>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", letterSpacing: 3, color, background: `${color}18`, padding: "4px 10px", borderRadius: 2 }}>{(p.tag || 'Proyecto').toUpperCase()}</span>
                </div>
                <h3 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "0.85rem", color: C.white, marginBottom: 10, lineHeight: 1.5 }}>{(p.title || 'Sin título').toUpperCase()}</h3>
                <p style={{ color: C.muted, fontSize: "0.82rem", lineHeight: 1.65 }}>{p.desc || 'Sin descripción disponible.'}</p>
                {link !== '#' && (
                  <div style={{ marginTop: 18, fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color, letterSpacing: 2 }}>VER ENLACE →</div>
                )}
              </a>
            );
          }) : (
            <div style={{ gridColumn: '1 / -1', color: C.muted, textAlign: 'center', padding: '2rem', background: C.blackCard, borderRadius: 8 }}>No hay proyectos cargados aún.</div>
          )}
        </div>
      </div>
    </section>
  );
}
