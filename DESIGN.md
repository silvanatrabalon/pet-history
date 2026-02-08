# 📸 Pet History - Capturas y Flujos

## 🎨 Flujo de Navegación

```
┌─────────────┐
│   /login    │  ◄─── Pantalla inicial (si no está autenticado)
└──────┬──────┘
       │ Login con Google
       ▼
┌─────────────┐
│   /pets     │  ◄─── Listado de mascotas
└──────┬──────┘
       │
       ├──► /pets/new  ◄─── Agregar nueva mascota
       │
       └──► /pets/:id  ◄─── Ver detalle de mascota
              │
              └──► /pets/:id/add-history  ◄─── Agregar registro médico
```

---

## 📱 Wireframes Conceptuales

### 1. Pantalla de Login

```
┌─────────────────────────────┐
│                             │
│          🐾                 │
│                             │
│      Pet History            │
│                             │
│  Historial clínico de       │
│    tus mascotas             │
│                             │
│  ┌─────────────────────┐   │
│  │ Iniciar con Google  │   │
│  └─────────────────────┘   │
│                             │
│  📋 Registra visitas        │
│  📸 Adjunta imágenes        │
│  📱 Accede desde cualquier  │
│                             │
└─────────────────────────────┘
```

### 2. Lista de Mascotas

```
┌─────────────────────────────┐
│ Mis Mascotas    [Salir]     │
│ silvana.trabalon@gmail.com  │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │ 🅛  Luna             │   │
│  │    Perro • Golden    │   │
│  │    🎂 3 años ♀       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ 🅜  Max              │   │
│  │    Gato • Siamés     │   │
│  │    🎂 2 años ♂       │   │
│  └─────────────────────┘   │
│                             │
│           ...               │
│                             │
│     [+ Agregar Mascota]     │
│                             │
└─────────────────────────────┘
```

### 3. Detalle de Mascota

```
┌─────────────────────────────┐
│ [← Volver]          [🔗]    │
├─────────────────────────────┤
│                             │
│          🅛                 │
│         Luna                │
│                             │
│  Especie:    Perro          │
│  Raza:       Golden         │
│  Edad:       3 años         │
│  Sexo:       Hembra         │
│                             │
├─────────────────────────────┤
│                             │
│  Historial Médico (3)       │
│                             │
│  ┌─────────────────────┐   │
│  │ 8 DE FEBRERO 2026   │   │
│  │ Control anual       │   │
│  │ ⚖️ Peso: 25.5 kg    │   │
│  │ 📸 2 imágenes       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ 15 DE ENERO 2026    │   │
│  │ Vacunación          │   │
│  └─────────────────────┘   │
│                             │
│  [+ Agregar Registro]       │
│                             │
└─────────────────────────────┘
```

### 4. Nuevo Registro Médico

```
┌─────────────────────────────┐
│ [← Volver]                  │
│  Nuevo Registro             │
│       Luna                  │
├─────────────────────────────┤
│                             │
│  Fecha *                    │
│  [2026-02-08        ]       │
│                             │
│  Diagnóstico *              │
│  [Control anual - Todo  ]   │
│  [normal. Vacunas al día]   │
│                             │
│  Peso (kg)                  │
│  [25.5              ]       │
│                             │
│  Medicación                 │
│  [Vacuna antirrábica    ]   │
│  [anual                 ]   │
│                             │
│  Imágenes (Máx. 5)          │
│  ┌───┐ ┌───┐               │
│  │ ✓ │ │ ✓ │  [+ Agregar]  │
│  └───┘ └───┘               │
│                             │
│  [    Guardar Registro   ]  │
│  [      Cancelar         ]  │
│                             │
└─────────────────────────────┘
```

---

## 🎯 Interacciones Principales

### Agregar Mascota
1. Click en botón flotante "+ Agregar Mascota"
2. Completar formulario
3. Click en "Guardar Mascota"
4. Se guarda en Google Sheets
5. Redirección a lista de mascotas

### Ver Historial
1. Click en card de mascota
2. Ver perfil y lista de registros médicos
3. Registros ordenados por fecha (más reciente primero)

