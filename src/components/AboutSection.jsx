import { C } from "../data/colors";
import { members } from "../data/members";

export function AboutSection() {
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
        {(() => {
          const teamMembers = members.filter((member) => member.type !== "group");
          const groupPhoto = members.find((member) => member.type === "group");

          return (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                {teamMembers.map((member, i) => (
                  member.imageFront ? (
                    <div key={i} className="member-card">
                      <div className="member-card-inner">
                        <div className="member-card-face">
                          <div className="member-card-photo">
                            <img src={member.imageFront} alt={member.name} />
                          </div>
                          <div className="member-card-meta">
                            <div className="member-card-name">{member.name}</div>
                          </div>
                        </div>
                        <div className="member-card-face back">
                          <div className="member-card-photo">
                            <img src={member.imageBack || member.imageFront} alt={`${member.name} foto 2`} />
                          </div>
                          <div className="member-card-meta">
                            <div className="member-card-name">{member.name}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={i} style={{ background: C.blackCard, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, minHeight: 260, padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: C.muted, fontFamily: "'Orbitron', monospace", fontSize: "0.85rem" }}>
                      {member.name}
                    </div>
                  )
                ))}
              </div>
              {groupPhoto && (
                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                  <div className="member-card member-card-static" style={{ maxWidth: 420, width: "100%" }}>
                    <div className="member-card-inner">
                      <div className="member-card-face">
                        <div className="member-card-photo">
                          <img src={groupPhoto.imageFront} alt={groupPhoto.name} />
                        </div>
                        <div className="member-card-meta">
                          <div className="member-card-name">{groupPhoto.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </section>
  );
}
