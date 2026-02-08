/**
 * DataContext - Maneja el estado global de mascotas e historial médico
 * Provee métodos para cargar y agregar datos
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import googleSheetsService from '../services/googleSheets';
import googleDriveService from '../services/googleDrive';
import { generateId, joinImageUrls } from '../utils/helpers';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [petsLoaded, setPetsLoaded] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [vetsLoaded, setVetsLoaded] = useState(false);

  /**
   * Carga todas las mascotas desde Google Sheets
   */
  const loadPets = useCallback(async (force = false) => {
    // Si ya están cargadas y no es forzado, no recargar
    if (petsLoaded && !force) {
      console.log('ℹ️ Mascotas ya cargadas, usando caché');
      return pets;
    }
    
    try {
      setLoading(true);
      setError(null);
      const petsData = await googleSheetsService.getPets();
      setPets(petsData);
      setPetsLoaded(true);
      return petsData;
    } catch (err) {
      console.error('❌ Error cargando mascotas:', err);
      setError('No se pudieron cargar las mascotas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [petsLoaded, pets]);

  /**
   * Carga todo el historial médico desde Google Sheets
   */
  const loadMedicalHistory = useCallback(async (force = false) => {
    // Si ya está cargado y no es forzado, no recargar
    if (historyLoaded && !force) {
      console.log('ℹ️ Historial ya cargado, usando caché');
      return medicalHistory;
    }
    
    try {
      setLoading(true);
      setError(null);
      const historyData = await googleSheetsService.getMedicalHistory();
      setMedicalHistory(historyData);
      setHistoryLoaded(true);
      return historyData;
    } catch (err) {
      console.error('❌ Error cargando historial:', err);
      setError('No se pudo cargar el historial médico');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [historyLoaded, medicalHistory]);

  /**
   * Obtiene el historial médico de una mascota específica
   */
  const getPetHistory = useCallback((petId) => {
    const filtered = medicalHistory.filter(record => record.petId === petId);
    return filtered;
  }, [medicalHistory]);

  /**
   * Obtiene una mascota por su ID
   */
  const getPetById = useCallback((petId) => {
    return pets.find(pet => pet.petId === petId);
  }, [pets]);

  /**
   * Agrega una nueva mascota
   */
  const addPet = async (petData) => {
    try {
      setLoading(true);
      setError(null);

      const newPet = {
        petId: generateId(),
        nombre: petData.nombre,
        nickname: petData.nickname || '',
        especie: petData.especie,
        raza: petData.raza || '',
        nacimiento: petData.nacimiento || '',
        sexo: petData.sexo,
        notas: petData.notas || '',
        createdAt: new Date().toISOString(),
        photoUrl: ''
      };

      // Si hay foto, subirla primero a Drive
      if (petData.photoFile) {
        console.log('📤 Subiendo foto de perfil...');
        const result = await googleDriveService.uploadImage(
          petData.photoFile,
          `pet_${newPet.petId}_${Date.now()}`
        );
        newPet.photoUrl = result.url;
        console.log('✅ Foto de perfil subida');
      }

      await googleSheetsService.addPet(newPet);
      
      // Forzar recarga desde el sheet para obtener datos frescos
      await loadPets(true);
      
      console.log('✅ Mascota agregada exitosamente');
      return newPet;
    } catch (err) {
      console.error('❌ Error agregando mascota:', err);
      setError('No se pudo guardar la mascota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agrega un nuevo registro médico con imágenes
   */
  const addMedicalRecord = async (recordData, imageFiles = []) => {
    try {
      setLoading(true);
      setError(null);

      let imageUrls = '';

      // Subir imágenes si existen
      if (imageFiles.length > 0) {
        console.log(`📤 Subiendo ${imageFiles.length} imágenes...`);
        const uploadResults = await googleDriveService.uploadMultipleImages(imageFiles);
        const urls = uploadResults.map(result => result.url);
        imageUrls = joinImageUrls(urls);
      }

      const newRecord = {
        historyId: generateId(),
        petId: recordData.petId,
        fecha: recordData.fecha,
        motivo: recordData.motivo,
        detalle: recordData.detalle || '',
        veterinaria: recordData.veterinaria || '',
        peso: recordData.peso || '',
        medicacion: recordData.medicacion || '',
        imageUrls,
        createdAt: new Date().toISOString()
      };

      await googleSheetsService.addMedicalRecord(newRecord);
      
      // Actualizar estado local
      setMedicalHistory(prev => [...prev, newRecord]);
      
      console.log('✅ Registro médico agregado exitosamente');
      return newRecord;
    } catch (err) {
      console.error('❌ Error agregando registro médico:', err);
      setError('No se pudo guardar el registro médico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza una mascota existente
   */
  const updatePet = async (petId, petData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedPet = {
        petId: petId,
        nombre: petData.nombre,
        nickname: petData.nickname || '',
        especie: petData.especie,
        raza: petData.raza || '',
        nacimiento: petData.nacimiento || '',
        sexo: petData.sexo,
        notas: petData.notas || '',
        createdAt: petData.createdAt, // Mantener la fecha de creación original
        photoUrl: petData.photoUrl || ''
      };

      // Si hay nueva foto, subirla primero a Drive
      if (petData.photoFile) {
        console.log('📤 Subiendo nueva foto de perfil...');
        const result = await googleDriveService.uploadImage(
          petData.photoFile,
          `pet_${petId}_${Date.now()}`
        );
        updatedPet.photoUrl = result.url;
        console.log('✅ Nueva foto de perfil subida');
      }

      await googleSheetsService.updatePet(petId, updatedPet);
      
      // Forzar recarga desde el sheet para obtener datos frescos
      await loadPets(true);
      
      console.log('✅ Mascota actualizada exitosamente');
      return updatedPet;
    } catch (err) {
      console.error('❌ Error actualizando mascota:', err);
      setError('No se pudo actualizar la mascota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza un registro médico existente
   */
  const updateMedicalRecord = async (historyId, recordData, newImageFiles = []) => {
    try {
      setLoading(true);
      setError(null);

      let imageUrls = recordData.imageUrls || '';

      // Si hay nuevas imágenes, subirlas y combinarlas con las existentes
      if (newImageFiles.length > 0) {
        console.log(`📤 Subiendo ${newImageFiles.length} nuevas imágenes...`);
        const uploadResults = await googleDriveService.uploadMultipleImages(newImageFiles);
        const newUrls = uploadResults.map(result => result.url);
        
        // Combinar URLs existentes con las nuevas
        const existingUrls = imageUrls ? imageUrls.split(',').filter(url => url.trim()) : [];
        const allUrls = [...existingUrls, ...newUrls];
        imageUrls = joinImageUrls(allUrls);
      }

      const updatedRecord = {
        historyId: historyId,
        petId: recordData.petId,
        fecha: recordData.fecha,
        motivo: recordData.motivo,
        detalle: recordData.detalle || '',
        veterinaria: recordData.veterinaria || '',
        peso: recordData.peso || '',
        medicacion: recordData.medicacion || '',
        imageUrls: imageUrls,
        createdAt: recordData.createdAt // Mantener la fecha de creación original
      };

      await googleSheetsService.updateMedicalRecord(historyId, updatedRecord);
      
      // Actualizar estado local
      setMedicalHistory(prev => prev.map(record => 
        record.historyId === historyId ? updatedRecord : record
      ));
      
      console.log('✅ Registro médico actualizado exitosamente');
      return updatedRecord;
    } catch (err) {
      console.error('❌ Error actualizando registro médico:', err);
      setError('No se pudo actualizar el registro médico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recarga todos los datos (forzando la actualización)
   */
  const refreshData = async () => {
    await Promise.all([loadPets(true), loadMedicalHistory(true), loadVets(true)]);
  };

  /**
   * Carga todas las veterinarias desde Google Sheets
   */
  const loadVets = useCallback(async (force = false) => {
    // Si ya están cargadas y no es forzado, no recargar
    if (vetsLoaded && !force) {
      console.log('ℹ️ Veterinarias ya cargadas, usando caché');
      return vets;
    }
    
    try {
      setLoading(true);
      setError(null);
      const vetsData = await googleSheetsService.getVets();
      setVets(vetsData);
      setVetsLoaded(true);
      return vetsData;
    } catch (err) {
      console.error('❌ Error cargando veterinarias:', err);
      setError('No se pudieron cargar las veterinarias');
      // No lanzar error, solo retornar array vacío
      return [];
    } finally {
      setLoading(false);
    }
  }, [vetsLoaded, vets]);

  /**
   * Agrega una nueva veterinaria
   */
  const addVet = async (vetData) => {
    try {
      setLoading(true);
      setError(null);

      await googleSheetsService.addVet(vetData);
      
      // Forzar recarga desde el sheet para obtener datos frescos
      await loadVets(true);
      
      console.log('✅ Veterinaria agregada exitosamente');
      return vetData;
    } catch (err) {
      console.error('❌ Error agregando veterinaria:', err);
      setError('No se pudo guardar la veterinaria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza una veterinaria existente
   */
  const updateVet = async (rowIndex, vetData) => {
    try {
      setLoading(true);
      setError(null);

      await googleSheetsService.updateVet(rowIndex, vetData);
      
      // Forzar recarga desde el sheet para obtener datos frescos
      await loadVets(true);
      
      console.log('✅ Veterinaria actualizada exitosamente');
      return vetData;
    } catch (err) {
      console.error('❌ Error actualizando veterinaria:', err);
      setError('No se pudo actualizar la veterinaria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una veterinaria
   */
  const deleteVet = async (rowIndex) => {
    try {
      setLoading(true);
      setError(null);

      await googleSheetsService.deleteVet(rowIndex);
      
      // Forzar recarga desde el sheet para obtener datos frescos
      await loadVets(true);
      
      console.log('✅ Veterinaria eliminada exitosamente');
      return true;
    } catch (err) {
      console.error('❌ Error eliminando veterinaria:', err);
      setError('No se pudo eliminar la veterinaria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    pets,
    medicalHistory,
    vets,
    loading,
    error,
    loadPets,
    loadMedicalHistory,
    loadVets,
    getPetHistory,
    getPetById,
    addPet,
    updatePet,
    addMedicalRecord,
    updateMedicalRecord,
    addVet,
    updateVet,
    deleteVet,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
