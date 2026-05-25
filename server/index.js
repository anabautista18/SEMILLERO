const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');

require('dotenv').config({ path: path.join(__dirname, '.env') });
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || null; // plain fallback (not recommended)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || null; // preferred
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'devsecret';
const COOKIE_OPTIONS = {
  httpOnly: true,
  signed: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.COOKIE_SECURE === 'true'
};
const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const FRONTEND_DIR = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readDB(){
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch (e) { return { members: [], projects: [], publications: [] }; }
}

function writeDB(db){
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use('/uploads', express.static(UPLOADS_DIR));

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
