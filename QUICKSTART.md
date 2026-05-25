# 🎯 Quick Start - Cómo ejecutar el proyecto

## Opción 1: Desde PowerShell/Terminal

### Paso 1: Abrir terminal en la carpeta del proyecto
```
Windows: Ctrl + Shift + Click derecho en SEMILLERO → "Abrir PowerShell aquí"
Mac/Linux: Abre terminal y navega: cd /ruta/a/SEMILLERO
```

### Paso 2: Instalar dependencias
```bash
npm install
```
_Espera a que termine (puede tomar 1-2 minutos)_

### Paso 3: Iniciar servidor
```bash
npm run dev
```

### Resultado esperado
```
✓ Vite 4.x.x
✓ 📦 built in XXms
✓ ➜ Local: http://localhost:3000/
```

**La página se abrirá automáticamente en tu navegador** 🎉

---

## Opción 2: Usando VS Code

### Paso 1: Abrir carpeta en VS Code
```
Archivo → Abrir carpeta → Selecciona SEMILLERO
```

### Paso 2: Abrir terminal integrado
```
Ctrl + Ñ  (o Ctrl + Backtick)
```

### Paso 3: Ejecutar comandos
```bash
npm install
npm run dev
```

### La página abrirá automáticamente ✨

---

## 🔄 Flujo Normal de Trabajo

```
┌─────────────────────────────────────┐
│ 1. npm install (primera vez)        │
│    Instala: react, react-dom, three │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ 2. npm run dev                      │
│    Abre: http://localhost:3000      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ 3. Hacer cambios en:                │
│    - src/data/*.js (contenido)      │
│    - src/components/*.jsx (diseño)  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ 4. Ver cambios automáticamente      │
│    (Hot Reload - sin refrescar)     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ 5. npm run build                    │
│    Genera carpeta dist/ lista       │
│    para producción/hosting          │
└─────────────────────────────────────┘
```

---

## 📝 Edición Típica

### Cambiar color naranja
1. Abre: `src/data/colors.js`
2. Busca: `orange: "#e57224"`
3. Cambia a: `orange: "#FF6B00"` (ejemplo)
4. **Guarda** (Ctrl+S)
5. ✨ Cambio visible automáticamente en navegador

### Agregar proyecto
1. Abre: `src/data/projects.js`
2. Agrega al array:
```javascript
{ 
  title: "Mi Proyecto", 
  tag: "Mi Tecnología",
  color: C.orange,
  link: "https://github.com/...",
  desc: "Descripción corta..."
}
```
3. **Guarda** (Ctrl+S)
4. ✨ Proyecto aparece en la sección automáticamente

---

## ✅ Validación

### Después de `npm install`, deberías ver:
```
✓ added 500+ packages (ejemplo)
✓ up to date, audited XXX packages
```

### Después de `npm run dev`, deberías ver:
```
✓ Vite 4.3.9 (o superior)
✓ ➜ Local: http://localhost:3000/
✓ ➜ press h to show help
```

---

## 🛠️ Troubleshooting

### "No reconoce npm"
- Asegúrate de tener Node.js instalado
- Abre nueva terminal/PowerShell después de instalar

### "Port 3000 está en uso"
- Cambia en `vite.config.js` puerto a 3001:
```javascript
server: {
  port: 3001,  // ← Cambiar aquí
}
```

### "Module not found"
- Verifica que las rutas de `import` sean correctas
- Reinicia: `npm run dev`

### "Estilos rotos"
- Limpiar cache: Ctrl+Shift+Delete en navegador
- Reiniciar servidor

---

## 📊 Carpetas de Edición Frecuente

```
src/data/         ← 80% de cambios van aquí
├── colors.js     ← Cambiar paleta
├── areas.js      ← Agregar áreas
├── projects.js   ← Agregar proyectos
├── publications.js ← Agregar publicaciones
├── members.js    ← Actualizar miembros
└── stats.js      ← Cambiar estadísticas

src/components/   ← 15% de cambios
└── *Section.jsx  ← Cambiar diseño de secciones

src/styles/       ← 5% de cambios
└── globals.css   ← Estilos globales
```

---

## 🚀 Deploy (Cuando esté listo)

### Compilar para producción
```bash
npm run build
```

Genera carpeta `dist/` con los archivos listos para:
- Vercel
- Netlify
- GitHub Pages
- Tu servidor web

### Ver build local antes de publicar
```bash
npm run preview
```

---

## 💾 Guardar Cambios

```
Visual Studio Code:
Ctrl + S            ← Guardar archivo actual
Ctrl + Shift + S    ← Guardar todos

PowerShell:
Cambios se guardan automáticamente en el editor
```

---

## ⚡ Atajos Útiles

| Atajo | Función |
|---|---|
| `Ctrl + S` | Guardar archivo |
| `Ctrl + Ñ` | Terminal en VS Code |
| `Ctrl + K + W` | Cerrar pestañas VS Code |
| `F12` | Abrir DevTools |
| `Ctrl + Shift + I` | DevTools alternativo |

---

## 🎓 Ejemplo Completo

**Quiero agregar un nuevo proyecto:**

```bash
# 1. Terminal abierta con npm run dev

# 2. Abre: src/data/projects.js

# 3. Agrega al final del array:
{
  title: "Mi IA Detector", 
  tag: "Machine Learning",
  color: C.orange,
  link: "https://github.com/tuusuario/proyecto",
  desc: "Detecta patrones usando visión computacional."
}

# 4. Presiona Ctrl+S para guardar

# 5. Ve al navegador y ve el nuevo proyecto en la sección ✨
```

---

## 🎉 ¡Listo!

Tu proyecto está completamente funcional.

**Pasos finales:**
1. `npm install`
2. `npm run dev`
3. Abre `http://localhost:3000`
4. ¡Comienza a editar!

---

**¿Preguntas?** Consulta:
- `README.md` - Guía general
- `ESTRUCTURA.md` - Explicación de carpetas
- `GUIA_RAPIDA.md` - Cambios comunes
