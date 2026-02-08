# 🚀 Guía Rápida de Inicio - Pet History

## Pasos para comenzar (5 minutos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Google Cloud (15-20 minutos)

#### A. Crear proyecto en Google Cloud Console

1. **Ir a Google Cloud Console**
   - Abre: https://console.cloud.google.com/
   - Inicia sesión con tu cuenta: `silvana.trabalon@gmail.com`

2. **Crear nuevo proyecto**
   - En la parte superior, haz clic en el selector de proyectos (al lado de "Google Cloud")
   - Clic en **"Nuevo proyecto"**
   - **Nombre del proyecto**: `Pet History`
   - **Organización**: Dejar en blanco (o tu organización si tienes una)
   - Clic en **"Crear"**
   - Espera 10-15 segundos mientras se crea el proyecto
   - Asegúrate de que el proyecto "Pet History" esté seleccionado en el selector

#### B. Habilitar APIs necesarias

1. **Ir a la Biblioteca de APIs**
   - En el menú lateral (☰), ve a: **"APIs y servicios"** → **"Biblioteca"**
   - O usa este link directo: https://console.cloud.google.com/apis/library

2. **Habilitar Google Sheets API**
   - En el buscador, escribe: `Google Sheets API`
   - Clic en **"Google Sheets API"**
   - Clic en el botón azul **"Habilitar"**
   - Espera a que se habilite (5-10 segundos)

3. **Habilitar Google Drive API**
   - Clic en **"Biblioteca"** en el menú lateral (para volver)
   - En el buscador, escribe: `Google Drive API`
   - Clic en **"Google Drive API"**
   - Clic en el botón azul **"Habilitar"**
   - Espera a que se habilite

✅ **Verificación**: Ve a "APIs y servicios" → "APIs y servicios habilitados" y confirma que ves ambas APIs listadas.

#### C. Configurar pantalla de consentimiento OAuth

1. **Ir a Pantalla de consentimiento**
   - En el menú lateral: **"APIs y servicios"** → **"Pantalla de consentimiento de OAuth"**
   - O usa: https://console.cloud.google.com/apis/credentials/consent

2. **Seleccionar tipo de usuario**
   - Selecciona **"Externo"** (permite cualquier cuenta de Google)
   - Clic en **"Crear"**

3. **Configurar la pantalla de consentimiento - Paso 1: Información de la aplicación**
   
   Completa el formulario:
   
   - **Nombre de la aplicación**: `Pet History`
   - **Correo electrónico de asistencia al usuario**: `silvana.trabalon@gmail.com`
   - **Logo de la aplicación**: (Opcional - puedes saltarlo)
   - **Dominio de la aplicación**: (Opcional - déjalo vacío por ahora)
   - **Dominios autorizados**: (Déjalo vacío por ahora)
   - **Información de contacto del desarrollador**: `silvana.trabalon@gmail.com`
   
   Clic en **"Guardar y continuar"**

4. **Paso 2: Alcances (Scopes)**
   
   - Clic en **"Agregar o quitar alcances"**
   - En el modal que se abre, busca y selecciona estos alcances:
   
   **Para Google Sheets:**
   - Busca: `spreadsheets`
   - ✅ Marca: `https://www.googleapis.com/auth/spreadsheets`
   - Descripción: "Ver, editar, crear y eliminar todas tus hojas de cálculo de Hojas de cálculo de Google"
   
   **Para Google Drive:**
   - Busca: `drive.file`
   - ✅ Marca: `https://www.googleapis.com/auth/drive.file`
   - Descripción: "Ver y administrar archivos de Google Drive que se abrieron o crearon con esta app"
   
   - Clic en **"Actualizar"**
   - Clic en **"Guardar y continuar"**

5. **Paso 3: Usuarios de prueba**
   
   - Clic en **"+ Agregar usuarios"**
   - Escribe tu email: `silvana.trabalon@gmail.com`
   - Presiona Enter y luego clic en **"Agregar"**
   - Clic en **"Guardar y continuar"**

