# 🐾 Pet History - Historial Clínico de Mascotas

App web mobile-first para el trackeo de visitas médicas e historial clínico de mascotas, usando Google Sheets como base de datos y Google Drive para almacenar imágenes.

## 📋 Índice

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Configuración Inicial](#configuración-inicial)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## ✨ Características

- 📱 **Mobile-first**: Diseñada para uso desde celular
- 🔐 **Autenticación con Google**: Login seguro con OAuth 2.0
- 🐶 **Múltiples mascotas**: Gestiona varias mascotas en una sola cuenta
- 📋 **Historial médico**: Registra visitas, controles, intervenciones y estudios
- 📸 **Imágenes**: Sube y visualiza imágenes adjuntas a cada registro
- 🔗 **Compartible**: Comparte el historial de cada mascota
- ☁️ **Cloud-based**: Datos en Google Sheets, imágenes en Google Drive
- 🚀 **Sin servidor**: No requiere backend propio

---

## 🛠 Tecnologías

- **React 18** - Framework frontend
- **React Router v6** - Navegación
- **Google Sheets API v4** - Base de datos
- **Google Drive API v3** - Almacenamiento de imágenes
- **Google Identity Services** - Autenticación OAuth 2.0
- **CSS puro** - Estilos mobile-first

---

## 🏗 Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   React     │─────▶│ Google Auth  │─────▶│   Google     │
│     App     │      │   (OAuth)    │      │   Account    │
└─────────────┘      └──────────────┘      └──────────────┘
       │                                            │
       │                                            │
       ▼                                            ▼
┌─────────────┐                            ┌──────────────┐
│   Context   │                            │    Google    │
│     API     │                            │   Sheets     │
└─────────────┘                            │   (Pets +    │
       │                                   │   History)   │
       │                                   └──────────────┘
       ▼                                            ▲
┌─────────────┐                                    │
│  Services   │────────────────────────────────────┘
│  - Sheets   │
│  - Drive    │───────────────────────────────┐
│  - Auth     │                               │
└─────────────┘                               ▼
                                      ┌──────────────┐
                                      │   Google     │
                                      │    Drive     │
                                      │  (Images)    │
                                      └──────────────┘
```

---

## ⚙️ Configuración Inicial

### 1️⃣ Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto:
   - Nombre: `Pet History`
   - ID del proyecto: Anota el ID generado

### 2️⃣ Habilitar APIs necesarias

1. En el menú lateral: **APIs y servicios** → **Biblioteca**
2. Busca y habilita:
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**

### 3️⃣ Configurar OAuth 2.0

#### Pantalla de consentimiento OAuth

1. Ve a **APIs y servicios** → **Pantalla de consentimiento de OAuth**
2. Selecciona **Externo** y haz clic en **Crear**
3. Completa el formulario:
   - **Nombre de la aplicación**: `Pet History`
   - **Correo de soporte**: `silvana.trabalon@gmail.com`
   - **Logo** (opcional): Puedes agregar uno después
   - **Dominios autorizados**: Agregar el dominio donde alojarás la app (si aplica)
   - **Correo de contacto**: `silvana.trabalon@gmail.com`
4. Haz clic en **Guardar y continuar**

#### Alcances (Scopes)

1. En la siguiente pantalla, haz clic en **Agregar o quitar alcances**
2. Busca y selecciona:
   - ✅ `https://www.googleapis.com/auth/spreadsheets` (Sheets)
   - ✅ `https://www.googleapis.com/auth/drive.file` (Drive)
3. Haz clic en **Actualizar** y luego **Guardar y continuar**

#### Usuarios de prueba (modo desarrollo)

1. En la siguiente pantalla, agrega tu correo como usuario de prueba:
   - `silvana.trabalon@gmail.com`
2. Haz clic en **Guardar y continuar**

#### Crear credenciales OAuth

1. Ve a **APIs y servicios** → **Credenciales**
2. Haz clic en **Crear credenciales** → **ID de cliente de OAuth 2.0**
3. Selecciona **Aplicación web**
4. Configura:
   - **Nombre**: `Pet History Web Client`
   - **Orígenes autorizados de JavaScript**:
     - `http://localhost:3000` (para desarrollo)
     - Tu dominio de producción (ej: `https://tu-app.com`)
   - **URI de redireccionamiento autorizados**:
     - `http://localhost:3000` (para desarrollo)
     - Tu dominio de producción (ej: `https://tu-app.com`)
5. Haz clic en **Crear**
6. **¡IMPORTANTE!** Copia el **ID de cliente** que se muestra

### 4️⃣ Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: `Pet History Database`
4. Crea dos hojas (pestañas):

#### Hoja: **Pets**
Agrega los siguientes headers en la fila 1:

```
petId | nombre | especie | raza | edad | sexo | notas | createdAt
```

#### Hoja: **MedicalHistory**
Agrega los siguientes headers en la fila 1:

```
historyId | petId | fecha | diagnostico | peso | medicacion | imageUrls | createdAt
```

5. Copia el **ID de la hoja** desde la URL:
   - URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copia el `SPREADSHEET_ID`

### 5️⃣ Crear carpeta en Google Drive

1. Ve a [Google Drive](https://drive.google.com)
2. Crea una carpeta llamada `Pet History Images`
3. Haz clic derecho en la carpeta → **Obtener enlace**
4. Cambia los permisos a **Cualquier persona con el enlace**
5. Copia el **ID de la carpeta** desde la URL:
   - URL: `https://drive.google.com/drive/folders/FOLDER_ID`
   - Copia el `FOLDER_ID`

### 6️⃣ Configurar variables de entorno

1. En la raíz del proyecto, copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` y completa con tus datos:

```env
# OAuth 2.0 Client ID (de Google Cloud Console)
REACT_APP_GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com

# Google Sheets ID (de la URL de tu hoja)
REACT_APP_SPREADSHEET_ID=tu_spreadsheet_id_aqui

# Google Drive Folder ID (de la URL de tu carpeta)
REACT_APP_DRIVE_FOLDER_ID=tu_folder_id_aqui
```

---

## 📦 Instalación

1. **Clonar o descargar el repositorio**

```bash
cd pet-history
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Sigue los pasos de [Configuración Inicial](#configuración-inicial) para crear tu archivo `.env`

4. **Iniciar la aplicación**

```bash
npm start
```

La app se abrirá en `http://localhost:3000`

---

## 🚀 Uso

### Primera vez

1. **Iniciar sesión** con tu cuenta de Google (`silvana.trabalon@gmail.com`)
2. La primera vez, Google te pedirá permisos para acceder a Sheets y Drive
3. Acepta los permisos

### Agregar mascotas

1. En la pantalla principal, haz clic en **+ Agregar Mascota**
2. Completa el formulario con los datos de tu mascota
3. Haz clic en **Guardar Mascota**

### Agregar registros médicos

1. Haz clic en una mascota para ver su perfil
2. Haz clic en **+ Agregar Registro Médico**
3. Completa los datos:
   - **Fecha** de la visita
   - **Diagnóstico** o motivo de consulta
   - **Peso** (opcional)
   - **Medicación** (opcional)
   - **Imágenes** (opcional, hasta 5)
4. Haz clic en **Guardar Registro**

### Compartir historial

1. En el perfil de una mascota, haz clic en el botón 🔗
2. Se compartirá el link o se copiará al portapapeles

---

## 📁 Estructura del Proyecto

```
pet-history/
├── public/
│   └── index.html                    # HTML base con scripts de Google
├── src/
│   ├── components/
│   │   ├── common/                   # Componentes reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   ├── Input.jsx
│   │   │   ├── Input.css
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── LoadingSpinner.css
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ErrorMessage.css
│   │   ├── pets/                     # Componentes de mascotas
│   │   │   ├── PetCard.jsx           # Card para listar mascotas
│   │   │   ├── PetCard.css
│   │   │   ├── PetForm.jsx           # Formulario nueva mascota
│   │   │   ├── PetForm.css
│   │   │   ├── PetProfile.jsx        # Perfil detallado
│   │   │   └── PetProfile.css
│   │   └── history/                  # Componentes del historial
│   │       ├── HistoryItem.jsx       # Item individual
│   │       ├── HistoryItem.css
│   │       ├── HistoryList.jsx       # Lista completa
│   │       ├── HistoryList.css
│   │       ├── HistoryForm.jsx       # Formulario nuevo registro
│   │       ├── HistoryForm.css
│   │       ├── ImageUploader.jsx     # Uploader de imágenes
│   │       └── ImageUploader.css
│   ├── pages/                        # Páginas principales
│   │   ├── Login.jsx                 # Página de login
│   │   ├── Login.css
│   │   ├── PetsList.jsx              # Listado de mascotas
│   │   ├── PetsList.css
│   │   ├── NewPet.jsx                # Agregar mascota
│   │   ├── NewPet.css
│   │   ├── PetDetail.jsx             # Detalle + historial
│   │   ├── PetDetail.css
│   │   ├── AddHistory.jsx            # Agregar registro médico
│   │   └── AddHistory.css
│   ├── services/                     # Servicios de integración
│   │   ├── googleAuth.js             # Autenticación OAuth 2.0
│   │   ├── googleSheets.js           # Operaciones con Sheets
│   │   └── googleDrive.js            # Subida de imágenes
│   ├── context/                      # Context API
│   │   ├── AuthContext.jsx           # Estado de autenticación
│   │   └── DataContext.jsx           # Estado de datos (pets + history)
│   ├── utils/                        # Utilidades
│   │   ├── constants.js              # Constantes globales
│   │   └── helpers.js                # Funciones auxiliares
│   ├── App.jsx                       # Componente principal + rutas
│   ├── App.css                       # Estilos globales
│   └── index.js                      # Entry point
├── .env                              # Variables de entorno (NO subir a Git)
├── .env.example                      # Template de .env
├── .gitignore                        # Archivos ignorados por Git
├── package.json                      # Dependencias y scripts
└── README.md                         # Esta documentación
```

---

## 🔑 Servicios Principales

### googleAuth.js

Maneja la autenticación con Google OAuth 2.0:

- `initialize()`: Inicializa Google API Client y GIS
- `login()`: Inicia el flujo de login
- `logout()`: Cierra sesión
- `getUserInfo()`: Obtiene datos del usuario autenticado

### googleSheets.js

Gestiona las operaciones con Google Sheets:

- `getPets()`: Lee todas las mascotas
- `addPet(petData)`: Agrega nueva mascota
- `getMedicalHistory()`: Lee todo el historial médico
- `getMedicalHistoryByPet(petId)`: Historial de una mascota específica
- `addMedicalRecord(recordData)`: Agrega nuevo registro médico

### googleDrive.js

Maneja la subida de imágenes a Google Drive:

- `uploadImage(file, fileName)`: Sube una imagen
- `uploadMultipleImages(files)`: Sube múltiples imágenes en paralelo
- `makeFilePublic(fileId)`: Hace un archivo públicamente visible

---

## 📱 Vistas de la Aplicación

### /login
- Login con Google OAuth 2.0

### /pets
- Listado de todas las mascotas
- Botón flotante para agregar nueva mascota

### /pets/new
- Formulario para agregar nueva mascota

### /pets/:id
- Perfil de la mascota
- Historial médico completo
- Botón para compartir
- Botón para agregar nuevo registro

### /pets/:id/add-history
- Formulario para agregar registro médico
- Uploader de imágenes

---

## 🎨 Diseño Mobile-First

Toda la app está optimizada para mobile:

- Botones con altura mínima de 48px (touch-friendly)
- Inputs grandes y espaciados
- Tipografía legible (16px base)
- Navegación con botones "Volver" claros
- FAB (Floating Action Button) para acciones principales
- Diseño adaptable que mejora en desktop

---

## 🔒 Seguridad y Privacidad

- Autenticación segura con OAuth 2.0
- Los datos solo son accesibles por el usuario autenticado
- Las imágenes se almacenan con permisos públicos (cualquiera con el link puede verlas)
- No se almacenan contraseñas en la aplicación
- El token de acceso se maneja en memoria (no en localStorage)

---

## 🐛 Troubleshooting

### Error: "Access to Google Sheets denied"
- Verifica que hayas aceptado los permisos en el login
- Asegúrate de que el `SPREADSHEET_ID` sea correcto
- Verifica que la cuenta autenticada tenga acceso a la hoja

### Error: "Failed to upload image"
- Verifica que el `DRIVE_FOLDER_ID` sea correcto
- Asegúrate de que la carpeta tenga permisos públicos
- Verifica que las APIs de Drive estén habilitadas

### No aparecen los datos
- Abre la consola del navegador (F12) y busca errores
- Verifica que las hojas tengan los headers correctos
- Usa `googleSheetsService.initializeSheets()` si es la primera vez

### La app no carga
- Verifica que todas las variables de `.env` estén configuradas
- Asegúrate de haber habilitado las APIs en Google Cloud Console
- Verifica que el Client ID de OAuth sea correcto

---

## 📈 Próximos pasos / Mejoras futuras

- [ ] Editar mascotas existentes
- [ ] Eliminar registros médicos
- [ ] Búsqueda y filtros en el historial
- [ ] Exportar historial a PDF
- [ ] Notificaciones de próximas vacunas
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Múltiples cuentas de Google

---

## 👩‍💻 Desarrollado por

**Silvana Trabalon**  
Email: silvana.trabalon@gmail.com

---

## 📄 Licencia

Este proyecto es de código abierto y puede ser usado libremente para fines personales.

---

## 🙏 Agradecimientos

Proyecto creado con ❤️ para el cuidado de nuestras mascotas.
