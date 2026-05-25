import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ── Color palette ──────────────────────────────────────────
const C = {
  orange: "#e57224",
  orangeGlow: "#ff8c3a",
  purple: "#7c3aed",
  purpleDark: "#4c1d95",
  purpleGlow: "#a855f7",
  black: "#07070a",
  blackCard: "#0d0d14",
  white: "#f0f0ff",
  muted: "#8888aa",
};

// ── THREE.js helpers ────────────────────────────────────────
function useThreeScene(mountRef, sceneBuilder) {
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const cleanup = sceneBuilder(scene, camera, renderer, el);

    const handleResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (cleanup) cleanup();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);
}

// ── Hero 3D Scene: rotating torus + floating icosahedron ───
function HeroCanvas() {
  const ref = useRef();
  useThreeScene(ref, (scene, camera, renderer, el) => {
    // Lights
    const ambientLight = new THREE.AmbientLight(0x1a0a2e, 2);
    scene.add(ambientLight);
    const pointOrange = new THREE.PointLight(0xe57224, 60, 20);
    pointOrange.position.set(3, 2, 2);
    scene.add(pointOrange);
    const pointPurple = new THREE.PointLight(0x7c3aed, 60, 20);
    pointPurple.position.set(-3, -2, 2);
    scene.add(pointPurple);

    // Main torus knot
    const torusGeo = new THREE.TorusKnotGeometry(1.1, 0.32, 180, 24, 2, 3);
    const torusMat = new THREE.MeshPhongMaterial({
      color: 0x0d0d14,
      emissive: 0x2a0a50,
      specular: 0xa855f7,
      shininess: 120,
      wireframe: false,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, opacity: 0.18, transparent: true });
    const wire = new THREE.Mesh(torusGeo, wireMat);
    scene.add(wire);

    // Floating icosahedra (satellites)
    const satellites = [];
    for (let i = 0; i < 6; i++) {
      const g = new THREE.OctahedronGeometry(0.12 + Math.random() * 0.1, 0);
      const m = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0xe57224 : 0x7c3aed,
        emissive: i % 2 === 0 ? 0x331100 : 0x1a0038,
        shininess: 200,
      });
      const mesh = new THREE.Mesh(g, m);
      const angle = (i / 6) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 1.4, Math.sin(angle * 2) * 0.5);
      mesh.userData = { baseAngle: angle, speed: 0.4 + Math.random() * 0.3 };
      scene.add(mesh);
      satellites.push(mesh);
    }

    // Particle field
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xa855f7, size: 0.025, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse interaction
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    let frame;
    let t = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      t += 0.012;
      torus.rotation.x = t * 0.3 + my * 0.2;
      torus.rotation.y = t * 0.5 + mx * 0.2;
      wire.rotation.copy(torus.rotation);
      satellites.forEach((s) => {
        const a = s.userData.baseAngle + t * s.userData.speed;
        s.position.x = Math.cos(a) * 2.2;
        s.position.y = Math.sin(a) * 1.4;
        s.position.z = Math.sin(a * 2) * 0.5;
        s.rotation.x += 0.02;
        s.rotation.y += 0.03;
      });
      particles.rotation.y += 0.001;
      pointOrange.position.x = Math.sin(t * 0.7) * 3;
      pointPurple.position.x = -Math.sin(t * 0.5) * 3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouse);
    };
  });
  return <div ref={ref} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />;
}

// ── Area 3D mini canvas ─────────────────────────────────────
function AreaCanvas({ color, shape }) {
  const ref = useRef();
  useThreeScene(ref, (scene, camera, renderer) => {
    camera.position.z = 2.5;
    const light = new THREE.PointLight(color, 20, 10);
    light.position.set(1, 1, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x111122, 3));

    let geo;
    if (shape === "torus") geo = new THREE.TorusGeometry(0.6, 0.22, 16, 60);
    else if (shape === "octa") geo = new THREE.OctahedronGeometry(0.75, 0);
    else if (shape === "ico") geo = new THREE.IcosahedronGeometry(0.75, 0);
    else if (shape === "dodeca") geo = new THREE.DodecahedronGeometry(0.7, 0);
    else if (shape === "cone") geo = new THREE.ConeGeometry(0.6, 1.2, 8);
    else geo = new THREE.TetrahedronGeometry(0.8, 0);

    const mat = new THREE.MeshPhongMaterial({
      color: 0x0d0d14, emissive: new THREE.Color(color).multiplyScalar(0.15),
      specular: new THREE.Color(color), shininess: 150,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const wireMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), wireframe: true, opacity: 0.3, transparent: true });
    const wire = new THREE.Mesh(geo, wireMat);
    scene.add(mesh);
    scene.add(wire);

    let t = 0, frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      t += 0.02;
      mesh.rotation.x = t * 0.4;
      mesh.rotation.y = t * 0.7;
      wire.rotation.copy(mesh.rotation);
      renderer.render(scene, camera);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  });
  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

