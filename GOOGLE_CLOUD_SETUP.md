# 🔐 Guía Detallada: Google Cloud Console Setup

Esta guía te llevará paso a paso por la configuración completa de Google Cloud Console para Pet History.

**Tiempo estimado**: 20-25 minutos  
**Cuenta necesaria**: silvana.trabalon@gmail.com

---

## 📋 Índice

1. [Crear Proyecto](#1-crear-proyecto)
2. [Habilitar APIs](#2-habilitar-apis)
3. [Configurar OAuth Consent Screen](#3-configurar-oauth-consent-screen)
4. [Crear OAuth Client ID](#4-crear-oauth-client-id)
5. [Verificación Final](#5-verificación-final)

---

## 1. Crear Proyecto

### Paso 1.1: Acceder a Google Cloud Console

1. Abre tu navegador
2. Ve a: **https://console.cloud.google.com/**
3. Inicia sesión con: **silvana.trabalon@gmail.com**
4. Si es tu primera vez, acepta los términos de servicio

### Paso 1.2: Abrir el selector de proyectos

En la barra superior verás algo como:

```
┌─────────────────────────────────────────┐
│ Google Cloud  [▼ Seleccionar proyecto] │
└─────────────────────────────────────────┘
```

Haz clic en **"Seleccionar proyecto"** (o el nombre del proyecto actual)

### Paso 1.3: Crear nuevo proyecto

En el modal que se abre:

```
┌─────────────────────────────────────────┐
│  Seleccionar proyecto                   │
├─────────────────────────────────────────┤
│  [🔍 Buscar]                            │
│                                         │
│  Proyectos recientes:                   │
│  - Mi Proyecto 1                        │
│  - Mi Proyecto 2                        │
│                                         │
│  [+ PROYECTO NUEVO]  ← CLIC AQUÍ       │
└─────────────────────────────────────────┘
```

### Paso 1.4: Configurar el proyecto

En el formulario "Proyecto nuevo":

```
┌─────────────────────────────────────────┐
│  Proyecto nuevo                         │
├─────────────────────────────────────────┤
│  Nombre del proyecto *                  │
│  [Pet History              ]            │
│                                         │
│  Organización                           │
│  [Sin organización        ▼]            │
│                                         │
│  Ubicación                              │
│  [Sin organización        ▼]            │
│                                         │
│  ID del proyecto                        │
│  pet-history-123456 (generado auto)     │
│                                         │
│           [CANCELAR]  [CREAR] ← CLIC    │
└─────────────────────────────────────────┘
```

- **Nombre**: `Pet History`
- **Organización**: Dejar en "Sin organización"
- **ID**: Se genera automáticamente (no importa)

Clic en **CREAR**

### Paso 1.5: Esperar creación

Verás una notificación de progreso:

```
🔔 Creando proyecto "Pet History"...
```

Espera 10-15 segundos. Cuando esté listo:

```
✅ Proyecto "Pet History" creado
```

### Paso 1.6: Verificar proyecto seleccionado

En la barra superior deberías ver ahora:

```
Google Cloud  [▼ Pet History]
```

Si no lo ves, abre el selector de proyectos y selecciónalo.

✅ **Checkpoint**: Proyecto creado y seleccionado

---

## 2. Habilitar APIs

### Paso 2.1: Ir a la Biblioteca de APIs

Opción A - Desde el menú:
```
☰ Menú hamburguesa (arriba izquierda)
└─ APIs y servicios
   └─ Biblioteca  ← CLIC AQUÍ
```

Opción B - URL directa:
```
https://console.cloud.google.com/apis/library?project=YOUR_PROJECT_ID
```

### Paso 2.2: Buscar Google Sheets API

En la página de biblioteca verás:

```
┌─────────────────────────────────────────┐
│  🔍 [Buscar APIs y servicios]           │
└─────────────────────────────────────────┘
```

Escribe: **Google Sheets API**

### Paso 2.3: Seleccionar Google Sheets API

En los resultados:

```
┌─────────────────────────────────────────┐
│  📊 Google Sheets API                   │
│     Almacena y colabora con hojas...    │
│     Google                              │
└─────────────────────────────────────────┘
```

Clic en **"Google Sheets API"**

### Paso 2.4: Habilitar Google Sheets API

En la página de la API:

```
┌─────────────────────────────────────────┐
│  Google Sheets API                      │
├─────────────────────────────────────────┤
│                                         │
│  [        HABILITAR         ] ← CLIC    │
│                                         │
│  Descripción:                           │
│  Lee, escribe y da formato a hojas...   │
└─────────────────────────────────────────┘
```

Clic en el botón azul **"HABILITAR"**

Espera 5-10 segundos mientras se habilita.

Verás:

```
✅ API habilitada
```

### Paso 2.5: Volver a la Biblioteca

Clic en **"Biblioteca"** en el menú lateral para buscar la siguiente API.

### Paso 2.6: Buscar Google Drive API

En el buscador, escribe: **Google Drive API**

### Paso 2.7: Seleccionar Google Drive API

En los resultados:

```
┌─────────────────────────────────────────┐
│  📁 Google Drive API                    │
│     API de Google Drive v3              │
│     Google                              │
└─────────────────────────────────────────┘
```

Clic en **"Google Drive API"**

### Paso 2.8: Habilitar Google Drive API

Igual que antes, clic en el botón **"HABILITAR"**

Espera a que se habilite.

### Paso 2.9: Verificar APIs habilitadas

Ve a: **APIs y servicios** → **Panel**

Deberías ver:

```
APIs habilitadas
├─ Google Sheets API ✅
└─ Google Drive API ✅
```

✅ **Checkpoint**: Ambas APIs habilitadas

---

## 3. Configurar OAuth Consent Screen

### Paso 3.1: Ir a Pantalla de consentimiento

```
☰ Menú
└─ APIs y servicios
   └─ Pantalla de consentimiento de OAuth  ← CLIC
```

O URL directa:
```
https://console.cloud.google.com/apis/credentials/consent
```

### Paso 3.2: Seleccionar tipo de usuario

Si es la primera vez, verás:

```
┌─────────────────────────────────────────┐
│  Tipo de usuario                        │
├─────────────────────────────────────────┤
│                                         │
│  ⚪ Interno                             │
│     Solo para usuarios de tu org.       │
│                                         │
│  ⚫ Externo  ← SELECCIONAR ESTE         │
│     Disponible para cualquier usuario   │
│     con cuenta de Google                │
│                                         │
│              [CREAR] ← CLIC             │
└─────────────────────────────────────────┘
```

Selecciona **"Externo"** y clic en **"CREAR"**

### Paso 3.3: Paso 1 - Información de la aplicación

Completa el formulario:

```
┌─────────────────────────────────────────┐
│  Editar registro de app                 │
│  Paso 1: Información de la app          │
├─────────────────────────────────────────┤
│                                         │
│  Nombre de la aplicación *              │
│  [Pet History              ]            │
│                                         │
│  Correo electrónico de asistencia *     │
│  [silvana.trabalon@gmail.com]           │
│                                         │
│  Logo de la aplicación                  │
│  [    Subir logo    ] (OPCIONAL)        │
│                                         │
│  Dominios de la aplicación              │
│  ├─ Página principal de la aplicación   │
│  │  [                  ] (OPCIONAL)     │
│  ├─ Política de privacidad              │
│  │  [                  ] (OPCIONAL)     │
│  └─ Condiciones de servicio             │
│     [                  ] (OPCIONAL)     │
│                                         │
│  Dominios autorizados                   │
│  [                    ] (DEJAR VACÍO)   │
│                                         │
│  Información de contacto del            │
│  desarrollador *                        │
│  [silvana.trabalon@gmail.com]           │
│                                         │
│  [CANCELAR]  [GUARDAR Y CONTINUAR] ←   │
└─────────────────────────────────────────┘
```

**Campos obligatorios:**
- ✅ Nombre: `Pet History`
- ✅ Email de asistencia: `silvana.trabalon@gmail.com`
- ✅ Email del desarrollador: `silvana.trabalon@gmail.com`

Los demás campos son opcionales.

Clic en **"GUARDAR Y CONTINUAR"**

### Paso 3.4: Paso 2 - Alcances

```
┌─────────────────────────────────────────┐
│  Paso 2: Alcances                       │
├─────────────────────────────────────────┤
│                                         │
│  Alcances no sensibles agregados        │
│  automáticamente:                       │
│  - email, profile, openid               │
│                                         │
│  [  AGREGAR O QUITAR ALCANCES  ] ← CLIC│
└─────────────────────────────────────────┘
```

Clic en **"AGREGAR O QUITAR ALCANCES"**

### Paso 3.5: Seleccionar alcances

Se abre un modal con una lista de alcances:

```
┌─────────────────────────────────────────┐
│  Actualizar alcances seleccionados      │
├─────────────────────────────────────────┤
│  🔍 [Filtrar]                           │
│                                         │
│  ☐ https://www.googleapis.com/auth/... │
│  ☐ https://www.googleapis.com/auth/... │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Buscar: spreadsheets            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ☐ .../auth/spreadsheets.readonly      │
│  ☑ .../auth/spreadsheets  ← MARCAR     │
│                                         │
└─────────────────────────────────────────┘
```

**Alcance 1: Google Sheets**

1. En el filtro, busca: `spreadsheets`
2. Marca la casilla: `https://www.googleapis.com/auth/spreadsheets`
3. Descripción: "Ver, editar, crear y eliminar todas tus hojas de cálculo"

**Alcance 2: Google Drive**

1. Borra el filtro y busca: `drive.file`
2. Marca la casilla: `https://www.googleapis.com/auth/drive.file`
3. Descripción: "Ver y administrar archivos de Google Drive que se abrieron o crearon con esta app"

**Alcance 3: Email del Usuario**

1. Borra el filtro y busca: `userinfo.email`
2. Marca la casilla: `https://www.googleapis.com/auth/userinfo.email`
3. Descripción: "Ver tu dirección de correo electrónico principal de Google"

**Alcance 4: Perfil del Usuario**

1. Borra el filtro y busca: `userinfo.profile`
2. Marca la casilla: `https://www.googleapis.com/auth/userinfo.profile`
3. Descripción: "Ver tu información personal, incluida la que hayas hecho pública"

### Paso 3.6: Guardar alcances

```
┌─────────────────────────────────────────┐
│  Alcances seleccionados: 4              │
│                                         │
│  ✅ .../auth/spreadsheets               │
│  ✅ .../auth/drive.file                 │
│  ✅ .../auth/userinfo.email             │
│  ✅ .../auth/userinfo.profile           │
│                                         │
│           [CANCELAR]  [ACTUALIZAR] ←    │
└─────────────────────────────────────────┘
```

Clic en **"ACTUALIZAR"**

Vuelves a la pantalla anterior. Ahora clic en **"GUARDAR Y CONTINUAR"**

### Paso 3.7: Paso 3 - Usuarios de prueba

```
┌─────────────────────────────────────────┐
│  Paso 3: Usuarios de prueba             │
├─────────────────────────────────────────┤
│                                         │
│  Mientras tu app esté en pruebas, solo  │
│  los usuarios de prueba pueden acceder. │
│                                         │
│  [   + AGREGAR USUARIOS   ] ← CLIC      │
│                                         │
│  Usuarios de prueba:                    │
│  (ninguno)                              │
└─────────────────────────────────────────┘
```

Clic en **"+ AGREGAR USUARIOS"**

### Paso 3.8: Agregar email de prueba

Modal para agregar usuarios:

```
┌─────────────────────────────────────────┐
│  Agregar usuarios                       │
├─────────────────────────────────────────┤
│                                         │
│  [silvana.trabalon@gmail.com]           │
│  ↑ Escribe y presiona ENTER             │
│                                         │
│  Usuarios agregados:                    │
│  • silvana.trabalon@gmail.com ✓         │
│                                         │
│              [CANCELAR]  [AGREGAR] ←    │
└─────────────────────────────────────────┘
```

1. Escribe: `silvana.trabalon@gmail.com`
2. Presiona **Enter**
3. Verás el email listado abajo
4. Clic en **"AGREGAR"**

Ahora clic en **"GUARDAR Y CONTINUAR"**

### Paso 3.9: Paso 4 - Resumen

```
┌─────────────────────────────────────────┐
│  Paso 4: Resumen                        │
├─────────────────────────────────────────┤
│                                         │
│  ✅ Nombre: Pet History                 │
│  ✅ Email: silvana.trabalon@gmail.com   │
│  ✅ Alcances: 2 agregados               │
│  ✅ Usuarios de prueba: 1               │
│                                         │
│  [  VOLVER AL PANEL  ] ← CLIC           │
└─────────────────────────────────────────┘
```

Revisa que todo esté correcto y clic en **"VOLVER AL PANEL"**

✅ **Checkpoint**: Pantalla de consentimiento configurada

---

## 4. Crear OAuth Client ID

### Paso 4.1: Ir a Credenciales

```
☰ Menú
└─ APIs y servicios
   └─ Credenciales  ← CLIC
```

O URL directa:
```
https://console.cloud.google.com/apis/credentials
```

### Paso 4.2: Crear credenciales

En la página de credenciales:

```
┌─────────────────────────────────────────┐
│  Credenciales                           │
├─────────────────────────────────────────┤
│                                         │
│  [+ CREAR CREDENCIALES ▼] ← CLIC       │
│                                         │
│  IDs de cliente de OAuth 2.0            │
│  (ninguno)                              │
└─────────────────────────────────────────┘
```

Clic en **"+ CREAR CREDENCIALES"**

### Paso 4.3: Seleccionar tipo

En el menú desplegable:

```
┌─────────────────────────────────────────┐
│  • Clave de API                         │
│  • ID de cliente de OAuth 2.0  ← CLIC  │
│  • Cuenta de servicio                   │
└─────────────────────────────────────────┘
```

Selecciona **"ID de cliente de OAuth 2.0"**

### Paso 4.4: Configurar cliente OAuth

Formulario de configuración:

```
┌─────────────────────────────────────────┐
│  Crear ID de cliente de OAuth          │
├─────────────────────────────────────────┤
│                                         │
│  Tipo de aplicación *                   │
│  [Aplicación web         ▼] ← ESTE     │
│                                         │
│  Nombre *                               │
│  [Pet History Web Client]               │
│                                         │
│  URIs de redireccionamiento autorizados │
│  [+ Agregar URI]  ← CLIC AQUÍ           │
│  • http://localhost:3000                │
│                                         │
│  Orígenes de JavaScript autorizados     │
│  [+ Agregar URI]  ← CLIC AQUÍ           │
│  • http://localhost:3000                │
│                                         │
│              [CANCELAR]  [CREAR] ←      │
└─────────────────────────────────────────┘
```

**Completa:**

1. **Tipo**: `Aplicación web` (debe estar seleccionado)
2. **Nombre**: `Pet History Web Client`
3. **Orígenes de JavaScript autorizados**:
   - Clic en "+ Agregar URI"
   - Escribe: `http://localhost:3000`
4. **URIs de redireccionamiento autorizados**:
   - Clic en "+ Agregar URI"
   - Escribe: `http://localhost:3000`

Clic en **"CREAR"**

### Paso 4.5: Copiar Client ID

Aparece un modal con tus credenciales:

```
┌─────────────────────────────────────────┐
│  Cliente de OAuth creado                │
├─────────────────────────────────────────┤
│                                         │
│  Se creó tu ID de cliente.              │
│                                         │
│  Tu ID de cliente                       │
│  ┌───────────────────────────────────┐ │
│  │ 123456789012-abc...xyz.apps.      │ │
│  │ googleusercontent.com             │ │
│  │                        [📋 Copiar]│ │
│  └───────────────────────────────────┘ │
│                                         │
│  Tu secreto de cliente                  │
│  ┌───────────────────────────────────┐ │
│  │ GOCSPX-abc123...                  │ │
│  │                        [📋 Copiar]│ │
│  └───────────────────────────────────┘ │
│  (No necesario para apps frontend)      │
│                                         │
│                    [ACEPTAR] ←          │
└─────────────────────────────────────────┘
```

**¡IMPORTANTE!**

1. Clic en el botón **📋 Copiar** al lado del "ID de cliente"
2. Guarda este ID en un lugar seguro (lo necesitas para el `.env`)
3. El "Secreto de cliente" NO es necesario (ignóralo)
4. Clic en **"ACEPTAR"**

### Paso 4.6: Verificar credencial creada

Ahora deberías ver:

```
┌─────────────────────────────────────────┐
│  IDs de cliente de OAuth 2.0            │
├─────────────────────────────────────────┤
│  Nombre               | Cliente ID      │
│  Pet History Web Cl...| 123456789012... │
└─────────────────────────────────────────┘
```

Si necesitas ver el Client ID de nuevo:
- Clic en "Pet History Web Client"
- El Client ID está en la parte superior

✅ **Checkpoint**: OAuth Client ID creado y copiado

---

## 5. Verificación Final

### Checklist de verificación

```
✅ Proyecto "Pet History" creado
✅ Google Sheets API habilitada
✅ Google Drive API habilitada
✅ Pantalla de consentimiento configurada
   ├─ Tipo: Externo
   ├─ Alcance: spreadsheets
   ├─ Alcance: drive.file
   ├─ Alcance: userinfo.email
   ├─ Alcance: userinfo.profile
   └─ Usuario de prueba: silvana.trabalon@gmail.com
✅ OAuth Client ID creado
   ├─ Tipo: Aplicación web
   ├─ Nombre: Pet History Web Client
   ├─ Origen: http://localhost:3000
   └─ Redirect URI: http://localhost:3000
✅ Client ID copiado y guardado
```

### Cómo verificar cada punto

#### Proyecto creado
- Barra superior muestra: **[▼ Pet History]**

#### APIs habilitadas
- Ve a: **APIs y servicios → Panel**
- Verifica que aparezcan ambas APIs en "APIs habilitadas"

#### Pantalla de consentimiento
- Ve a: **APIs y servicios → Pantalla de consentimiento de OAuth**
- Estado debe ser: "En producción" o "Prueba"
- Debe mostrar "Pet History" como nombre

#### Credenciales
- Ve a: **APIs y servicios → Credenciales**
- Debe aparecer "Pet History Web Client" en la lista

---

## 🎯 Próximo Paso

Ahora que tienes el Client ID, ve al archivo `.env` de tu proyecto y configúralo:

```env
REACT_APP_GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
```

Continúa con la configuración de Google Sheets y Drive en [QUICK_START.md](QUICK_START.md)

---

## 🆘 Problemas Comunes

### No veo el botón "Habilitar" en la API
- Verifica que tengas el proyecto "Pet History" seleccionado
- Puede que la API ya esté habilitada (verás "Administrar" en lugar de "Habilitar")

### Error al crear pantalla de consentimiento
- Asegúrate de seleccionar "Externo" como tipo de usuario
- Completa todos los campos obligatorios (*)

### No puedo agregar alcances
- Verifica que hayas completado el Paso 1 de la pantalla de consentimiento
- Los alcances solo se pueden agregar después de guardar la información básica

### Client ID no aparece
- Ve a Credenciales
- Busca en la sección "IDs de cliente de OAuth 2.0"
- Clic en el nombre para ver los detalles

---

**¡Configuración de Google Cloud completada!** ✅

Ahora tienes todo listo para usar las APIs de Google en tu aplicación.
