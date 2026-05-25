# ⚡ Guía Rápida - Editando SEMILLERO 4.0

## Cambios más comunes y dónde hacerlos

### 🎨 Cambiar colores
**Archivo**: `src/data/colors.js`
```javascript
export const C = {
  orange: "#e57224",      // ← Cambiar aquí
  purple: "#7c3aed",      // ← Cambiar aquí
  // ... resto de colores
};
```
**Impacto**: Se aplica automáticamente a toda la aplicación

---

### 📝 Agregar un nuevo área de investigación
**Archivo**: `src/data/areas.js`
```javascript
export const areas = [
  // ... áreas existentes
  { 
    name: "Mi Nueva Área", 
    icon: "★", 
    shape: "torus",  // torus, ico, octa, dodeca, cone, tetra
    color: 0x7c3aed,  // color en hexadecimal
    desc: "Descripción de la nueva área..." 
  },
];
```
**Impacto**: Aparece automáticamente en la sección de Áreas

---

### 🎯 Agregar un nuevo proyecto
**Archivo**: `src/data/projects.js`
```javascript
import { C } from "./colors";

export const projects = [
  // ... proyectos existentes
  { 
    title: "Mi Nuevo Proyecto", 
    tag: "Mi Etiqueta",
    color: C.orange,
    link: "https://github.com/...",
    desc: "Descripción del proyecto..." 
  },
];
```
**Impacto**: Aparece en la sección de Proyectos

---

### 📚 Agregar una publicación
**Archivo**: `src/data/publications.js`
```javascript
export const publications = [
  // ... publicaciones existentes
  { 
    type: "Congreso IEEE",
    title: "Título de la publicación",
    authors: "Autor1, Autor2, Autor3",
    link: "https://..." 
  },
];
```
**Impacto**: Aparece en la sección de Publicaciones

---

### 👥 Actualizar miembros
**Archivo**: `src/data/members.js`
```javascript
export const members = [
  "Nuevo Miembro",
  "Otro Miembro (Rol)",
  // ... más miembros
];
```
**Impacto**: Se muestran en la sección Acerca de

---

### 📊 Cambiar estadísticas
**Archivo**: `src/data/stats.js`
```javascript
export const stats = [
  { label: "Integrantes", value: 20, suffix: "+" },  // ← Cambiar value
  { label: "Proyectos", value: 25, suffix: "+" },    // ← Cambiar value
  // ... más estadísticas
];
```
**Impacto**: Se actualiza la barra de estadísticas

---

### 🎬 Editar sección completa
Para cambiar estilos o estructura de una sección:
- `src/components/HeroSection.jsx` - Hero principal
- `src/components/AreasSection.jsx` - Áreas
- `src/components/ProjectsSection.jsx` - Proyectos
- `src/components/AboutSection.jsx` - Acerca de
- `src/components/ContactSection.jsx` - Contacto

---

### 🎨 Cambiar estilos globales
**Archivo**: `src/styles/globals.css`
- Tipografía
- Animaciones
- Media queries
- Variables globales

---

### 🌐 Cambiar texto del navbar
**Archivo**: `src/components/Navbar.jsx`
```javascript
const links = ["Inicio", "Acerca", "Proyectos", "Publicaciones", "Contacto"];
// Editar los textos aquí
```

---

## 📱 Estructura de carpetas rápida

```
src/
├── data/          ← Datos estáticos (editar aquí primero)
├── components/    ← Componentes visuales
├── hooks/         ← Lógica reutilizable
├── styles/        ← CSS global
├── main.jsx       ← Punto de entrada
└── App.jsx        ← Componente raíz
```

---

## 🚀 Comandos principales

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de build
npm run preview
```

---

## ✅ Checklist de edición

Antes de publicar cambios:
- [ ] Verificar que los colores se actualicen globalmente
- [ ] Testear en móvil (responsive)
- [ ] Verificar que las imágenes/links funcionen
- [ ] Revisar ortografía y acentos
- [ ] Probar navegación entre secciones
- [ ] Verificar que Three.js no tenga errores en consola

---

## 💡 Tips útiles

1. **Buscar en archivos**: Usa Ctrl+Shift+F para buscar en todo el proyecto
2. **Color picker**: Los colores en `colors.js` son hexadecimales
3. **Responsive**: Cambios en `globals.css` afectan media queries
4. **Componentes**: Cada componente es independiente
5. **Datos**: Siempre importa desde `src/data/` para consistencia

---

## 🐛 Si algo no funciona

1. Verificar consola de navegador (F12)
2. Buscar errores de import/export
3. Verificar que las rutas de archivos sean correctas
4. Reiniciar servidor dev (`npm run dev`)

---

¡Listo! Ahora puedes editar el proyecto fácilmente. 🎉
