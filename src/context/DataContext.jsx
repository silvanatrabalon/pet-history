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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [petsLoaded, setPetsLoaded] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

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
        especie: petData.especie,
        raza: petData.raza,
        edad: petData.edad,
        sexo: petData.sexo,
        notas: petData.notas,
        createdAt: new Date().toISOString(),
        photoUrl: ''
      };

      // Si hay foto, subirla primero a Drive
      if (petData.photoFile) {
        console.log('📤 Subiendo foto de perfil...');
        const photoUrl = await googleDriveService.uploadImage(petData.photoFile);
        newPet.photoUrl = photoUrl;
        console.log('✅ Foto de perfil subida');
      }

      await googleSheetsService.addPet(newPet);
      
      // Actualizar estado local
      setPets(prev => [...prev, newPet]);
      
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
        ...recordData,
        historyId: generateId(),
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
   * Recarga todos los datos (forzando la actualización)
   */
  const refreshData = async () => {
    await Promise.all([loadPets(true), loadMedicalHistory(true)]);
  };

  const value = {
    pets,
    medicalHistory,
    loading,
    error,
    loadPets,
    loadMedicalHistory,
    getPetHistory,
    getPetById,
    addPet,
    addMedicalRecord,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
