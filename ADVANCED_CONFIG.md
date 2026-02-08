# ⚙️ Configuración Avanzada - Pet History

## 🔧 Configuraciones Opcionales

### 1. Configurar cuenta de Google específica

Si quieres que la app solo funcione con una cuenta específica:

En `src/services/googleAuth.js`, modifica el método `login()`:

```javascript
// Solicitar token con email específico
this.tokenClient.requestAccessToken({ 
  prompt: 'consent',
  login_hint: 'silvana.trabalon@gmail.com' // Tu email específico
});
```

---

### 2. Limitar usuarios autorizados

Para producción, en Google Cloud Console:

1. Ve a **Pantalla de consentimiento OAuth**
2. En **Usuarios de prueba**, agrega solo los emails autorizados
3. No publiques la app (déjala en modo Testing)

Así solo los usuarios listados podrán usar la app.

---

### 3. Múltiples entornos (.env)

#### Desarrollo (.env.development)
```env
REACT_APP_GOOGLE_CLIENT_ID=dev_client_id
REACT_APP_SPREADSHEET_ID=dev_spreadsheet_id
REACT_APP_DRIVE_FOLDER_ID=dev_folder_id
```

#### Producción (.env.production)
```env
REACT_APP_GOOGLE_CLIENT_ID=prod_client_id
REACT_APP_SPREADSHEET_ID=prod_spreadsheet_id
REACT_APP_DRIVE_FOLDER_ID=prod_folder_id
```

React automáticamente carga el archivo correcto según el ambiente.

---

### 4. Personalizar especies de mascotas

En `src/utils/constants.js`:

```javascript
export const SPECIES = [
  'Perro', 
  'Gato', 
  'Ave', 
  'Conejo', 
  'Hamster',
  'Cobayo',
  'Reptil',
  'Pez',
  'Otro'
];
```

---

### 5. Cambiar límite de imágenes

En `src/components/history/HistoryForm.jsx`:

```javascript
<ImageUploader
  onChange={handleImagesChange}
  maxFiles={10} // Cambiar de 5 a 10
/>
```

También actualizar en `src/components/history/ImageUploader.jsx` el prop default:

```javascript
const ImageUploader = ({ onChange, maxFiles = 10 }) => {
```

---

### 6. Agregar campos personalizados

#### Agregar campo "Veterinario" a registros médicos

**1. Actualizar Google Sheet:**
Agregar columna "veterinario" en la hoja MedicalHistory (entre medicacion e imageUrls)

**2. Actualizar servicio (src/services/googleSheets.js):**

```javascript
// En getMedicalHistory()
const history = rows.map(row => ({
  historyId: row[0] || '',
  petId: row[1] || '',
  fecha: row[2] || '',
  diagnostico: row[3] || '',
  peso: row[4] || '',
  medicacion: row[5] || '',
  veterinario: row[6] || '', // NUEVO
  imageUrls: row[7] || '',
  createdAt: row[8] || ''
}));

// En addMedicalRecord()
const row = [
  recordData.historyId,
  recordData.petId,
  recordData.fecha,
  recordData.diagnostico,
  recordData.peso || '',
  recordData.medicacion || '',
  recordData.veterinario || '', // NUEVO
  recordData.imageUrls || '',
  recordData.createdAt || new Date().toISOString()
];
```

**3. Actualizar formulario (src/components/history/HistoryForm.jsx):**

```javascript
const [formData, setFormData] = useState({
  petId: petId,
  fecha: new Date().toISOString().split('T')[0],
  diagnostico: '',
  peso: '',
  medicacion: '',
  veterinario: '' // NUEVO
});

// Agregar input en el JSX
<Input
  label="Veterinario"
  name="veterinario"
  value={formData.veterinario}
  onChange={handleChange}
  placeholder="Nombre del veterinario..."
/>
```

**4. Actualizar visualización (src/components/history/HistoryItem.jsx):**

```javascript
{record.veterinario && (
  <div className="history-detail">
    <span className="history-icon">👨‍⚕️</span>
    <span className="history-detail-text">Veterinario: {record.veterinario}</span>
  </div>
)}
```

---

### 7. Cambiar tema de colores

En `src/App.css`, define variables CSS:

```css
:root {
  --color-primary: #4F46E5;
  --color-primary-dark: #4338CA;
  --color-secondary: #7C3AED;
  --color-text: #111827;
  --color-text-light: #6B7280;
  --color-bg: #F9FAFB;
  --color-card: #FFFFFF;
}

/* Tema alternativo */
.theme-green {
  --color-primary: #10B981;
  --color-primary-dark: #059669;
  --color-secondary: #34D399;
}
```

Luego reemplazar colores hardcoded por variables:

```css
.btn-primary {
  background: var(--color-primary);
}
```

---

### 8. Agregar modo offline (PWA básico)

#### 1. Crear service worker (public/service-worker.js):

```javascript
const CACHE_NAME = 'pet-history-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

#### 2. Registrar en src/index.js:

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
```

#### 3. Agregar manifest (public/manifest.json):

```json
{
  "short_name": "Pet History",
  "name": "Pet History - Historial de Mascotas",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#4F46E5",
  "background_color": "#ffffff"
}
```

---

### 9. Notificaciones de recordatorios

#### Agregar campo nextVaccine a mascotas