6. **Paso 4: Resumen**
   
   - Revisa que todo esté correcto
   - Clic en **"Volver al panel"**

#### D. Crear credenciales OAuth 2.0 Client ID

1. **Ir a Credenciales**
   - En el menú lateral: **"APIs y servicios"** → **"Credenciales"**
   - O usa: https://console.cloud.google.com/apis/credentials

2. **Crear credenciales**
   - Clic en **"+ Crear credenciales"** (arriba)
   - Selecciona **"ID de cliente de OAuth 2.0"**

3. **Configurar el cliente OAuth**
   
   - **Tipo de aplicación**: Selecciona **"Aplicación web"**
   - **Nombre**: `Pet History Web Client`
   
   - **Orígenes de JavaScript autorizados**:
     - Clic en **"+ Agregar URI"**
     - Agrega: `http://localhost:3000`
     - (Si vas a deployar, después agregar tu URL de producción)
   
   - **URI de redireccionamiento autorizados**:
     - Clic en **"+ Agregar URI"**
     - Agrega: `http://localhost:3000`
     - (Si vas a deployar, después agregar tu URL de producción)
   
   - Clic en **"Crear"**

4. **Copiar el Client ID**
   
   - Aparecerá un modal con tus credenciales
   - **¡IMPORTANTE!** Copia el **"ID de cliente"** (algo como: `123456789-abc123.apps.googleusercontent.com`)
   - Puedes ignorar el "Secreto del cliente" (no lo necesitamos para aplicaciones frontend)
   - Guarda este ID en un lugar seguro (lo necesitarás para el `.env`)
   - Clic en **"Aceptar"**

✅ **Verificación**: Ve a "Credenciales" y verás tu "Pet History Web Client" listado bajo "IDs de cliente de OAuth 2.0"

#### E. Obtener el Client ID después (si lo perdiste)

Si cerraste el modal sin copiar el Client ID:

1. Ve a **"Credenciales"**
2. Busca en la sección **"IDs de cliente de OAuth 2.0"**
3. Clic en **"Pet History Web Client"**
4. Copia el **"ID de cliente"** que aparece arriba

**Formato del Client ID**: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`

---

### 📸 Ayuda Visual: Dónde encontrar cada cosa

#### 🔍 Cómo encontrar el Client ID

```
Google Cloud Console → APIs y servicios → Credenciales
├── IDs de cliente de OAuth 2.0
│   └── Pet History Web Client
│       ├── ID de cliente: 123456...xyz.apps.googleusercontent.com  ← ESTE
│       └── Secreto del cliente: (no necesario)
```

#### 🔍 Cómo extraer el Spreadsheet ID

```
URL de Google Sheet:
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
                                       ↑____________________________________________↑
                                                    ESTE ES EL SPREADSHEET_ID
```

#### 🔍 Cómo extraer el Folder ID

```
Enlace de carpeta compartida de Drive:
https://drive.google.com/drive/folders/1dyC0H8Ct2D_8FMc7vwKV7LwYXQqz8vPm?usp=sharing
                                        ↑_____________________________↑
                                                 ESTE ES EL FOLDER_ID
