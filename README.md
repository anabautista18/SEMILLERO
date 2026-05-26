# Semillero de Investigación — USB Cali

Sitio web del semillero de investigación. v1.0 Frontend en React + Vite, backend en Express con autenticación de administrador.

## Levantar con Docker

```bash
# Clonar y entrar al proyecto
git clone <repo> && cd semillero

# Copiar y ajustar variables de entorno
cp .env.example .env

# Construir y levantar
docker compose up --build
```

La app queda disponible en **http://localhost:9023**

## Variables de entorno (`.env`)

| Variable            | Descripción                                      | Ejemplo              |
|---------------------|--------------------------------------------------|----------------------|
| `PORT`              | Puerto interno del servidor                      | `80`                 |
| `ADMIN_PASSWORD`    | Contraseña en texto plano (desarrollo)           | `usbcali2026*`       |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt (recomendado en producción)        | `$2b$10$...`         |
| `COOKIE_SECRET`     | Secreto para firmar cookies de sesión            | `mi_secreto`         |
| `COOKIE_SECURE`     | `true` solo si se sirve bajo HTTPS               | `false`              |

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
│   ├── db.json        # Base de datos JSON (auto-generada)
│   └── uploads/       # Archivos subidos (auto-generado)
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