```javascript
// En PetForm.jsx
<Input
  label="Próxima vacuna"
  name="nextVaccine"
  type="date"
  value={formData.nextVaccine}
  onChange={handleChange}
/>
```

#### Verificar recordatorios al cargar

```javascript
// En PetsList.jsx
useEffect(() => {
  pets.forEach(pet => {
    if (pet.nextVaccine) {
      const daysUntil = getDaysUntil(pet.nextVaccine);
      if (daysUntil <= 7 && daysUntil >= 0) {
        showNotification(`${pet.nombre} tiene vacuna en ${daysUntil} días`);
      }
    }
  });
}, [pets]);
```

---

### 10. Exportar historial a PDF

Instalar jsPDF:

```bash
npm install jspdf jspdf-autotable
```

Crear función de exportación:

```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (pet, history) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text(`Historial de ${pet.nombre}`, 14, 20);
  
  // Info de mascota
  doc.setFontSize(12);
  doc.text(`Especie: ${pet.especie}`, 14, 30);
  doc.text(`Raza: ${pet.raza}`, 14, 37);
  
  // Tabla de historial
  const tableData = history.map(record => [
    record.fecha,
    record.diagnostico,
    record.peso,
    record.medicacion
  ]);
  
  doc.autoTable({
    head: [['Fecha', 'Diagnóstico', 'Peso', 'Medicación']],
    body: tableData,
    startY: 45
  });
  
  doc.save(`historial-${pet.nombre}.pdf`);
};
```

Agregar botón en PetDetail:

```javascript
<Button onClick={() => exportToPDF(pet, history)}>
  Exportar PDF
</Button>
```

---

### 11. Búsqueda y filtros

En PetsList.jsx:

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filterSpecies, setFilterSpecies] = useState('');

const filteredPets = pets.filter(pet => {
  const matchesSearch = pet.nombre.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesSpecies = !filterSpecies || pet.especie === filterSpecies;
  return matchesSearch && matchesSpecies;
});

// En el JSX
<Input
  placeholder="Buscar mascota..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

<select onChange={(e) => setFilterSpecies(e.target.value)}>
  <option value="">Todas las especies</option>
  {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
</select>
```

---

### 12. Analytics con Google Analytics

#### 1. Instalar react-ga4:

```bash
npm install react-ga4
```

#### 2. Inicializar en App.jsx:

```javascript
import ReactGA from 'react-ga4';

// En el componente App
useEffect(() => {
  ReactGA.initialize('G-XXXXXXXXXX'); // Tu tracking ID
}, []);
```

#### 3. Trackear eventos:

```javascript
// Al agregar mascota
ReactGA.event({
  category: 'Pet',
  action: 'Add Pet',
  label: petData.especie
});

// Al agregar registro
ReactGA.event({
  category: 'Medical Record',
  action: 'Add Record',
  label: recordData.petId
});
```

---

### 13. Rate limiting para uploads

Limitar uploads simultáneos:

```javascript
// En googleDrive.js
async uploadMultipleImages(files, maxConcurrent = 2) {
  const results = [];
  
  for (let i = 0; i < files.length; i += maxConcurrent) {
    const batch = files.slice(i, i + maxConcurrent);
    const batchPromises = batch.map((file, index) => {
      const timestamp = Date.now();
      const fileName = `pet_image_${timestamp}_${i + index}.${file.name.split('.').pop()}`;
      return this.uploadImage(file, fileName);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}
```

---

### 14. Compresión de imágenes antes de subir

Instalar browser-image-compression:

```bash
npm install browser-image-compression
```

En ImageUploader.jsx:

```javascript
import imageCompression from 'browser-image-compression';

const handleFileSelect = async (e) => {
  const selectedFiles = Array.from(e.target.files);
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  const compressedFiles = await Promise.all(
    selectedFiles.map(file => imageCompression(file, options))
  );
  
  // Continuar con compressedFiles...
};
```

---

### 15. Backup automático

Crear script para backup periódico:

```javascript
// src/utils/backup.js
export const createBackup = async () => {
  const timestamp = new Date().toISOString();
  const data = {
    pets: await googleSheetsService.getPets(),
    history: await googleSheetsService.getMedicalHistory(),
    timestamp
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pet-history-backup-${timestamp}.json`;
  a.click();
};
```

Agregar botón en settings o en header.

---

## 🔒 Seguridad Adicional

### 1. Validar permisos de Google Sheet

```javascript
// Verificar que el usuario tenga acceso
const checkSheetAccess = async () => {
  try {
    await googleSheetsService.getPets();
    return true;
  } catch (error) {
    if (error.status === 403) {
      alert('No tienes permisos para acceder a esta hoja');
    }
    return false;
  }
};
```

### 2. Sanitizar inputs

```javascript
const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .slice(0, 500); // Limitar longitud
};
```

### 3. Rate limiting en el frontend

```javascript
let lastRequest = 0;
const MIN_INTERVAL = 1000; // 1 segundo

const rateLimitedFunction = async (...args) => {
  const now = Date.now();
  if (now - lastRequest < MIN_INTERVAL) {
    throw new Error('Demasiadas solicitudes. Espera un momento.');
  }
  lastRequest = now;
  // Continuar con la función...
};
```

---

Estas configuraciones te permiten personalizar y extender la aplicación según tus necesidades específicas. 🚀
