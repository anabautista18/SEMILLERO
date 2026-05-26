import { useState, useEffect } from "react";
import { C } from "../data/colors";
import { members as membersFallback } from "../data/members";
import { semilleroInfo } from "../data/semilleroInfo";

export function AboutSection() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL.replace(/\/$/, '') + '/api/members')
      .then((res) => res.ok ? res.json() : membersFallback)
      .then((data) => setMembers(data && data.length ? data : membersFallback))
      .catch(() => setMembers(membersFallback));
  }, []);

  const teamMembers = members.filter((member) => member.type !== 'group');
  const groupPhoto = members.find((member) => member.type === 'group');

  return (
    <section style={{ padding: '8rem 2rem', background: `linear-gradient(180deg, ${C.black}, #080518, ${C.black})` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', letterSpacing: 6, color: C.purpleGlow, marginBottom: 12 }}>QUIÉNES SOMOS</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: C.white }}>
            EL <span style={{ color: C.orange }}>EQUIPO</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {[
            { label: 'MISIÓN', text: semilleroInfo.mission, accent: C.orange },
            { label: 'VISIÓN', text: semilleroInfo.vision, accent: C.purpleGlow },
            { label: 'OBJETIVO GENERAL', text: semilleroInfo.generalObjective, accent: C.orange },
          ].map((box, i) => (
            <div key={i} style={{ background: C.blackCard, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: '2rem', borderTop: `3px solid ${box.accent}` }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', letterSpacing: 4, color: box.accent, marginBottom: 14 }}>{box.label}</div>
              <p style={{ color: C.muted, lineHeight: 1.7, fontSize: '0.88rem' }}>{box.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {semilleroInfo.researchLines.map((line) => (
              <span key={line} style={{ color: C.purpleGlow, border: `1px solid ${C.purpleGlow}`, padding: '10px 16px', borderRadius: 24, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: 1.5 }}>{line}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {teamMembers.length > 0 ? teamMembers.map((member, i) => (
            member.imageFront ? (
              <div key={member.id || i} className={`member-card ${member.type === 'group' ? 'member-card-static' : ''}`}>
                <div className="member-card-inner">
                  <div className="member-card-face front">
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
              <div key={member.id || i} style={{ background: C.blackCard, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, minHeight: 260, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: C.muted, fontFamily: "'Orbitron', monospace", fontSize: '0.85rem' }}>
                {member.name}
              </div>
            )
          )) : (
            <div style={{ gridColumn: '1 / -1', color: C.muted, textAlign: 'center', padding: '2rem', background: C.blackCard, borderRadius: 8 }}>No hay integrantes registrados aún.</div>
          )}
        </div>

        {groupPhoto && (
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div className="member-card member-card-static" style={{ maxWidth: 420, width: '100%' }}>
              <div className="member-card-inner">
                <div className="member-card-face front">
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
        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(260px, 1fr)', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="advisor-card">
              <div className="advisor-card-photo">
                <img src={semilleroInfo.advisor.imageFront} alt={semilleroInfo.advisor.name} />
              </div>
              <div className="advisor-card-meta">
                <div style={{ color: C.orange, fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', marginBottom: 10 }}>DOCENTE ASESOR</div>
                <div style={{ color: C.white, fontWeight: 700, marginBottom: 8 }}>{semilleroInfo.advisor.name}</div>
                <div style={{ color: C.muted, fontSize: '0.9rem' }}>{semilleroInfo.advisor.degree}</div>
                <div style={{ color: C.muted, fontSize: '0.9rem', marginTop: 8 }}>Email: {semilleroInfo.advisor.email}</div>
              </div>
            </div>
            <div style={{ background: C.blackCard, borderRadius: 8, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: C.purpleGlow, fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', marginBottom: 10 }}>COORDINADOR</div>
              <div style={{ color: C.white, fontWeight: 700, marginBottom: 8 }}>{semilleroInfo.coordinator.name}</div>
              <div style={{ color: C.muted, fontSize: '0.9rem' }}>{semilleroInfo.coordinator.program} - Semestre {semilleroInfo.coordinator.semester}</div>
              <div style={{ color: C.muted, fontSize: '0.9rem', marginTop: 8 }}>Email: {semilleroInfo.coordinator.email}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
