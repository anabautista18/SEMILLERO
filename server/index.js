const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const nodemailer = require('nodemailer');

require('dotenv').config({ path: path.join(__dirname, '.env') });
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || null; // plain fallback (not recommended)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || null; // preferred
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'devsecret';
const CONTACT_TO = process.env.CONTACT_TO || 'cmparedesv@usbcali.edu.co';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const COOKIE_OPTIONS = {
  httpOnly: true,
  signed: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.COOKIE_SECURE === 'true'
};
const DATA_DIR = path.resolve(process.env.DATA_DIR || __dirname);
const DB_PATH = path.join(DATA_DIR, 'db.json');
const LEGACY_DB_PATH = path.join(process.env.LEGACY_DATA_DIR || __dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const MEMBER_IMAGES_DIR = path.join(__dirname, '..', 'src', 'img');
const FRONTEND_DIR = path.join(__dirname, '..', 'dist');

fs.mkdirSync(DATA_DIR, { recursive: true });

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readDB() {
  if (fs.existsSync(DB_PATH)) {
    return normalizeMemberImages(JSON.parse(fs.readFileSync(DB_PATH, 'utf8')));
  }

  if (DB_PATH !== LEGACY_DB_PATH && fs.existsSync(LEGACY_DB_PATH)) {
    const legacyDB = JSON.parse(fs.readFileSync(LEGACY_DB_PATH, 'utf8'));
    return normalizeMemberImages(legacyDB);
  }

  return { members: [], projects: [], publications: [] };
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/images', express.static(MEMBER_IMAGES_DIR));

function normalizeMemberImage(image) {
  if (typeof image !== 'string' || !image) return image;

  try {
    const url = new URL(image, 'http://localhost');
    const imagePath = decodeURIComponent(url.pathname);
    if (url.protocol !== 'file:' && !imagePath.includes('/src/img/')) return image;

    const filename = path.basename(imagePath);
    if (filename && fs.existsSync(path.join(MEMBER_IMAGES_DIR, filename))) {
      return `/images/${encodeURIComponent(filename)}`;
    }
  } catch (error) {
    console.error('Could not normalize member image URL', error);
  }

  return image;
}

function normalizeMemberImages(db) {
  let changed = false;
  db.members = (db.members || []).map((member) => {
    const normalized = {
      ...member,
      imageFront: normalizeMemberImage(member.imageFront),
      imageBack: normalizeMemberImage(member.imageBack),
    };
    if (normalized.imageFront !== member.imageFront || normalized.imageBack !== member.imageBack) {
      changed = true;
    }
    return normalized;
  });
  if (changed) writeDB(db);
  return db;
}

// Simple auth: set an httpOnly cookie when password matches
app.post('/api/login', async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(401).json({ ok: false });

  try {
    if (ADMIN_PASSWORD_HASH) {
      const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (ok) {
        res.cookie('admin', '1', COOKIE_OPTIONS);
        return res.json({ ok: true });
      }
    }

    // fallback to plain env password for convenience (not secure)
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      res.cookie('admin', '1', COOKIE_OPTIONS);
      return res.json({ ok: true });
    }
  } catch (e) {
    console.error('login error', e);
  }

  res.status(401).json({ ok: false });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('admin');
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  res.json({ admin: req.signedCookies && req.signedCookies.admin === '1' });
});

app.get('/api/members', (req, res) => {
  const db = readDB();
  res.json(db.members || []);
});

function requireAdmin(req, res, next){
  if ((req.signedCookies && req.signedCookies.admin === '1') || (req.cookies && req.cookies.admin === '1')) return next();
  res.status(401).json({ error: 'unauthorized' });
}

const contactSubmissions = new Map();
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';

  if (!cleanName || cleanName.length > 120 || !cleanEmail || cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !cleanMessage || cleanMessage.length > 10000 ||
      cleanSubject.length > 160) {
    return res.status(400).json({ error: 'Revisa el nombre, correo, asunto y mensaje e inténtalo de nuevo.' });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || smtpUser;
  if (!smtpHost || !smtpUser || !smtpPass || !from) {
    return res.status(503).json({ error: 'El envío de correo aún no está configurado en el servidor.' });
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const clientIp = req.ip;
  const submissions = (contactSubmissions.get(clientIp) || []).filter((time) => now - time < windowMs);
  if (submissions.length >= 5) {
    return res.status(429).json({ error: 'Se alcanzó el límite de envíos. Inténtalo de nuevo más tarde.' });
  }
  submissions.push(now);
  contactSubmissions.set(clientIp, submissions);

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from,
      to: CONTACT_TO,
      replyTo: { name: cleanName, address: cleanEmail },
      subject: cleanSubject || 'Contacto desde SEMILLERO DIDI 4.0',
      text: `Nombre: ${cleanName}\nCorreo: ${cleanEmail}\n\n${cleanMessage}`,
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Contact email delivery failed:', error.message);
    res.status(502).json({ error: 'No se pudo entregar el correo en este momento. Inténtalo más tarde.' });
  }
});

app.get('/api/people', (req, res) => {
  res.json(readDB().people || []);
});

app.post('/api/people/seed', requireAdmin, (req, res) => {
  const { people } = req.body || {};
  if (!Array.isArray(people)) return res.status(400).json({ error: 'people must be an array' });

  const db = readDB();
  if (Array.isArray(db.people) && db.people.length > 0) {
    return res.json({ people: db.people, seeded: false });
  }
  if (db.peopleInitialized) {
    return res.json({ people: db.people || [], seeded: false });
  }

  db.people = people.map((person, index) => ({
    ...person,
    imageFront: normalizeMemberImage(person.imageFront),
    imageBack: normalizeMemberImage(person.imageBack),
    id: Date.now() + index,
  }));
  db.peopleInitialized = true;
  writeDB(db);
  res.json({ people: db.people, seeded: true });
});