// ── Stats counter ────────────────────────────────────────────
function CountUp({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = () => {
          start += Math.ceil(target / 50);
          if (start >= target) { setVal(target); return; }
          setVal(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── NavBar ────────────────────────────────────────────────────
function Navbar({ active, setActive }) {
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

// ── Sections ─────────────────────────────────────────────────
function HeroSection({ setActive }) {
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

const stats = [
  { label: "Integrantes", value: 14, suffix: "+" },
  { label: "Proyectos", value: 20, suffix: "+" },
  { label: "Publicaciones", value: 15, suffix: "+" },
  { label: "Años activos", value: 9, suffix: "" },
];

function StatsBar() {
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

const areas = [
  { name: "Multimedia e Interacción", icon: "◈", shape: "torus", color: 0xe57224, desc: "Interfaces inmersivas, diseño de interacción y visualización de datos en tiempo real." },
  { name: "IA e Industria 4.0", icon: "◉", shape: "ico", color: 0x7c3aed, desc: "Modelos de deep learning, visión computacional y automatización inteligente de procesos." },
  { name: "Salud Digital", icon: "◬", shape: "octa", color: 0xe57224, desc: "Apps para detección temprana de Alzheimer, EEG, y monitoreo clínico con IA." },
  { name: "Sistemas Ciberfísicos", icon: "⬡", shape: "dodeca", color: 0x7c3aed, desc: "Infraestructura de emulación en tiempo real y validación de leyes de control digital." },
  { name: "Realidad Mixta", icon: "◫", shape: "cone", color: 0xe57224, desc: "Experiencias SCADA en Meta Quest 3, AR para educación y entornos industriales." },
  { name: "Seguridad Cibernética", icon: "△", shape: "tetra", color: 0x7c3aed, desc: "Sistemas tolerantes a ciberataques, diseño seguro de redes y protocolos industriales." },
];

function AreasSection() {
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

const projects = [
  { title: "Sistema Análisis de Baloncesto", tag: "Deep Learning", color: C.orange, link: "https://github.com/Basketball-App/basketball_app", desc: "Análisis computacional de partidos con visión por computador y técnicas de CV avanzadas." },
  { title: "SCADA RM – Meta Quest 3", tag: "Realidad Mixta", color: C.purpleGlow, link: "https://github.com/W-sebas23/Scada-RM", desc: "Interfaz MR para monitoreo y control del proceso de llenado de botellas con Factory/IO." },
  { title: "NeuroScreen-A", tag: "EEG + Deep Learning", color: C.orange, link: "https://github.com/MarlonMora23/NeuroScreen-A", desc: "Detección temprana de patrones de alcoholismo mediante señales EEG y aprendizaje profundo." },
  { title: "AlertGuard", tag: "Computer Vision", color: C.purpleGlow, link: "https://github.com/valentina0612/AlertGuard-Backend", desc: "Identificación de comportamientos sospechosos en establecimientos con Deep Learning y YOLO." },
  { title: "MentAlzh", tag: "Salud Digital", color: C.orange, link: "https://github.com/dangomezgir/MentAlzh", desc: "App móvil para detección temprana de deterioro cognitivo asociado al Alzheimer." },
  { title: "Traducción Lengua de Señas", tag: "IA + Visión", color: C.purpleGlow, link: "#", desc: "Sistema de traducción de lengua de señas colombiana a voz mediante visión computacional e IA." },
  { title: "Detección Tumores Cerebrales", tag: "Deep Learning", color: C.orange, link: "#", desc: "Clasificación de tumores en imágenes de resonancia magnética con redes neuronales profundas." },
  { title: "WILDFIRE – Detección Incendios", tag: "Imágenes Satelitales", color: C.purpleGlow, link: "#", desc: "Sistema de detección de incendios forestales mediante procesamiento de imágenes satelitales." },
];

function ProjectsSection() {
  const [hov, setHov] = useState(null);
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
          {projects.map((p, i) => (
            <a key={i} href={p.link} target="_blank" rel="noreferrer"
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{
                textDecoration: "none", display: "block",
                background: hov === i ? "rgba(255,255,255,0.04)" : C.blackCard,
                border: `1px solid ${hov === i ? p.color : "rgba(255,255,255,0.06)"}`,
                borderRadius: 4, padding: "1.8rem",
                transition: "all 0.3s ease",
                transform: hov === i ? "translateY(-4px)" : "none",
                boxShadow: hov === i ? `0 0 30px ${p.color}22` : "none",
              }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", letterSpacing: 3, color: p.color, background: `${p.color}18`, padding: "4px 10px", borderRadius: 2 }}>{p.tag.toUpperCase()}</span>
              </div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "0.85rem", color: C.white, marginBottom: 10, lineHeight: 1.5 }}>{p.title.toUpperCase()}</h3>
              <p style={{ color: C.muted, fontSize: "0.82rem", lineHeight: 1.65 }}>{p.desc}</p>
              {p.link !== "#" && (
                <div style={{ marginTop: 18, fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: p.color, letterSpacing: 2 }}>VER EN GITHUB →</div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const publications = [
  { type: "Congreso IEEE", title: "An Integrated Framework for Industrial Process Monitoring: Combining Simulation, Real‑Time Control, and Mixed Reality Visualization", authors: "W. Martínez, N. Galvis, A. Hurtado, C. Paredes", link: "https://ieeexplore.ieee.org/abstract/document/11410404" },
  { type: "Congreso Springer", title: "Anomaly Detection System Based on 3D CNNs and YOLO on Surveillance Videos", authors: "V. Beca, B. Zamora, C. Paredes, S. Dinas, N. Llanos‑Neuta", link: "https://link.springer.com/chapter/10.1007/978-3-032-08203-9_27" },
  { type: "Congreso IEEE", title: "A Comparative Approach to Search Algorithms for Path Planning in Mobile Robots: A* vs. Minimum Path Sum", authors: "N. Giraldo, B. Naspiran, V. Olave, A. Bautista, C. Paredes, C. Hidalgo", link: "https://ieeexplore.ieee.org/abstract/document/11214603" },
  { type: "Artículo MDPI", title: "Hybrid AI and LLM‑Enabled Agent‑Based Real‑Time Decision Support Architecture for Industrial Batch Processes", authors: "A. González‑Potes, D. Martínez‑Castro, C. Paredes et al.", link: "https://www.mdpi.com/2673-2688/7/2/51" },
  { type: "Artículo i‑JIM", title: "MentAlzh: Mobile Application Prototype for Early Detection of Cognitive Impairment", authors: "A. Hurtado, K. Marín, C. Paredes, D. Gómez, A. Rey‑Piedrahita", link: "https://online-journals.org/index.php/i-jim/article/view/54837" },
  { type: "Artículo ScienceDirect", title: "Implementation of mixed reality for data visualization in liquid soap filling processes", authors: "A. Hurtado, C. Paredes, K. Marín, J. González, J. Álzate", link: "https://www.sciencedirect.com/science/article/pii/S2772508125000389" },
];

function PublicationsSection() {
  return (
    <section style={{ padding: "8rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.orange, marginBottom: 12 }}>PRODUCCIÓN CIENTÍFICA</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>
          PUBLICACIONES &amp; <span style={{ color: C.purpleGlow }}>CONGRESOS</span>
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {publications.map((p, i) => (
          <a key={i} href={p.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
              background: C.blackCard, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "1.5rem 2rem",
              display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap",
              transition: "all 0.2s", borderLeft: `3px solid ${i % 2 === 0 ? C.orange : C.purple}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateX(6px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.blackCard; e.currentTarget.style.transform = "translateX(0)"; }}>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", letterSpacing: 2, color: i % 2 === 0 ? C.orange : C.purpleGlow, whiteSpace: "nowrap", minWidth: 110 }}>{p.type.toUpperCase()}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.78rem", color: C.white, marginBottom: 6, lineHeight: 1.5 }}>{p.title}</div>
                <div style={{ color: C.muted, fontSize: "0.75rem" }}>{p.authors}</div>
              </div>
              <span style={{ color: C.muted, fontSize: "1rem" }}>↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  const members = [
    "Andrés Camilo Medina (Coord.)", "Wilson Sebastián Martínez", "Nicolle Galvis Guzmán",
    "Valentina Beca", "Alejandro Ortegón", "Carlos Rangel", "María Fernanda Giraldo",
    "Brayan Zamora", "Delio Palacios", "Juan José Sánchez", "Katherine Mora",
    "Miguel Agudelo", "Ana María Bautista", "Felipe Rodríguez",
  ];
  return (
    <section style={{ padding: "8rem 2rem", background: `linear-gradient(180deg, ${C.black}, #080518, ${C.black})` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", letterSpacing: 6, color: C.purpleGlow, marginBottom: 12 }}>QUIÉNES SOMOS</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white }}>
            EL <span style={{ color: C.orange }}>EQUIPO</span>
          </h2>
        </div>
        {/* Mission / Vision */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {[
            { label: "MISIÓN", text: "Fortalecer la cultura investigativa de sus integrantes con el lineamiento de sus enfoques disciplinares alrededor de las tecnologías habilitadoras de la Industria 4.0.", accent: C.orange },
            { label: "VISIÓN", text: "Consolidarse en el ecosistema académico de la USB Cali y en el Suroccidente de Colombia como escenario generador de investigadores destacados en la Cuarta Revolución Industrial.", accent: C.purpleGlow },
            { label: "OBJETIVO", text: "Promover la formación y el fortalecimiento de habilidades investigativas alrededor de las tecnologías habilitadoras de la Industria 4.0.", accent: C.orange },
          ].map((box, i) => (
            <div key={i} style={{ background: C.blackCard, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 4, padding: "2rem", borderTop: `3px solid ${box.accent}` }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", letterSpacing: 4, color: box.accent, marginBottom: 14 }}>{box.label}</div>
              <p style={{ color: C.muted, lineHeight: 1.7, fontSize: "0.88rem" }}>{box.text}</p>
            </div>
          ))}
        </div>
        {/* Advisor */}
        <div style={{ background: `linear-gradient(135deg, rgba(229,114,36,0.08), rgba(124,58,237,0.08))`, border: `1px solid rgba(124,58,237,0.25)`, borderRadius: 4, padding: "2rem", marginBottom: "3rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${C.orange}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "1.2rem", color: "#fff", flexShrink: 0 }}>CP</div>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", letterSpacing: 4, color: C.orange, marginBottom: 6 }}>DOCENTE ASESOR</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "1rem", color: C.white }}>Carlos Mario Paredes Valencia</div>
            <div style={{ color: C.muted, fontSize: "0.82rem", marginTop: 4 }}>Ing. Mecatrónico · Doctor en Ingeniería · USB Cali</div>
            <div style={{ color: C.muted, fontSize: "0.8rem" }}>cmparedesv@usbcali.edu.co · +57 315 494 789</div>
          </div>
        </div>
        {/* Members grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {members.map((m, i) => (
            <div key={i} style={{ background: C.blackCard, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: i % 2 === 0 ? C.orange : C.purple, flexShrink: 0 }} />
              <span style={{ color: C.muted, fontSize: "0.8rem" }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
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

function Footer() {
  return (
    <footer style={{ background: "#050508", borderTop: `1px solid rgba(124,58,237,0.2)`, padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "1.3rem", marginBottom: 16 }}>
              <span style={{ color: C.orange }}>SEMILLERO</span><span style={{ color: C.purpleGlow }}> 4.0</span>
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
          <div style={{ color: C.muted, fontSize: "0.78rem", fontFamily: "'Orbitron', monospace", letterSpacing: 2 }}>© 2025 SEMILLERO 4.0 · USB CALI</div>
          <div style={{ color: C.muted, fontSize: "0.78rem" }}>cmparedesv@usbcali.edu.co · +57 315 494 789</div>
        </div>
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("Inicio");
  const sections = { Inicio: "hero", Acerca: "acerca", Proyectos: "proyectos", Publicaciones: "publicaciones", Contacto: "contacto" };

  const scrollTo = useCallback((name) => {
    setActive(name);
    const el = document.getElementById(sections[name]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div style={{ background: C.black, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-12px)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #07070a; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#e57224, #7c3aed); border-radius: 2px; }
        .hide-mobile { display: flex; }
        .show-mobile { display: none; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
      <Navbar active={active} setActive={scrollTo} />
      <div id="hero"><HeroSection setActive={scrollTo} /></div>
      <StatsBar />
      <div id="acerca"><AboutSection /></div>
      <AreasSection />
      <div id="proyectos"><ProjectsSection /></div>
      <div id="publicaciones"><PublicationsSection /></div>
      <div id="contacto"><ContactSection /></div>
      <Footer />
    </div>
  );
}