### Agregar Registro con Imágenes
1. Desde detalle de mascota → "+ Agregar Registro"
2. Completar datos del registro
3. Seleccionar imágenes (opcional)
4. Click en "Guardar Registro"
5. Subida de imágenes a Google Drive
6. Guardado de registro en Google Sheets
7. Redirección a detalle de mascota

### Compartir Historial
1. Desde detalle de mascota → botón 🔗
2. Si el dispositivo soporta Web Share API:
   - Se abre el menú nativo de compartir
3. Si no:
   - Se copia el link al portapapeles
   - Se muestra mensaje de confirmación

---

## 🎨 Paleta de Colores

### Colores Principales
- **Primary**: `#4F46E5` (Índigo)
- **Primary Dark**: `#4338CA`
- **Secondary**: `#7C3AED` (Púrpura)

### Colores de Texto
- **Heading**: `#111827` (Gris muy oscuro)
- **Body**: `#374151` (Gris oscuro)
- **Muted**: `#6B7280` (Gris medio)
- **Light**: `#9CA3AF` (Gris claro)

### Colores de Estado
- **Success**: `#10B981` (Verde)
- **Error**: `#EF4444` (Rojo)
- **Warning**: `#F59E0B` (Amarillo)
- **Info**: `#3B82F6` (Azul)

### Colores de Fondo
- **Page**: `#F9FAFB` (Gris muy claro)
- **Card**: `#FFFFFF` (Blanco)
- **Input**: `#FFFFFF` (Blanco)
- **Border**: `#E5E7EB` (Gris borde)

### Gradientes
- **Hero**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Button**: `linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)`

---

## 📐 Sistema de Espaciado

```
4px   - Micro
8px   - Extra Small
12px  - Small
16px  - Medium (base)
20px  - Large
24px  - Extra Large
32px  - XXL
40px  - XXXL
```

---

## 🔤 Tipografía

### Font Family
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 
'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
sans-serif
```

### Font Sizes
- **Base**: 16px (móvil) / 15px (desktop)
- **Small**: 12-14px
- **Medium**: 16-18px
- **Large**: 20-24px
- **XLarge**: 28-32px
- **Hero**: 32-36px

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

---

## 📊 Métricas de Diseño Mobile-First

### Touch Targets
- **Mínimo**: 48x48px
- **Botones principales**: 56px altura
- **Inputs**: 48px altura

### Espaciado
- **Padding contenedor**: 20px
- **Gap entre cards**: 16px
- **Margin interno**: 12-16px

### Border Radius
- **Botones**: 8px
- **Cards**: 12px
- **Inputs**: 8px
- **Avatares**: 50% (circular)

---

## 🚀 Performance

### Optimizaciones Implementadas
- Lazy loading de componentes
- Memoización de contextos
- Debounce en búsquedas (futuro)
- Compresión de imágenes antes de subir (recomendado)

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90

---

## ♿ Accesibilidad

### Implementado
- Labels en todos los inputs
- Alt text en imágenes
- Focus visible en elementos interactivos
- Contraste de color WCAG AA compliant
- Botones con texto descriptivo

### A Mejorar (futuro)
- ARIA labels más descriptivos
- Skip links
- Keyboard navigation completa
- Screen reader testing

---

## 📱 Soporte de Navegadores

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+
- ✅ Samsung Internet 13+

---

## 🎭 Estados de la UI

### Loading States
- Spinner animado
- Mensajes descriptivos ("Cargando mascotas...", "Subiendo imágenes...")
- Overlay para operaciones críticas

### Error States
- Mensajes de error claros
- Botón "Reintentar" cuando aplica
- Iconos visuales (⚠️)

### Empty States
- Iconos grandes y amigables
- Mensaje principal
- Mensaje secundario con acción sugerida

### Success States
- Redirección automática
- Logs en consola
- Actualización inmediata de la UI

---

Esta guía visual complementa el README y te da una idea clara de cómo se ve y funciona la aplicación. 🎨
