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
  const date = new Date(dateString);
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
 * Calcula la edad en formato legible
 */
export const formatAge = (ageInYears) => {
  if (!ageInYears) return 'Edad desconocida';
  if (ageInYears < 1) {
    const months = Math.round(ageInYears * 12);
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  return `${ageInYears} ${ageInYears === 1 ? 'año' : 'años'}`;
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
