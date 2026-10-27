import React, { useState, useEffect } from 'react';
import '../styles/globals.css';
import { C } from '../data/colors';
import { members as initialMembers } from '../data/members';
import { initialPeople } from '../data/people';
import { publications as initialPublications } from '../data/publications';
import { apiUrl, assetUrl } from '../utils/urls';

const PUBLICATIONS_PER_PAGE = 5;

async function api(path, opts = {}) {
  const headers = opts.body instanceof FormData ? {} : { 'content-type': 'application/json' };
  const res = await fetch(apiUrl(path), { credentials: 'include', ...opts, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

async function uploadFile(file) {
  if (!file) return null;
  const data = new FormData();
  data.append('file', file);
  const res = await fetch(apiUrl('/api/upload'), { method: 'POST', body: data, credentials: 'include' });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.url;
}

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetch(apiUrl('/api/me'), { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAdmin(d.admin))
      .catch(() => setAdmin(false));
  }, []);

  async function login() {
    try {
      await api('/api/login', { method: 'POST', body: JSON.stringify({ password }) });
      setAdmin(true);
    } catch (e) {
      alert('Contraseña incorrecta');
    }
  }

  async function logout() {
    await api('/api/logout', { method: 'POST' });
    setAdmin(false);
  }

  if (admin === null) return <div style={{ padding: 40, color: C.white }}>Cargando...</div>;

  if (!admin) return (
    <div style={{ padding: 40, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 420, margin: '0 auto', background: C.blackCard, padding: 20, borderRadius: 8 }}>
        <h3 style={{ color: C.white }}>Panel Admin</h3>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
          style={{ width: '100%', padding: 10, marginBottom: 10, fontFamily: "'Inter', sans-serif", fontSize: 14 }}
        />
        <button
          onClick={login}
          style={{ width: '100%', padding: 10, background: `linear-gradient(135deg, ${C.orange}, ${C.purple})`, color: '#fff', border: 0, borderRadius: 6, fontFamily: "'Inter', sans-serif", fontSize: 14 }}
        >
          Ingresar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: C.black, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto', gap: 24 }}> 
        <div>
          <h2 style={{ color: C.white, marginBottom: 4 }}>Admin — SEMILLERO</h2>
          <p style={{ color: C.muted }}>Administra integrantes, docentes, coordinadores, proyectos y publicaciones.</p>
        </div>
        <button onClick={logout} style={{ padding: '10px 16px', borderRadius: 6, background: '#1f1f2a', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}>Cerrar sesión</button>
      </div>
      <div style={{ maxWidth: 1200, margin: '24px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}> 
        <div style={{ gridColumn: '1 / -1', background: C.blackCard, padding: 20, borderRadius: 12 }}>
          <h3 style={{ color: C.white }}>Docentes, coordinación y otros roles</h3>
          <PeopleManager />
        </div>
        <div style={{ background: C.blackCard, padding: 20, borderRadius: 12 }}>
          <h3 style={{ color: C.white }}>Integrantes</h3>
          <MembersManager />
        </div>
        <div style={{ background: C.blackCard, padding: 20, borderRadius: 12 }}>
          <h3 style={{ color: C.white }}>Proyectos</h3>
          <ProjectsManager />
        </div>
        <div style={{ gridColumn: '1 / -1', background: C.blackCard, padding: 20, borderRadius: 12 }}>
          <h3 style={{ color: C.white }}>Publicaciones</h3>
          <PublicationsManager />
        </div>
      </div>
    </div>
  );
}

function PeopleManager() {
  const emptyForm = {
    title: '', name: '', profession: '', email: '', imageFront: '', frontFile: null,
    linkedin: '', github: '', tiktok: '', facebook: '', instagram: '', youtube: '',
  };
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      let data = await api('/api/people');
      if (data.length === 0) {
        const seeded = await api('/api/people/seed', {
          method: 'POST',
          body: JSON.stringify({ people: initialPeople }),
        });
        data = seeded.people;
      }
      setItems(data);
      setError('');
    } catch (e) {
      setError(`No se pudieron cargar los roles: ${e.message}`);
    }
  }

  async function submitPerson() {
    try {
      const payload = { ...form };
      delete payload.frontFile;
      if (form.frontFile) payload.imageFront = await uploadFile(form.frontFile);
      const method = editing ? 'PUT' : 'POST';
      const path = editing ? `/api/people/${editing}` : '/api/people';
      await api(path, { method, body: JSON.stringify(payload) });
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (e) {
      setError(`No se pudo guardar el perfil: ${e.message}`);
    }
  }

  function startEdit(person) {
    setEditing(person.id);
    setForm({ ...emptyForm, ...person, frontFile: null });
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este perfil?')) return;
    try {
      await api(`/api/people/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(`No se pudo eliminar el perfil: ${e.message}`);
    }
  }

  return (
    <div>
      {error && <div role="alert" style={{ color: '#ff9b9b', margin: '10px 0' }}>{error}</div>}
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 10, borderRadius: 10, background: '#111119' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700 }}>{item.title}: {item.name}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{item.profession} · {item.email}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => startEdit(item)}>Editar</button>
              <button onClick={() => remove(item.id)} style={{ background: '#8b2c2c' }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 style={{ color: C.white, marginBottom: 12 }}>{editing ? 'Editar perfil' : 'Nuevo perfil'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          <input placeholder="Cargo o título (ej. Docente asesor)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Profesión / formación" value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })} />
          <input type="email" placeholder="Correo electrónico" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="url" placeholder="LinkedIn (URL)" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
          <input type="url" placeholder="GitHub (URL)" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
          <input type="url" placeholder="TikTok (URL)" value={form.tiktok} onChange={e => setForm({ ...form, tiktok: e.target.value })} />
          <input type="url" placeholder="Facebook (URL)" value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} />
          <input type="url" placeholder="Instagram (URL)" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
          <input type="url" placeholder="Canal de YouTube (URL)" value={form.youtube} onChange={e => setForm({ ...form, youtube: e.target.value })} />
          <input placeholder="URL de foto (opcional)" value={form.imageFront} onChange={e => setForm({ ...form, imageFront: e.target.value })} />
          <input type="file" accept="image/*" onChange={e => setForm({ ...form, frontFile: e.target.files[0] })} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button onClick={submitPerson} style={{ flex: 1 }}>Guardar perfil</button>
          {editing && <button onClick={() => { setEditing(null); setForm(emptyForm); }} style={{ flex: 1, background: '#333' }}>Cancelar</button>}
        </div>
      </div>
    </div>
  );
}

function MembersManager() {
  const [items, setItems] = useState([]);
  const emptyForm = { name: '', role: '', imageFront: '', imageBack: '', linkedin: '', github: '', frontFile: null, backFile: null };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      let data = await api('/api/members');
      if (data.length === 0) {
        const seeded = await api('/api/members/seed', {
          method: 'POST',
          body: JSON.stringify({ members: initialMembers }),
        });
        data = seeded.members;
      }
      setItems(data);
      setError('');
    } catch (e) {
      setError(`No se pudieron cargar los integrantes: ${e.message}`);
    }
  }

  async function submitMember(item) {
    try {
      const payload = {
        name: item.name,
        role: item.role,
        imageFront: item.imageFront,
        imageBack: item.imageBack,
        linkedin: item.linkedin,
        github: item.github,
      };
      if (item.frontFile) payload.imageFront = await uploadFile(item.frontFile);
      if (item.backFile) payload.imageBack = await uploadFile(item.backFile);
      if (item.id) {
        await api('/api/members/' + item.id, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api('/api/members', { method: 'POST', body: JSON.stringify(payload) });
      }
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (e) {
      setError(`No se pudo guardar el integrante: ${e.message}`);
    }
  }

  async function remove(id) {
    if (!confirm('Eliminar integrante?')) return;
    try {
      await api('/api/members/' + id, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(`No se pudo eliminar el integrante: ${e.message}`);
    }
  }

  function startEdit(member) {
    setEditing(member.id);
    setForm({ ...emptyForm, ...member, frontFile: null, backFile: null });
  }

  return (
    <div>
      <div style={{ display: 'grid', gap: 10 }}>
        {error && <div role="alert" style={{ color: '#ff9b9b', fontSize: 13 }}>{error}</div>}
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 10, background: '#111119' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700 }}>{item.name}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{item.role || 'Sin rol'}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{item.imageFront || item.imageBack ? 'Fotos cargadas' : 'Sin fotos'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(item)} style={{ padding: '8px 12px', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>Editar</button>
              <button onClick={() => remove(item.id)} style={{ padding: '8px 12px', background: '#8b2c2c', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 style={{ color: C.white, marginBottom: 12 }}>{editing ? 'Editar integrante' : 'Nuevo integrante'}</h4>
        <div style={{ display: 'grid', gap: 10 }}>
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Rol / descripción" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          <input type="url" placeholder="Enlace de LinkedIn (https://...)" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
          <input type="url" placeholder="Enlace de GitHub (https://...)" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
          <input placeholder="URL imagen frontal" value={form.imageFront} onChange={e => setForm({ ...form, imageFront: e.target.value })} />
          <input type="file" accept="image/*" onChange={e => setForm({ ...form, frontFile: e.target.files[0] })} />
          <input placeholder="URL imagen trasera" value={form.imageBack} onChange={e => setForm({ ...form, imageBack: e.target.value })} />
          <input type="file" accept="image/*" onChange={e => setForm({ ...form, backFile: e.target.files[0] })} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => submitMember({ ...form, id: editing })} style={{ flex: 1 }}>Guardar</button>
            {editing && <button onClick={() => { setEditing(null); setForm(emptyForm); }} style={{ flex: 1, background: '#333' }}>Cancelar</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', summary: '', link: '', tag: '', color: '', image: '', imageFile: null });
  const [editing, setEditing] = useState(null);

  useEffect(() => { load(); }, []);
  async function load() { const data = await api('/api/projects'); setItems(data); }
  async function submitProject(item) {
    const payload = { title: item.title, desc: item.summary, link: item.link, tag: item.tag, color: item.color, image: item.image };
    if (item.imageFile) payload.image = await uploadFile(item.imageFile);
    if (item.id) {
      await api('/api/projects/' + item.id, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await api('/api/projects', { method: 'POST', body: JSON.stringify(payload) });
    }
    setForm({ title: '', summary: '', link: '', tag: '', color: '', image: '', imageFile: null });
    setEditing(null);
    load();
  }
  async function remove(id) { if (!confirm('Eliminar proyecto?')) return; await api('/api/projects/' + id, { method: 'DELETE' }); load(); }
  function startEdit(project) { setEditing(project.id); setForm({ title: project.title, summary: project.desc, link: project.link, tag: project.tag, color: project.color, image: project.image || '', imageFile: null }); }

  return (
    <div>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map(item => (
          <div key={item.id} style={{ display: 'grid', gap: 6, padding: 12, borderRadius: 10, background: '#111119' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 700 }}>{item.title}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>{item.tag || 'Proyecto'}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startEdit(item)}>Editar</button>
                <button onClick={() => remove(item.id)} style={{ background: '#8b2c2c' }}>Eliminar</button>
              </div>
            </div>
            <div style={{ color: C.muted, fontSize: 12 }}>{item.desc}</div>
            {item.image && <img src={assetUrl(item.image)} alt={item.title} style={{ width: '100%', borderRadius: 10, maxHeight: 160, objectFit: 'cover' }} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        <h4 style={{ color: C.white, marginBottom: 12 }}>{editing ? 'Editar proyecto' : 'Nuevo proyecto'}</h4>
        <div style={{ display: 'grid', gap: 10 }}>
          <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Descripción" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
          <input placeholder="Enlace (GitHub / demo)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
          <input placeholder="Etiqueta" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
          <input placeholder="Color hex (#...)" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
          <input placeholder="URL imagen" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <input type="file" accept="image/*" onChange={e => setForm({ ...form, imageFile: e.target.files[0] })} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => submitProject({ ...form, id: editing })} style={{ flex: 1 }}>Guardar</button>
            {editing && <button onClick={() => { setEditing(null); setForm({ title:'', summary:'', link:'', tag:'', color:'', image:'', imageFile:null }); }} style={{ flex: 1, background: '#333' }}>Cancelar</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicationsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', authors: '', type: '', venue: '', link: '' });
  const [editing, setEditing] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PUBLICATIONS_PER_PAGE);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      let data = await api('/api/publications');
      if (data.length === 0) {
        const seeded = await api('/api/publications/seed', {
          method: 'POST',
          body: JSON.stringify({
            publications: initialPublications.map((publication) => ({
              title: publication.title,
              authors: publication.authors,
              type: publication.type,
              venue: publication.venue || '',
              link: publication.link || '',
            })),
          }),
        });
        data = seeded.publications;
      }
      setItems(data);
      setVisibleCount((count) => Math.min(count, Math.max(data.length, PUBLICATIONS_PER_PAGE)));
      setError('');
    } catch (e) {
      setError(`No se pudieron cargar las publicaciones: ${e.message}`);
    }
  }
  async function submitPublication(item) {
    try {
      const payload = { title: item.title, authors: item.authors, type: item.type, venue: item.venue, link: item.link };
      const isNew = !item.id;
      if (item.id) {
        await api('/api/publications/' + item.id, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api('/api/publications', { method: 'POST', body: JSON.stringify(payload) });
      }
      setForm({ title: '', authors: '', type: '', venue: '', link: '' });
      setEditing(null);
      await load();
      if (isNew) setVisibleCount((count) => Math.max(count, items.length + 1));
    } catch (e) {
      setError(`No se pudo guardar la publicación: ${e.message}`);
    }
  }
  async function remove(id) {
    if (!confirm('Eliminar publicación?')) return;
    try {
      await api('/api/publications/' + id, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(`No se pudo eliminar la publicación: ${e.message}`);
    }
  }
  function startEdit(pub) { setEditing(pub.id); setForm({ title: pub.title, authors: pub.authors, type: pub.type, venue: pub.venue, link: pub.link || '' }); }
  const visibleItems = items.slice(0, visibleCount);

  return (
    <div>
      {error && <div role="alert" style={{ color: '#ff9b9b', marginBottom: 10 }}>{error}</div>}
      <div style={{ display: 'grid', gap: 10 }}>
        {visibleItems.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, background: '#111119' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700 }}>{item.title}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{item.authors} · {item.type}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{item.venue}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(item)}>Editar</button>
              <button onClick={() => remove(item.id)} style={{ background: '#8b2c2c' }}>Eliminar</button>
            </div>
          </div>
        ))}
        {visibleCount < items.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PUBLICATIONS_PER_PAGE)}
            >
              Mostrar más
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        <h4 style={{ color: C.white, marginBottom: 12 }}>{editing ? 'Editar publicación' : 'Nueva publicación'}</h4>
        <div style={{ display: 'grid', gap: 10 }}>
          <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Autores" value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} />
          <input placeholder="Tipo (Congreso, Artículo, Poster)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          <input placeholder="Lugar / Congreso" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
          <input placeholder="Enlace (URL)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => submitPublication({ ...form, id: editing })} style={{ flex: 1 }}>Guardar</button>
            {editing && <button onClick={() => { setEditing(null); setForm({ title:'', authors:'', type:'', venue:'', link:'' }); }} style={{ flex: 1, background: '#333' }}>Cancelar</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
