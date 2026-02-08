/**
 * Servicio para interactuar con Google Sheets API
 * Gestiona la lectura y escritura de datos de mascotas e historial médico
 */

import { SPREADSHEET_ID, SHEETS } from '../utils/constants';

class GoogleSheetsService {
  /**
   * Lee todas las mascotas desde la hoja "Pets"
   */
  async getPets() {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.PETS}!A2:I`, // Agregamos columna I para photoUrl
      });

      const rows = response.result.values || [];
      
      // Mapear rows a objetos Pet
      const pets = rows.map(row => ({
        petId: row[0] || '',
        nombre: row[1] || '',
        especie: row[2] || '',
        raza: row[3] || '',
        edad: row[4] || '',
        sexo: row[5] || '',
        notas: row[6] || '',
        createdAt: row[7] || '',
        photoUrl: row[8] || '' // Nueva columna para foto de perfil
      }));

      console.log(`✅ ${pets.length} mascotas leídas`);
      return pets;
    } catch (error) {
      console.error('❌ Error leyendo mascotas:', error);
      throw new Error('No se pudieron cargar las mascotas');
    }
  }

  /**
   * Agrega una nueva mascota a la hoja "Pets"
   */
  async addPet(petData) {
    try {
      const row = [
        petData.petId,
        petData.nombre,
        petData.especie,
        petData.raza,
        petData.edad,
        petData.sexo,
        petData.notas || '',
        petData.createdAt || new Date().toISOString(),
        petData.photoUrl || '' // Foto de perfil
      ];

      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.PETS}!A:I`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row]
        }
      });

      console.log('✅ Mascota agregada:', petData.nombre);
      return response.result;
    } catch (error) {
      console.error('❌ Error agregando mascota:', error);
      throw new Error('No se pudo guardar la mascota');
    }
  }

  /**
   * Lee todo el historial médico desde la hoja "MedicalHistory"
   */
  async getMedicalHistory() {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MEDICAL_HISTORY}!A2:H`,
      });

      const rows = response.result.values || [];
      
      // Mapear rows a objetos MedicalHistory
      const history = rows.map(row => ({
        historyId: row[0] || '',
        petId: row[1] || '',
        fecha: row[2] || '',
        diagnostico: row[3] || '',
        peso: row[4] || '',
        medicacion: row[5] || '',
        imageUrls: row[6] || '',
        createdAt: row[7] || ''
      }));

      console.log(`✅ ${history.length} registros médicos leídos`);
      return history;
    } catch (error) {
      console.error('❌ Error leyendo historial médico:', error);
      throw new Error('No se pudo cargar el historial médico');
    }
  }

  /**
   * Obtiene el historial médico de una mascota específica
   */
  async getMedicalHistoryByPet(petId) {
    const allHistory = await this.getMedicalHistory();
    return allHistory.filter(record => record.petId === petId);
  }

  /**
   * Agrega un nuevo registro al historial médico
   */
  async addMedicalRecord(recordData) {
    try {
      const row = [
        recordData.historyId,
        recordData.petId,
        recordData.fecha,
        recordData.diagnostico,
        recordData.peso || '',
        recordData.medicacion || '',
        recordData.imageUrls || '',
        recordData.createdAt || new Date().toISOString()
      ];

      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MEDICAL_HISTORY}!A:H`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row]
        }
      });

      console.log('✅ Registro médico agregado');
      return response.result;
    } catch (error) {
      console.error('❌ Error agregando registro médico:', error);
      throw new Error('No se pudo guardar el registro médico');
    }
  }

  /**
   * Inicializa las hojas con headers si no existen
   * Esta función debe ejecutarse manualmente una vez
   */
  async initializeSheets() {
    try {
      // Headers para la hoja Pets
      const petsHeaders = [['petId', 'nombre', 'especie', 'raza', 'edad', 'sexo', 'notas', 'createdAt']];
      
      // Headers para la hoja MedicalHistory
      const historyHeaders = [['historyId', 'petId', 'fecha', 'diagnostico', 'peso', 'medicacion', 'imageUrls', 'createdAt']];

      // Crear o actualizar headers
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.PETS}!A1:H1`,
        valueInputOption: 'RAW',
        resource: {
          values: petsHeaders
        }
      });

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MEDICAL_HISTORY}!A1:H1`,
        valueInputOption: 'RAW',
        resource: {
          values: historyHeaders
        }
      });

      console.log('✅ Hojas inicializadas con headers');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando hojas:', error);
      throw error;
    }
  }
}

// Exportar instancia única
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
