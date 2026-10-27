import { useState, useEffect } from "react";
import { C } from "../data/colors";
import { members as membersFallback } from "../data/members";
import { semilleroInfo } from "../data/semilleroInfo";
import { initialPeople } from "../data/people";
import { apiUrl, assetUrl } from "../utils/urls";

function getProfileUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function MemberSocialLinks({ member }) {
  const platforms = [
    ["linkedin", "LinkedIn"],
    ["github", "GitHub"],
    ["tiktok", "TikTok"],
    ["facebook", "Facebook"],
    ["instagram", "Instagram"],
    ["youtube", "YouTube"],
  ].map(([key, label]) => ({ key, label, url: getProfileUrl(member[key]) }))
    .filter((platform) => platform.url);

  if (!platforms.length) return null;

  return (
    <div className="member-social-links">
      {platforms.map(({ key, label, url }) => (
        <a key={key} className={`member-social-link ${key}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} de ${member.name}`} title={label}>
          <SocialIcon platform={key} />
        </a>
      ))}
    </div>
  );
}

function SocialIcon({ platform }) {
  const paths = {
    linkedin: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.44c.98 0 1.79-.77 1.79-1.72V1.72C24 .77 23.19 0 22.22 0Z",
    github: "M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.53 2.47 4.65 1.75.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.62 5.23-5.11 5.51.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z",
    facebook: "M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z",
    instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm5 3.1a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 2.2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5.1-3.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z",
    tiktok: "M19.6 6.2a5.4 5.4 0 0 1-3.3-3.9h-3.5v13.8a2.9 2.9 0 1 1-2.9-2.9c.4 0 .8.1 1.1.2V9.8a7 7 0 1 0 5.3 6.8V9.5a8.8 8.8 0 0 0 5.1 1.6V7.6c-.6 0-1.2-.1-1.8-.4Z",
    youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[platform]} /></svg>;
}

function MemberCard({ member }) {
  const hasSocialLinks = ["linkedin", "github", "tiktok", "facebook", "instagram", "youtube"].some((key) => getProfileUrl(member[key]));
  const hasPhoto = Boolean(member.imageFront || member.imageBack);

  if (!hasPhoto) {
    return (
      <div className={`member-card member-card-no-photo${hasSocialLinks ? " member-card-has-socials" : ""}`}>
        <div className="member-card-placeholder" aria-hidden="true">{member.name?.trim().charAt(0).toUpperCase() || "?"}</div>
        <div className="member-card-meta">
          <div className="member-card-name">{member.name}</div>
          {member.role && <div className="member-card-role">{member.role}</div>}
          <MemberSocialLinks member={member} />
        </div>
      </div>
    );
  }

  return (
    <div className={`member-card${hasSocialLinks ? " member-card-has-socials" : ""}`}>
      <div className="member-card-inner">
        <div className="member-card-face front">
          <div className="member-card-photo">
            <img src={assetUrl(member.imageFront || member.imageBack)} alt={member.name} />
          </div>
          <div className="member-card-meta">
            <div className="member-card-name">{member.name}</div>
            {member.role && <div className="member-card-role">{member.role}</div>}
          </div>
        </div>
        <div className="member-card-face back">
          <div className="member-card-photo">
            <img src={assetUrl(member.imageBack || member.imageFront)} alt={`${member.name} foto 2`} />
          </div>
          <div className="member-card-meta">
            {hasSocialLinks ? (
              <MemberSocialLinks member={member} />
            ) : (
              <>
                <div className="member-card-name">{member.name}</div>
                {member.role && <div className="member-card-role">{member.role}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSection() {
  const [members, setMembers] = useState([]);
  const [people, setPeople] = useState(initialPeople);

  useEffect(() => {
    fetch(apiUrl('/api/members'))
      .then((res) => res.ok ? res.json() : membersFallback)
      .then((data) => setMembers(Array.isArray(data) ? data : membersFallback))
      .catch(() => setMembers(membersFallback));
    fetch(apiUrl('/api/people'))
      .then((res) => res.ok ? res.json() : initialPeople)
      .then((data) => setPeople(Array.isArray(data) ? data : initialPeople))
      .catch(() => setPeople(initialPeople));
  }, []);

  const teamMembers = members.filter((member) => !member.type || member.type !== 'group');
  const membersWithPhotos = teamMembers.filter((member) => member.imageFront || member.imageBack);
  const membersWithoutPhotos = teamMembers.filter((member) => !member.imageFront && !member.imageBack);
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
        {membersWithPhotos.length > 0 && (
          <div className="members-grid-responsive">
            {membersWithPhotos.map((member, i) => <MemberCard key={member.id || i} member={member} />)}
          </div>
        )}

        {membersWithoutPhotos.length > 0 && (
          <div className="members-without-photos">
            <div className="members-grid-no-photo">
              {membersWithoutPhotos.map((member, i) => <MemberCard key={member.id || i} member={member} />)}
            </div>
          </div>
        )}

        {teamMembers.length === 0 && (
            <div style={{ gridColumn: '1 / -1', color: C.muted, textAlign: 'center', padding: '2rem', background: C.blackCard, borderRadius: 8 }}>No hay integrantes registrados aún.</div>
        )}

        {groupPhoto && (
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div className="member-card member-card-static" style={{ maxWidth: 420, width: '100%' }}>
              <div className="member-card-inner">
                <div className="member-card-face front">
                  <div className="member-card-photo">
                    <img src={assetUrl(groupPhoto.imageFront)} alt={groupPhoto.name} />
                  </div>
                  <div className="member-card-meta">
                    <div className="member-card-name">{groupPhoto.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          <div className="people-grid">
            {people.map((person) => (
              <article className="people-card" key={person.id || `${person.title}-${person.name}`}>
                {person.imageFront && <img className="people-card-photo" src={assetUrl(person.imageFront)} alt={person.name} />}
                <div className="people-card-content">
                  <div className="people-card-title">{person.title}</div>
                  <h3>{person.name}</h3>
                  <p>{person.profession}</p>
                  {person.email && <a className="people-card-email" href={`mailto:${person.email}`}>{person.email}</a>}
                  <MemberSocialLinks member={person} />
                </div>
              </article>
            ))}
          </div>
      </div>
    </section>
  );
}