```

---

1. **Crear nueva hoja de cálculo**
   - Ve a: https://sheets.google.com
   - Clic en el botón **"+"** (Hoja de cálculo en blanco)
   - O usa: https://sheets.new

2. **Nombrar la hoja**
   - En la parte superior izquierda, haz clic en "Hoja de cálculo sin título"
   - Cámbiale el nombre a: `Pet History Database`
   - Presiona Enter

3. **Crear primera pestaña: "Pets"**
   - En la parte inferior, verás una pestaña que dice "Hoja 1"
   - Haz doble clic en "Hoja 1" para renombrarla
   - Cámbiale el nombre a: `Pets`
   - Presiona Enter

4. **Agregar headers a la pestaña "Pets"**
   - En la fila 1, escribe estos headers (uno por columna):
   
   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | petId | nombre | especie | raza | edad | sexo | notas | createdAt | photoUrl |
   
   - Opcional: Pon la fila 1 en **negrita** (Ctrl/Cmd + B)
   - Opcional: Congela la fila 1 (Ver → Congelar → 1 fila)
   
   **Nota**: La columna `photoUrl` (I) almacena la foto de perfil de cada mascota.

5. **Crear segunda pestaña: "MedicalHistory"**
   - En la parte inferior, clic en el botón **"+"** (al lado de la pestaña "Pets")
   - Renombra la nueva pestaña a: `MedicalHistory`

6. **Agregar headers a la pestaña "MedicalHistory"**
   - En la fila 1, escribe estos headers:
   
   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | historyId | petId | fecha | diagnostico | peso | medicacion | imageUrls | createdAt |
   
   - Opcional: Pon la fila 1 en negrita
   - Opcional: Congela la fila 1

7. **Copiar el SPREADSHEET_ID**
   - Mira la URL en la barra de direcciones
   - La URL tiene este formato:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
   ```
   - **Copia solo la parte del SPREADSHEET_ID** (entre `/d/` y `/edit`)
   - Ejemplo: Si la URL es:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   ```
   - El SPREADSHEET_ID es: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
   
   - 📝 **Guarda este ID**, lo necesitarás para el `.env`

✅ **Verificación**: Deberías tener una hoja con 2 pestañas: "Pets" y "MedicalHistory", cada una con sus respectivos headers.

### 4. Crear carpeta en Google Drive (3 minutos)

1. **Ir a Google Drive**
   - Ve a: https://drive.google.com
   - Asegúrate de estar con la cuenta: `silvana.trabalon@gmail.com`

2. **Crear nueva carpeta**
   - Clic en **"Nuevo"** (botón arriba a la izquierda)
   - Selecciona **"Nueva carpeta"**
   - Nombre: `Pet History Images`
   - Clic en **"Crear"**

3. **Configurar permisos públicos**
   - Busca la carpeta "Pet History Images" en tu Drive
   - Haz **clic derecho** sobre la carpeta
   - Selecciona **"Compartir"**
   - En el modal, clic en **"Cambiar"** (al lado de "Acceso restringido")
   - Selecciona **"Cualquier persona con el enlace"**
   - Rol: **"Lector"** (está bien, la app subirá con permisos específicos)
   - Clic en **"Listo"**
   - Clic en **"Copiar enlace"**
   - Clic en **"Listo"** para cerrar

4. **Obtener el DRIVE_FOLDER_ID**
   - El enlace copiado tiene este formato:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing
   ```
   - **Copia solo la parte del FOLDER_ID** (entre `/folders/` y `?`)
   - Ejemplo: Si el enlace es:
   ```
   https://drive.google.com/drive/folders/1dyC0H8Ct2D_8FMc7vwKV7LwYXQqz8vPm?usp=sharing
   ```
   - El FOLDER_ID es: `1dyC0H8Ct2D_8FMc7vwKV7LwYXQqz8vPm`
   
   - 📝 **Guarda este ID**, lo necesitarás para el `.env`

✅ **Verificación**: La carpeta debe estar visible en tu Drive y compartida con "Cualquiera con el enlace".

### 5. Configurar variables de entorno (2 minutos)

1. **Crear archivo .env**
   - En la raíz del proyecto `pet-history/`, crea un archivo llamado `.env`
   - Puedes copiarlo desde el template:
   ```bash
   cp .env.example .env
   ```

2. **Editar el archivo .env**
   - Abre el archivo `.env` con tu editor
   - Deberías ver algo así:
   
   ```env
   # Google Cloud Console Configuration
   # Instrucciones en README.md

   # OAuth 2.0 Client ID
   REACT_APP_GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com

   # Google Sheets ID (extraer de la URL de tu Google Sheet)
   REACT_APP_SPREADSHEET_ID=tu_spreadsheet_id_aqui

   # Google Drive Folder ID (para subir imágenes)
   REACT_APP_DRIVE_FOLDER_ID=tu_folder_id_aqui
   ```

