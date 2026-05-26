import { useState, useCallback } from "react";
import "./styles/globals.css";
import { C } from "./data/colors";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsBar } from "./components/StatsBar";
import { AboutSection } from "./components/AboutSection";
import { AreasSection } from "./components/AreasSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { PublicationsSection } from "./components/PublicationsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export default function App() {
  const [active, setActive] = useState("Inicio");
  const sections = { Inicio: "hero", Acerca: "acerca", Proyectos: "proyectos", Publicaciones: "publicaciones", Contacto: "contacto" };

  const scrollTo = useCallback((name) => {
    setActive(name);
    if (name === "Admin") {
      window.location.href = "/didi/admin";
      return;
    }
    const el = document.getElementById(sections[name]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div style={{ background: C.black, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
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
