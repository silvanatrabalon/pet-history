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
        range: `${SHEETS.PETS}!A2:J`, // A-J: petId, nombre, nickname, especie, raza, nacimiento, sexo, notas, createdAt, photoUrl
      });

      const rows = response.result.values || [];
      
      // Mapear rows a objetos Pet
      const pets = rows.map(row => ({
        petId: row[0] || '',
        nombre: row[1] || '',
        nickname: row[2] || '',
        especie: row[3] || '',
        raza: row[4] || '',
        nacimiento: row[5] || '',
        sexo: row[6] || '',
        notas: row[7] || '',
        createdAt: row[8] || '',
        photoUrl: row[9] || '' // Foto de perfil
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
        petData.nickname || '',
        petData.especie,
        petData.raza || '',
        petData.nacimiento || '',
        petData.sexo,
        petData.notas || '',
        petData.createdAt || new Date().toISOString(),
        petData.photoUrl || '' // Foto de perfil
      ];

      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.PETS}!A:J`,
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
        range: `${SHEETS.MEDICAL_HISTORY}!A2:J`,
      });

      const rows = response.result.values || [];
      
      // Mapear rows a objetos MedicalHistory
      const history = rows.map(row => ({
        historyId: row[0] || '',
        petId: row[1] || '',
        fecha: row[2] || '',
        motivo: row[3] || '',
        detalle: row[4] || '',
        veterinaria: row[5] || '',
        peso: row[6] || '',
        medicacion: row[7] || '',
        imageUrls: row[8] || '',
        createdAt: row[9] || ''
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
   * Lee todas las veterinarias desde la hoja "Vets"
   */
  async getVets() {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.VETS}!A2:C`,
      });

      const rows = response.result.values || [];
      
      // Mapear rows a objetos Vet
      const vets = rows.map(row => ({
        nombre: row[0] || '',
        especialidad: row[1] || '',
        contacto: row[2] || ''
      }));

      console.log(`✅ ${vets.length} veterinarias leídas`);
      return vets;
    } catch (error) {
      console.error('❌ Error leyendo veterinarias:', error);
      // Retornar array vacío si no existe la hoja
      return [];
    }
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
        recordData.motivo,
        recordData.detalle || '',
        recordData.veterinaria || '',
        recordData.peso || '',
        recordData.medicacion || '',
        recordData.imageUrls || '',
        recordData.createdAt || new Date().toISOString()
      ];

      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MEDICAL_HISTORY}!A:J`,
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
   * Actualiza una mascota existente
   */
  async updatePet(petId, petData) {
    try {
      // Primero encontrar la fila de la mascota
      const pets = await this.getPets();
      const rowIndex = pets.findIndex(pet => pet.petId === petId);
      
      if (rowIndex === -1) {
        throw new Error('Mascota no encontrada');
      }

      // La fila en la sheet es rowIndex + 2 (1 por headers, 1 por índice base-0)
      const sheetRow = rowIndex + 2;

      const row = [
        petData.petId,
        petData.nombre,
        petData.nickname || '',
        petData.especie,
        petData.raza || '',
        petData.nacimiento || '',
        petData.sexo,
        petData.notas || '',
        petData.createdAt,
        petData.photoUrl || ''
      ];

      const response = await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.PETS}!A${sheetRow}:J${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row]
        }
      });

      console.log('✅ Mascota actualizada:', petData.nombre);
      return response.result;
    } catch (error) {
      console.error('❌ Error actualizando mascota:', error);
      throw new Error('No se pudo actualizar la mascota');
    }
  }

  /**
   * Actualiza un registro médico existente
   */
  async updateMedicalRecord(historyId, recordData) {
    try {
      // Primero encontrar la fila del registro
      const history = await this.getMedicalHistory();
      const rowIndex = history.findIndex(record => record.historyId === historyId);
      
      if (rowIndex === -1) {
        throw new Error('Registro no encontrado');
      }

      // La fila en la sheet es rowIndex + 2
      const sheetRow = rowIndex + 2;

      const row = [
        recordData.historyId,
        recordData.petId,
        recordData.fecha,
        recordData.motivo || '',
        recordData.detalle || '',
        recordData.veterinaria || '',
        recordData.peso || '',
        recordData.medicacion || '',
        recordData.imageUrls || '',
        recordData.createdAt
      ];

      const response = await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.MEDICAL_HISTORY}!A${sheetRow}:J${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row]
        }
      });

      console.log('✅ Registro médico actualizado');
      return response.result;
    } catch (error) {
      console.error('❌ Error actualizando registro médico:', error);
      throw new Error('No se pudo actualizar el registro médico');
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
      const historyHeaders = [['historyId', 'petId', 'fecha', 'motivo', 'detalle', 'veterinaria', 'peso', 'medicacion', 'imageUrls', 'createdAt']];

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
