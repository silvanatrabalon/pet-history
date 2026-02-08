/**
 * Servicio para subir y gestionar imágenes en Google Drive
 * Las imágenes se almacenan con permisos públicos de lectura
 */

import { DRIVE_FOLDER_ID } from '../utils/constants';

class GoogleDriveService {
  /**
   * Sube una imagen a Google Drive y retorna la URL pública
   */
  async uploadImage(file, fileName) {
    try {
      console.log(`📤 Subiendo imagen: ${fileName}`);

      // Paso 1: Crear metadata del archivo
      const metadata = {
        name: fileName,
        mimeType: file.type,
        parents: [DRIVE_FOLDER_ID] // Carpeta destino
      };

      // Paso 2: Crear form data con metadata y archivo
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      // Paso 3: Subir archivo usando multipart upload
      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink,thumbnailLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${window.gapi.client.getToken().access_token}`
          },
          body: form
        }
      );

      if (!response.ok) {
        throw new Error(`Error en upload: ${response.statusText}`);
      }

      const fileData = await response.json();
      console.log('✅ Imagen subida:', fileData.id);

      // Paso 4: Hacer el archivo público
      await this.makeFilePublic(fileData.id);

      // Paso 5: Retornar URL de visualización directa
      // Usamos la URL directa que funciona mejor para visualización en <img>
      const publicUrl = `https://lh3.googleusercontent.com/d/${fileData.id}`;
      
      return {
        fileId: fileData.id,
        url: publicUrl,
        webViewLink: fileData.webViewLink,
        thumbnailLink: fileData.thumbnailLink
      };
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      throw new Error('No se pudo subir la imagen');
    }
  }

  /**
   * Hace que un archivo sea públicamente visible
   */
  async makeFilePublic(fileId) {
    try {
      const response = await window.gapi.client.drive.permissions.create({
        fileId: fileId,
        resource: {
          type: 'anyone',
          role: 'reader'
        }
      });

      console.log('✅ Permisos públicos configurados');
      return response;
    } catch (error) {
      console.error('❌ Error configurando permisos:', error);
      throw error;
    }
  }

  /**
   * Sube múltiples imágenes en paralelo
   */
  async uploadMultipleImages(files) {
    try {
      const uploadPromises = files.map((file, index) => {
        const timestamp = Date.now();
        const fileName = `pet_image_${timestamp}_${index}.${file.name.split('.').pop()}`;
        return this.uploadImage(file, fileName);
      });

      const results = await Promise.all(uploadPromises);
      console.log(`✅ ${results.length} imágenes subidas correctamente`);
      
      return results;
    } catch (error) {
      console.error('❌ Error subiendo múltiples imágenes:', error);
      throw error;
    }
  }

  /**
   * Obtiene una imagen como blob para visualización directa
   * Esto evita problemas de CORS y URLs públicas
   */
  async getImageBlob(fileId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${window.gapi.client.getToken().access_token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error obteniendo imagen: ${response.statusText}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      console.log('✅ Imagen obtenida como blob:', fileId);
      return objectUrl;
    } catch (error) {
      console.error('❌ Error obteniendo blob de imagen:', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo de Google Drive (opcional, para futuras features)
   */
  async deleteFile(fileId) {
    try {
      await window.gapi.client.drive.files.delete({
        fileId: fileId
      });

      console.log('✅ Archivo eliminado:', fileId);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error);
      throw error;
    }
  }

  /**
   * Crea la carpeta de imágenes si no existe
   * Esta función es útil para la configuración inicial
   */
  async createImagesFolder(folderName = 'Pet History Images') {
    try {
      const metadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };

      const response = await window.gapi.client.drive.files.create({
        resource: metadata,
        fields: 'id, name, webViewLink'
      });

      const folder = response.result;
      console.log('✅ Carpeta creada:', folder.name);
      console.log('📁 Folder ID:', folder.id);
      console.log('🔗 Link:', folder.webViewLink);

      return folder;
    } catch (error) {
      console.error('❌ Error creando carpeta:', error);
      throw error;
    }
  }

  /**
   * Lista archivos en la carpeta configurada (para debug)
   */
  async listFiles() {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `'${DRIVE_FOLDER_ID}' in parents and trashed=false`,
        fields: 'files(id, name, webViewLink, createdTime)',
        orderBy: 'createdTime desc'
      });

      const files = response.result.files || [];
      console.log(`📂 ${files.length} archivos en la carpeta`);
      return files;
    } catch (error) {
      console.error('❌ Error listando archivos:', error);
      throw error;
    }
  }
}

// Exportar instancia única
const googleDriveService = new GoogleDriveService();
export default googleDriveService;