3. **Completar con tus valores**
   
   Reemplaza cada valor con los IDs que copiaste anteriormente:

   **REACT_APP_GOOGLE_CLIENT_ID** (del paso 2D):
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
   ```
   ⚠️ **Importante**: NO quites la parte `.apps.googleusercontent.com`

   **REACT_APP_SPREADSHEET_ID** (del paso 3):
   ```env
   REACT_APP_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

   **REACT_APP_DRIVE_FOLDER_ID** (del paso 4):
   ```env
   REACT_APP_DRIVE_FOLDER_ID=1dyC0H8Ct2D_8FMc7vwKV7LwYXQqz8vPm
   ```

4. **Ejemplo de .env completo**
   
   Tu archivo `.env` final debería verse así (con TUS valores):
   
   ```env
   # OAuth 2.0 Client ID
   REACT_APP_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

   # Google Sheets ID
   REACT_APP_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

   # Google Drive Folder ID
   REACT_APP_DRIVE_FOLDER_ID=1dyC0H8Ct2D_8FMc7vwKV7LwYXQqz8vPm
   ```

5. **Guardar el archivo**
   - Guarda los cambios en el archivo `.env`
   - ⚠️ **NO subas este archivo a Git** (ya está en `.gitignore`)

✅ **Verificación**: 
- El archivo `.env` debe estar en la raíz del proyecto
- No debe tener texto como "tu_client_id_aqui"
- Cada ID debe tener el formato correcto (sin espacios, sin comillas)

### 6. Iniciar la app

```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

**Primera vez usando la app:**
1. Haz clic en **"Iniciar sesión con Google"**
2. Selecciona tu cuenta: `silvana.trabalon@gmail.com`
3. Google te mostrará una pantalla de permisos
4. Lee los permisos y haz clic en **"Continuar"**
5. Si ves una advertencia "Esta aplicación no está verificada":
   - Clic en **"Avanzado"**
   - Clic en **"Ir a Pet History (no seguro)"**
   - Esto es normal para apps en desarrollo
6. Acepta los permisos solicitados
7. ¡Listo! Ya puedes usar la aplicación

---

## ⚠️ Problemas Comunes y Soluciones

### Error: "Access to Google Sheets denied" / "Permission denied"

**Causa**: La aplicación no tiene permisos para acceder a tu Google Sheet.

**Solución**:
1. Verifica que el `REACT_APP_SPREADSHEET_ID` en `.env` sea correcto
2. Abre el Google Sheet en tu navegador con la cuenta `silvana.trabalon@gmail.com`
3. Verifica que la hoja tenga las 2 pestañas: "Pets" y "MedicalHistory"
4. Si el problema persiste, cierra sesión en la app y vuelve a hacer login

### Error: "Client ID not found" / "Invalid client"

**Causa**: El Client ID en `.env` es incorrecto o está mal formateado.

**Solución**:
1. Ve a Google Cloud Console → Credenciales
2. Verifica que el Client ID sea exactamente igual al que tienes en `.env`
3. El formato debe ser: `XXXXXXX-XXXXXXX.apps.googleusercontent.com`
4. NO debe tener comillas, espacios ni caracteres extra
5. Reinicia la app después de corregir

### Error: "Failed to upload image to Drive"

**Causa**: La aplicación no puede subir imágenes a Google Drive.

**Solución**:
1. Verifica que el `REACT_APP_DRIVE_FOLDER_ID` en `.env` sea correcto
2. Abre la carpeta de Drive y verifica que esté compartida como "Cualquier persona con el enlace"
3. Asegúrate de haber aceptado los permisos de Drive al hacer login

### La app no se inicia / Error en consola

**Causa**: Dependencias no instaladas o archivo `.env` mal configurado.

**Solución**:
1. Verifica que hayas ejecutado `npm install`
2. Verifica que el archivo `.env` exista en la raíz del proyecto
3. Verifica que las 3 variables estén configuradas correctamente
4. Reinicia la terminal y ejecuta `npm start` de nuevo

### "This app isn't verified" en el login

**Causa**: Tu aplicación está en modo de desarrollo.

**Solución**:
- Esto es completamente normal para apps en desarrollo
- Clic en "Avanzado" → "Ir a Pet History (no seguro)"
- Solo tú (y los usuarios de prueba que agregaste) pueden usar la app

### Los datos no se guardan en Google Sheets

**Causa**: Permisos incorrectos o IDs mal configurados.

**Solución**:
1. Abre la consola del navegador (F12) y busca errores en rojo
2. Verifica que hayas aceptado TODOS los permisos al hacer login
3. Prueba cerrar sesión y volver a hacer login
4. Verifica que el Spreadsheet ID sea correcto
5. Abre el Google Sheet manualmente para confirmar que tienes acceso

---

## 🎯 Ejemplos de Uso

### Inicializar hojas por primera vez

Si las hojas están vacías (sin headers), puedes inicializarlas desde la consola del navegador:

```javascript
// Abrir DevTools (F12)
// En la consola:
import googleSheetsService from './services/googleSheets';
await googleSheetsService.initializeSheets();
```

O simplemente agrega los headers manualmente en Google Sheets.

### Agregar mascota programáticamente

```javascript
import { useData } from './context/DataContext';

