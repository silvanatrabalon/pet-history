/**
 * Genera un ID único basado en timestamp
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formatea una fecha a string legible
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  // Parsear fecha como local para evitar problemas de zona horaria
  const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Convierte un array de URLs en string separado por comas
 */
export const joinImageUrls = (urls) => {
  return urls.filter(url => url).join(',');
};

/**
 * Convierte un string de URLs separadas por comas en array
 */
export const splitImageUrls = (urlString) => {
  if (!urlString) return [];
  return urlString.split(',').filter(url => url.trim());
};

/**
 * Calcula la edad desde fecha de nacimiento
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  // Ajustar si aún no cumplió años este año
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  
  // Ajustar meses si aún no llegó al día del mes
  if (today.getDate() < birth.getDate()) {
    months--;
  }
  
  return { years, months };
};

/**
 * Formatea la edad en formato legible
 */
export const formatAge = (birthDate) => {
  const age = calculateAge(birthDate);
  if (!age) return 'Edad desconocida';
  
  if (age.years === 0) {
    return `${age.months} ${age.months === 1 ? 'mes' : 'meses'}`;
  }
  
  if (age.months === 0) {
    return `${age.years} ${age.years === 1 ? 'año' : 'años'}`;
  }
  
  return `${age.years} ${age.years === 1 ? 'año' : 'años'} y ${age.months} ${age.months === 1 ? 'mes' : 'meses'}`;
};

/**
 * Valida que un archivo sea una imagen
 */
export const isImageFile = (file) => {
  return file && file.type.startsWith('image/');
};

/**
 * Convierte bytes a tamaño legible
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
