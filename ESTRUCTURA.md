# 📦 SEMILLERO 4.0 - Estructura del Proyecto

Bienvenido a la versión refactorizada del proyecto SEMILLERO 4.0. El código ha sido separado en módulos independientes para facilitar la edición, mantenimiento y escalabilidad.

## 📁 Estructura del Proyecto

```
SEMILLERO/
├── index.html                 # Archivo HTML principal
├── src/
│   ├── main.jsx             # Punto de entrada de React
│   ├── App.jsx              # Componente principal de la aplicación
│   │
│   ├── components/          # 📦 Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── HeroCanvas.jsx
│   │   ├── StatsBar.jsx
│   │   ├── CountUp.jsx
│   │   ├── AreasSection.jsx
│   │   ├── AreaCanvas.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── PublicationsSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── ContactSection.jsx
│   │   └── Footer.jsx
│   │
│   ├── data/                # 📊 Datos estáticos
│   │   ├── colors.js        # Paleta de colores
│   │   ├── stats.js         # Estadísticas
│   │   ├── areas.js         # Líneas de investigación
│   │   ├── projects.js      # Proyectos destacados
│   │   ├── publications.js  # Publicaciones
│   │   └── members.js       # Miembros del semillero
│   │
│   ├── hooks/               # 🪝 Hooks personalizados
│   │   └── useThreeScene.js # Hook para escenas THREE.js
│   │
│   └── styles/              # 🎨 Estilos globales
│       └── globals.css      # Estilos, animaciones y responsividad
│
├── semillero40.jsx          # Archivo original (puede eliminarse)
└── README.md                # Este archivo
```

## 🎯 Ventajas de esta estructura

✅ **Modularidad**: Cada componente está en su propio archivo  
✅ **Mantenibilidad**: Datos separados de componentes  
✅ **Escalabilidad**: Fácil de agregar nuevas funcionalidades  
✅ **Legibilidad**: Código más limpio y organizado  
✅ **Reutilización**: Componentes y hooks reutilizables  

## 🔧 Cómo editar cada sección

### 📱 Editar la Navegación
**Archivo**: `src/components/Navbar.jsx`
- Estilos del navbar
- Enlaces de navegación
- Comportamiento del menú móvil

### 🎨 Editar Colores
**Archivo**: `src/data/colors.js`
- Define aquí todos los colores del proyecto
- Cambios globales en toda la aplicación

### 📊 Editar Datos (Áreas, Proyectos, Publicaciones)
**Archivos**:
- `src/data/areas.js` - Líneas de investigación
- `src/data/projects.js` - Proyectos destacados
- `src/data/publications.js` - Publicaciones
- `src/data/members.js` - Miembros
- `src/data/stats.js` - Estadísticas

### 🎬 Editar Secciones
**Archivos**:
- `src/components/HeroSection.jsx` - Sección principal
- `src/components/AreasSection.jsx` - Áreas de investigación
- `src/components/ProjectsSection.jsx` - Proyectos
- `src/components/PublicationsSection.jsx` - Publicaciones
- `src/components/AboutSection.jsx` - Acerca de nosotros
- `src/components/ContactSection.jsx` - Formulario de contacto
- `src/components/Footer.jsx` - Pie de página

### 🎥 Editar Canvases 3D
**Archivos**:
- `src/components/HeroCanvas.jsx` - Canvas 3D del hero
- `src/components/AreaCanvas.jsx` - Canvas 3D de las áreas

### 🪝 Editar Hooks
**Archivo**: `src/hooks/useThreeScene.js`
- Lógica compartida para escenas THREE.js

### 🎨 Editar Estilos Globales
**Archivo**: `src/styles/globals.css`
- Animaciones
- Tipografía
- Variables globales de estilo
- Media queries responsive

## 🚀 Próximos pasos

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar desarrollo**:
   ```bash
   npm run dev
   ```

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

## 📝 Notas importantes

- Todos los colores se importan desde `src/data/colors.js`
- Los datos estáticos están en `src/data/`
- Los componentes en `src/components/` son reutilizables
- Los estilos globales están en `src/styles/globals.css`
- Cada componente es independiente y puede editarse sin afectar otros

## 🎓 Estructura de componentes

Cada componente sigue este patrón:

```jsx
import { C } from "../data/colors";
import { hookPersonalizado } from "../hooks/...";

export function MiComponente() {
  return (
    <div>
      {/* Contenido */}
    </div>
  );
}
```

¡Ahora es mucho más fácil mantener y editar el proyecto! 🎉