app.post('/api/people', requireAdmin, (req, res) => {
  const db = readDB();
  const person = { ...req.body, id: Date.now() };
  db.people = db.people || [];
  db.people.push(person);
  writeDB(db);
  res.json(person);
});

app.put('/api/people/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.people = db.people || [];
  const index = db.people.findIndex((person) => person.id === id);
  if (index === -1) return res.status(404).json({ error: 'not found' });
  db.people[index] = { ...db.people[index], ...req.body };
  writeDB(db);
  res.json(db.people[index]);
});

app.delete('/api/people/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.people = (db.people || []).filter((person) => person.id !== id);
  writeDB(db);
  res.json({ ok: true });
});

app.post('/api/members/seed', requireAdmin, (req, res) => {
  const { members } = req.body || {};
  if (!Array.isArray(members)) return res.status(400).json({ error: 'members must be an array' });

  const db = readDB();
  if (Array.isArray(db.members) && db.members.length > 0) {
    return res.json({ members: db.members, seeded: false });
  }
  if (db.membersInitialized) {
    return res.json({ members: db.members || [], seeded: false });
  }

  db.members = members.map((member, index) => ({
    ...member,
    imageFront: normalizeMemberImage(member.imageFront),
    imageBack: normalizeMemberImage(member.imageBack),
    id: Date.now() + index,
  }));
  db.membersInitialized = true;
  writeDB(db);
  res.json({ members: db.members, seeded: true });
});

app.post('/api/members', requireAdmin, (req, res) => {
  const db = readDB();
  const newMember = { id: Date.now(), ...req.body };
  db.members = db.members || [];
  db.members.push(newMember);
  writeDB(db);
  res.json(newMember);
});

app.put('/api/members/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.members = db.members || [];
  const idx = db.members.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  db.members[idx] = { ...db.members[idx], ...req.body };
  writeDB(db);
  res.json(db.members[idx]);
});

app.delete('/api/members/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.members = db.members || [];
  db.members = db.members.filter(m => m.id !== id);
  writeDB(db);
  res.json({ ok: true });
});

// Projects and publications basic routes (read-only GET + admin CRUD)
app.get('/api/projects', (req, res) => { res.json((readDB().projects) || []); });
app.post('/api/projects', requireAdmin, (req, res) => { const db = readDB(); const item = { id: Date.now(), ...req.body }; db.projects = db.projects || []; db.projects.push(item); writeDB(db); res.json(item); });
app.put('/api/projects/:id', requireAdmin, (req, res) => { const db = readDB(); const id = Number(req.params.id); db.projects = db.projects || []; const idx = db.projects.findIndex(p => p.id === id); if (idx === -1) return res.status(404).json({ error: 'not found' }); db.projects[idx] = {...db.projects[idx], ...req.body}; writeDB(db); res.json(db.projects[idx]); });
app.delete('/api/projects/:id', requireAdmin, (req, res) => { const db = readDB(); const id = Number(req.params.id); db.projects = (db.projects||[]).filter(p => p.id !== id); writeDB(db); res.json({ ok: true }); });

app.get('/api/publications', (req, res) => { res.json((readDB().publications) || []); });
app.post('/api/publications/seed', requireAdmin, (req, res) => {
  const { publications } = req.body || {};
  if (!Array.isArray(publications)) return res.status(400).json({ error: 'publications must be an array' });

  const db = readDB();
  if (Array.isArray(db.publications) && db.publications.length > 0) {
    return res.json({ publications: db.publications, seeded: false });
  }
  if (db.publicationsInitialized) {
    return res.json({ publications: db.publications || [], seeded: false });
  }

  db.publications = publications.map((publication, index) => ({
    ...publication,
    id: Date.now() + index,
  }));
  db.publicationsInitialized = true;
  writeDB(db);
  res.json({ publications: db.publications, seeded: true });
});
app.post('/api/publications', requireAdmin, (req, res) => { const db = readDB(); const item = { id: Date.now(), ...req.body }; db.publications = db.publications || []; db.publications.push(item); writeDB(db); res.json(item); });
app.put('/api/publications/:id', requireAdmin, (req, res) => { const db = readDB(); const id = Number(req.params.id); db.publications = db.publications || []; const idx = db.publications.findIndex(p => p.id === id); if (idx === -1) return res.status(404).json({ error: 'not found' }); db.publications[idx] = {...db.publications[idx], ...req.body}; writeDB(db); res.json(db.publications[idx]); });
app.delete('/api/publications/:id', requireAdmin, (req, res) => { const db = readDB(); const id = Number(req.params.id); db.publications = (db.publications||[]).filter(p => p.id !== id); writeDB(db); res.json({ ok: true }); });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '-');
      cb(null, `${Date.now()}-${safeName}`);
    }
  })
});

app.post('/api/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Serve built frontend if available, otherwise fallback to the static admin page
if (fs.existsSync(FRONTEND_DIR)) {
  app.use(express.static(FRONTEND_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
  });
} else {
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  });
  app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  });
  app.use('/admin', express.static(path.join(__dirname, 'public')));
}

app.listen(PORT, () => console.log(`Admin server running on http://localhost:${PORT}/admin`));