const { addPet } = useData();

await addPet({
  nombre: "Luna",
  especie: "Perro",
  raza: "Golden Retriever",
  edad: "3",
  sexo: "Hembra",
  notas: "Muy juguetona y amigable"
});
```

### Agregar registro médico con imágenes

```javascript
import { useData } from './context/DataContext';

const { addMedicalRecord } = useData();

const recordData = {
  petId: "1234567890-abc123",
  fecha: "2026-02-08",
  diagnostico: "Control anual - Todo normal",
  peso: "25.5",
  medicacion: "Vacuna antirrábica anual"
};

const imageFiles = [file1, file2]; // Array de File objects

await addMedicalRecord(recordData, imageFiles);
```

---

## 📊 Estructura de datos

### Pet Object
```javascript
{
  petId: "1234567890-abc123",
  nombre: "Luna",
  especie: "Perro",
  raza: "Golden Retriever",
  edad: "3",
  sexo: "Hembra",
  notas: "Muy juguetona",
  createdAt: "2026-02-08T10:30:00.000Z"
}
```

### Medical Record Object
```javascript
{
  historyId: "9876543210-xyz789",
  petId: "1234567890-abc123",
  fecha: "2026-02-08",
  diagnostico: "Control anual",
  peso: "25.5",
  medicacion: "Vacuna antirrábica",
  imageUrls: "https://drive.google.com/uc?id=...,https://drive.google.com/uc?id=...",
  createdAt: "2026-02-08T10:35:00.000Z"
}
```

---

## 🔧 Comandos útiles

### Desarrollo
```bash
npm start          # Iniciar app en modo desarrollo
npm run build      # Build para producción
npm test           # Ejecutar tests
```

### Ver estructura del proyecto
```bash
tree -I 'node_modules' -L 3
```

---

## 🐛 Debug común

### Ver logs en consola

Todos los servicios tienen logs descriptivos:

```
✅ Google API Client inicializado
✅ Google Identity Services inicializado
✅ Token de acceso obtenido
✅ Usuario autenticado: silvana.trabalon@gmail.com
✅ 3 mascotas leídas
✅ Mascota agregada: Luna
📤 Subiendo 2 imágenes...
✅ 2 imágenes subidas correctamente
✅ Registro médico agregado
```

### Verificar autenticación

```javascript
import googleAuthService from './services/googleAuth';

// Ver si está autenticado
console.log(googleAuthService.isAuthenticated());

