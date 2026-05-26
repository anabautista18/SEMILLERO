import { useState, useEffect } from "react";
import { C } from "../data/colors";
import { publications as publicationsFallback } from "../data/publications";

export function PublicationsSection() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL.replace(/\/$/, '') + '/api/publications')
      .then((res) => res.ok ? res.json() : publicationsFallback)
      .then((data) => setPublications(data && data.length ? data : publicationsFallback))
      .catch(() => setPublications(publicationsFallback));
  }, []);

  return (
    <section style={{ padding: "8rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.orange, marginBottom: 12 }}>PRODUCCIÓN CIENTÍFICA</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>
          PUBLICACIONES &amp; <span style={{ color: C.purpleGlow }}>CONGRESOS</span>
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {publications.length > 0 ? publications.map((p, i) => (
          <a key={p.id || i} href={p.link || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
              background: C.blackCard, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "1.5rem 2rem",
              display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap",
              transition: "all 0.2s", borderLeft: `3px solid ${i % 2 === 0 ? C.orange : C.purple}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateX(6px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.blackCard; e.currentTarget.style.transform = "translateX(0)"; }}>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", letterSpacing: 2, color: i % 2 === 0 ? C.orange : C.purpleGlow, whiteSpace: "nowrap", minWidth: 110 }}>{(p.type || 'Publicación').toUpperCase()}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.78rem", color: C.white, marginBottom: 6, lineHeight: 1.5 }}>{p.title || 'Sin título'}</div>
                <div style={{ color: C.muted, fontSize: "0.75rem" }}>{p.authors || 'Sin autores'}</div>
              </div>
              <span style={{ color: C.muted, fontSize: "1rem" }}>↗</span>
            </div>
          </a>
        )) : (
          <div style={{ color: C.muted, textAlign: 'center', padding: '2rem', background: C.blackCard, borderRadius: 8 }}>No hay publicaciones registradas aún.</div>
        )}
      </div>
    </section>
  );
}
