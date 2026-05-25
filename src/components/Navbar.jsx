import { useState, useEffect } from "react";
import { C } from "../data/colors";

export function Navbar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Inicio", "Acerca", "Proyectos", "Publicaciones", "Contacto"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(7,7,10,0.95)" : "transparent",
      borderBottom: scrolled ? `1px solid rgba(124,58,237,0.25)` : "none",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.4s ease",
      padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        {/* Logo */}
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "1.3rem", letterSpacing: 2 }}>
          <span style={{ color: C.orange }}>SEMILLERO</span>
          <span style={{ color: C.purpleGlow }}> 4.0</span>
        </div>
        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2rem" }} className="hide-mobile">
          {links.map(l => (
            <button key={l} onClick={() => setActive(l)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Orbitron', monospace", fontSize: "0.78rem", letterSpacing: 2,
                color: active === l ? C.orange : C.muted,
                borderBottom: active === l ? `2px solid ${C.orange}` : "2px solid transparent",
                paddingBottom: 4, transition: "all 0.2s",
              }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {/* CTA */}
        <a href="mailto:cmparedesv@usbcali.edu.co" className="hide-mobile" style={{
          background: `linear-gradient(90deg, ${C.orange}, ${C.purple})`,
          color: "#fff", padding: "8px 20px", borderRadius: 4, fontSize: "0.75rem",
          fontFamily: "'Orbitron', monospace", letterSpacing: 2, textDecoration: "none",
          fontWeight: 700,
        }}>UNIRSE</a>
        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} className="show-mobile"
          style={{ background: "none", border: "none", cursor: "pointer", color: C.orange, fontSize: "1.5rem" }}>
          ☰
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div style={{ background: "rgba(7,7,10,0.98)", padding: "1rem 2rem", borderTop: `1px solid rgba(124,58,237,0.3)` }}>
          {links.map(l => (
            <button key={l} onClick={() => { setActive(l); setOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", color: active === l ? C.orange : C.muted,
                padding: "12px 0", letterSpacing: 2 }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