// Ver token actual
console.log(googleAuthService.getAccessToken());
```

### Verificar datos en Sheets

Abre tu Google Sheet directamente y verifica que los datos se estén guardando correctamente.

### Verificar imágenes en Drive

Abre tu carpeta de Google Drive y verifica que las imágenes se estén subiendo.

---

## 📱 Testing en mobile

### Con tu celular en la misma red WiFi

1. Obtén la IP de tu computadora:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. En `package.json`, modifica el script:
   ```json
   "start": "HOST=0.0.0.0 react-scripts start"
   ```

3. Inicia la app:
   ```bash
   npm start
   ```

4. En tu celular, abre:
   ```
   http://TU_IP:3000
   ```

5. **IMPORTANTE**: Agrega esta URL a los orígenes autorizados en Google Cloud Console.

---

## 🚀 Deploy a producción

### Opción 1: Vercel (Recomendado)

```bash
npm install -g vercel
vercel login
vercel
```

Configurar variables de entorno en el dashboard de Vercel.

### Opción 2: Netlify

```bash
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

### Opción 3: GitHub Pages

1. Agregar en `package.json`:
   ```json
   "homepage": "https://tuusuario.github.io/pet-history",
   ```

2. Instalar gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Agregar scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

**IMPORTANTE:** No olvides actualizar los orígenes autorizados en Google Cloud Console con tu URL de producción.

---

## 📞 Soporte

Si encuentras algún problema:

1. Revisa los logs en la consola del navegador (F12)
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que las APIs estén habilitadas en Google Cloud
4. Verifica que el usuario tenga permisos en Sheets y Drive

---

## 🎓 Recursos adicionales

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Google Drive API Docs](https://developers.google.com/drive/api)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [React Router Docs](https://reactrouter.com/)
- [React Context API](https://react.dev/reference/react/useContext)

---

---

## ✅ Checklist de Configuración

Usa este checklist para verificar que todo esté configurado correctamente:

### Google Cloud Console
- [ ] Proyecto "Pet History" creado
- [ ] Google Sheets API habilitada
- [ ] Google Drive API habilitada
- [ ] Pantalla de consentimiento OAuth configurada
- [ ] Usuario de prueba agregado (`silvana.trabalon@gmail.com`)
- [ ] Alcances agregados (spreadsheets + drive.file)
- [ ] OAuth Client ID creado
- [ ] Client ID copiado y guardado

### Google Sheets
- [ ] Hoja "Pet History Database" creada
- [ ] Pestaña "Pets" con 8 headers
- [ ] Pestaña "MedicalHistory" con 8 headers
- [ ] Spreadsheet ID copiado de la URL

### Google Drive
- [ ] Carpeta "Pet History Images" creada
- [ ] Carpeta compartida como "Cualquier persona con el enlace"
- [ ] Folder ID copiado del enlace

### Proyecto Local
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado en la raíz
- [ ] `REACT_APP_GOOGLE_CLIENT_ID` configurado
- [ ] `REACT_APP_SPREADSHEET_ID` configurado
- [ ] `REACT_APP_DRIVE_FOLDER_ID` configurado
- [ ] App iniciada (`npm start`)
- [ ] Login exitoso con Google
- [ ] Permisos aceptados

### Prueba Final
- [ ] Puedo agregar una mascota
- [ ] La mascota aparece en Google Sheets
- [ ] Puedo agregar un registro médico
- [ ] El registro aparece en Google Sheets
- [ ] Puedo subir una imagen
- [ ] La imagen aparece en Google Drive
- [ ] Puedo ver el historial completo

Si todos los checkboxes están marcados, ¡tu configuración está completa! 🎉

---

## 📋 Resumen de IDs Necesarios

Para tu referencia rápida, estos son los 3 IDs que necesitas:

| Variable | Dónde obtenerla | Formato ejemplo |
|----------|----------------|-----------------|
| **REACT_APP_GOOGLE_CLIENT_ID** | Google Cloud Console → Credenciales | `123456789012-abc...xyz.apps.googleusercontent.com` |
| **REACT_APP_SPREADSHEET_ID** | URL de Google Sheet (entre `/d/` y `/edit`) | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms` |
| **REACT_APP_DRIVE_FOLDER_ID** | Enlace de carpeta de Drive (entre `/folders/` y `?`) | `1dyC0H8Ct2D_8FMc7vwKV7LwYXQqz8vPm` |

---

¡Listo para comenzar! 🚀
