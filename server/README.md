# SEMILLERO Admin Server

Instalación y uso rápido del panel admin ligero.

Requisitos: Node.js 16+.

1. Instalar dependencias

```bash
cd server
npm install
```

2. Configurar credenciales

Puedes usar `ADMIN_PASSWORD` (texto plano) para arrancar rápido o `ADMIN_PASSWORD_HASH` con un bcrypt hash (recomendado).

Generar un hash bcrypt (ejemplo de uso en Node):

```js
// en node REPL
const bcrypt = require('bcrypt');
bcrypt.hash('tu-password', 10).then(h => console.log(h));
```

Copia el hash a `.env` como `ADMIN_PASSWORD_HASH` y define también `COOKIE_SECRET`.

Ejemplo `.env`:

```
ADMIN_PASSWORD_HASH=$2b$10$...    # (hash generado)
COOKIE_SECRET=mi_secreto_largo
PORT=4000
```

3. Ejecutar

```bash
npm run start
```

Acceder al panel: http://localhost:4000/admin

Notas:
- El server usa `db.json` como almacenamiento simple; para producción considera migrar a SQLite o una base de datos real.
- El panel actual es estático y simple; puedo migrarlo a React si lo prefieres.
