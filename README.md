# Semillero de Investigación — USB Cali

Sitio web del semillero de investigación. v1.0 Frontend en React + Vite, backend en Express con autenticación de administrador.

## Levantar con Docker

```bash
# Clonar y entrar al proyecto
git clone <repo> && cd semillero

# Copiar y ajustar variables de entorno
cp .env.example .env
# Cambiar ADMIN_PASSWORD y COOKIE_SECRET antes de exponer el sitio a Internet

# Construir y levantar
docker compose up --build
```

La app queda disponible en **http://localhost:9023**

Docker guarda los cambios del admin en el volumen persistente `semillero_data` (`db.json`) y en `server/uploads` (imágenes). Esos datos permanecen al reconstruir o reemplazar el contenedor. Conserva ambos al actualizar y respáldalos periódicamente.

## Variables de entorno (`.env`)

| Variable            | Descripción                                      | Ejemplo              |
|---------------------|--------------------------------------------------|----------------------|
| `PORT`              | Puerto interno del servidor                      | `80`                 |
| `ADMIN_PASSWORD`    | Contraseña en texto plano (desarrollo)           | `usbcali2026*`       |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt (recomendado en producción)        | `$2b$10$...`         |
| `COOKIE_SECRET`     | Secreto para firmar cookies de sesión            | `mi_secreto`         |
| `COOKIE_SECURE`     | `true` solo si se sirve bajo HTTPS               | `false`              |
| `CONTACT_TO`        | Destino de los mensajes del formulario            | `cmparedesv@usbcali.edu.co` |
| `SMTP_HOST`         | Servidor SMTP del proveedor de correo             | proveedor de correo  |
| `SMTP_PORT`         | Puerto SMTP (465 seguro o 587 STARTTLS)           | `587`                |
| `SMTP_SECURE`       | `true` para TLS directo; normalmente `false` en 587 | `false`            |
| `SMTP_USER`         | Usuario de la cuenta SMTP                         | —                    |
| `SMTP_PASS`         | Contraseña/token SMTP (secreto; nunca en el frontend) | —                |
| `SMTP_FROM`         | Remitente verificado, normalmente el usuario SMTP | —                    |

El formulario de contacto envía desde el servidor por SMTP y responde al correo de quien escribió. Para activarlo, crea una cuenta en cualquier proveedor SMTP, verifica la dirección remitente y configura sus datos como variables secretas en el hosting (o en `.env` local). No uses la contraseña normal de tu correo personal: utiliza una clave SMTP o contraseña de aplicación. Sin `SMTP_HOST`, `SMTP_USER` y `SMTP_PASS`, el formulario avisa que el servicio aún no está configurado; no simula un envío.

El admin permite crear, editar y eliminar docentes, coordinadores y otros roles, con título, nombre, profesión, correo, foto y redes sociales.

## Estructura

```
├── src/               # Frontend React
│   ├── components/    # Secciones de la página
│   ├── data/          # Datos estáticos iniciales
│   ├── pages/         # Panel de administración
│   └── img/           # Fotos de integrantes
├── server/
│   ├── index.js       # API Express
│   ├── public/        # Admin HTML/JS estático
│   ├── data/db.json   # Base de datos JSON (auto-generada; persistente)
│   └── uploads/       # Archivos subidos (persistentes en el host)
├── Dockerfile
└── docker-compose.yml
```

## Desarrollo local

```bash
# Instalar dependencias
npm install
cd server && npm install && cd ..

# Levantar frontend (puerto 5173) y backend (puerto 4000) por separado
npm run dev          # Vite
npm run server       # Express
```
