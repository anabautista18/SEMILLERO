# 🏗️ Arquitectura del Proyecto SEMILLERO 4.0

## Flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                          index.html                             │
│                    (Punto de entrada HTML)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      src/main.jsx                               │
│                 (Inicializa React)                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       src/App.jsx                               │
│              (Componente raíz de la aplicación)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐          ┌─────────┐         ┌─────────┐
   │ DATA    │          │ HOOKS   │         │ STYLES  │
   │ (src/)  │          │ (src/)  │         │ (src/)  │
   └────┬────┘          └────┬────┘         └────┬────┘
        │                    │                    │
        │                    │                    │
   ┌────┴─────────┐     ┌────┴────────┐    ┌────┴──────────┐
   │ Actualiza    │     │  Provee     │    │   Importa     │
   │  componentes │     │  lógica     │    │   globals.css │
   │    con       │     │ compartida  │    │               │
   │   datos      │     │             │    │               │
   └────┬─────────┘     └────┬────────┘    └────┬──────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   COMPONENTES   │
                    │  (src/compon.)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌─────────┐        ┌──────────┐        ┌─────────────┐
    │ Navbar  │        │Secciones │        │  Canvases   │
    │         │        │          │        │   3D        │
    │ -Links  │        │-Hero     │        │             │
    │ -Scroll │        │-About    │        │-HeroCanvas  │
    │ -Mobile │        │-Areas    │        │-AreaCanvas  │
    │ Menu    │        │-Projects │        │             │
    │         │        │-Publi.   │        │             │
    │         │        │-Contact  │        │             │
    │         │        │-Footer   │        │             │
    └─────────┘        └──────────┘        └─────────────┘
```

## Componentes y sus responsabilidades

### 📦 Data Layer (src/data/)
Almacena todos los datos estáticos de la aplicación:
```
colors.js      → Paleta de colores (C)
stats.js       → Estadísticas (integrantes, proyectos, etc.)
areas.js       → 6 líneas de investigación
projects.js    → 8 proyectos destacados
publications.js→ 6 publicaciones científicas
members.js     → Lista de miembros del semillero
```

### 🪝 Hooks Layer (src/hooks/)
Lógica reutilizable:
```
useThreeScene.js → Maneja inicialización y animación de Three.js
```

### 🎨 Components Layer (src/components/)

**Componentes de Disposición:**
- `Navbar.jsx` → Navegación y menú
- `Footer.jsx` → Pie de página

**Componentes de Secciones:**
- `HeroSection.jsx` → Sección principal con llamada a la acción
- `StatsBar.jsx` → Barra de estadísticas con contadores
- `AreasSection.jsx` → Grid de 6 áreas de investigación
- `ProjectsSection.jsx` → Grid de proyectos destacados
- `PublicationsSection.jsx` → Lista de publicaciones
- `AboutSection.jsx` → Sección Acerca de (Misión, Visión, Miembros)
- `ContactSection.jsx` → Formulario de contacto

**Componentes 3D:**
- `HeroCanvas.jsx` → Canvas 3D interactivo del hero (Torus + satélites)
- `AreaCanvas.jsx` → Canvas 3D para cada área (formas geométricas)

**Componentes Utilidad:**
- `CountUp.jsx` → Contador animado con Intersection Observer

## 🔄 Flujo de datos entre componentes

```
App.jsx
  ├─ Navbar (active, setActive)
  ├─ HeroSection (setActive)
  │   └─ HeroCanvas (visual)
  ├─ StatsBar
  │   └─ CountUp (stats.value)
  ├─ AboutSection (members data)
  ├─ AreasSection (areas data)
  │   └─ AreaCanvas (color, shape) x6
  ├─ ProjectsSection (projects data)
  ├─ PublicationsSection (publications data)
  ├─ ContactSection (form state)
  └─ Footer
```

## 📊 Flujo de importaciones

```
App.jsx
├─ Importa: '../styles/globals.css'
├─ Importa: '../data/colors'
├─ Importa: todos los componentes de './components'
│
Components
├─ Importan: '../data/colors' (siempre)
├─ Importan: '../data/{data_name}' (según necesidad)
├─ Importan: '../hooks/{hook_name}' (si usan hooks)
└─ Importan: otros componentes (reutilización)

Data
├─ colors.js importa: ninguno (punto de partida)
└─ projects.js importa: './colors' (para referencias de color)

Hooks
└─ useThreeScene.js importa: 'react', 'three'

Styles
└─ globals.css no importa JS (CSS puro)
```

## 🎯 Cómo agregar una nueva sección

1. **Crear datos** en `src/data/nueva-seccion.js`
2. **Crear componente** en `src/components/NuevaSeccion.jsx`
3. **Importar en App.jsx** y agregar en el render

Ejemplo:
```jsx
// 1. src/data/testimonials.js
export const testimonios = [...]

// 2. src/components/TestimonialsSection.jsx
import { testimonios } from "../data/testimonials"
export function TestimonialsSection() { ... }

// 3. src/App.jsx
import { TestimonialsSection } from "./components/TestimonialsSection"
// ... agregar en el render
<TestimonialsSection />
```

## 🎨 Personalización rápida

| Para cambiar... | Editar archivo... | Notas |
|---|---|---|
| Colores globales | `src/data/colors.js` | Se aplica a todo |
| Áreas de investigación | `src/data/areas.js` | Agregar/eliminar items |
| Proyectos | `src/data/projects.js` | Actualizar links y descripciones |
| Estilos globales | `src/styles/globals.css` | Fuentes, animaciones |
| Animación 3D Hero | `src/components/HeroCanvas.jsx` | Geometría y posiciones |
| Layout de secciones | `src/components/*Section.jsx` | Grid, padding, etc. |
| Datos de miembros | `src/data/members.js` | Nombres y roles |

Este diseño modular facilita la colaboración en equipo y la escalabilidad del proyecto. 🚀
