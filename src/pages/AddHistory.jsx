import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import HistoryForm from '../components/history/HistoryForm';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AddHistory.css';

const AddHistory = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { getPetById, addMedicalRecord, loadPets } = useData();
  
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadPetData();
    // eslint-disable-next-line
  }, [petId]);

  const loadPetData = async () => {
    try {
      await loadPets();
      const petData = getPetById(petId);
      setPet(petData);
    } catch (err) {
      console.error('Error cargando mascota:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (recordData, imageFiles) => {
    try {
      setLoading(true);
      setError(null);
      await addMedicalRecord(recordData, imageFiles);
      navigate(`/pets/${petId}?tab=history`);
    } catch (err) {
      setError('Error al guardar el registro. Intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/pets/${petId}`);
  };

  if (initialLoading) {
    return (
      <div className="page">
        <LoadingSpinner message="Cargando..." />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="page">
        <header className="page-header">
          <Button onClick={() => navigate('/pets')} variant="outline">
            ← Volver
          </Button>
        </header>
        <div className="page-content">
          <p>Mascota no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="back-btn"
          >
            ← Volver
          </Button>
          <div className="header-info">
            <h1 className="page-title">Nuevo Registro</h1>
            <p className="pet-name-subtitle">{pet.nombre}</p>
          </div>
        </div>
      </header>

      <main className="page-content">
        <div className="form-container">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-overlay">
              <LoadingSpinner message="Guardando registro y subiendo imágenes..." />
            </div>
          )}
          
          <HistoryForm
            petId={petId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default AddHistory;
