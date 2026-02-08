import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import HistoryForm from '../components/history/HistoryForm';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AddHistory.css'; // Reutilizamos los mismos estilos

const EditHistory = () => {
  const { petId, historyId } = useParams();
  const navigate = useNavigate();
  const { updateMedicalRecord, loadMedicalHistory, medicalHistory } = useData();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [record, setRecord] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadRecordData();
    // eslint-disable-next-line
  }, [historyId]);

  const loadRecordData = async () => {
    try {
      await loadMedicalHistory();
      const recordData = medicalHistory.find(r => r.historyId === historyId);
      setRecord(recordData);
    } catch (err) {
      console.error('Error cargando registro:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData, imageFiles) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mantener datos originales que no cambian
      const updatedData = {
        ...formData,
        createdAt: record.createdAt,
        imageUrls: record.imageUrls
      };
      
      await updateMedicalRecord(historyId, updatedData, imageFiles);
      navigate(`/pets/${petId}?tab=history`);
    } catch (err) {
      setError('Error al actualizar el registro. Intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/pets/${petId}?tab=history`);
  };

  if (initialLoading) {
    return (
      <div className="page">
        <LoadingSpinner message="Cargando..." />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="page">
        <header className="page-header">
          <Button onClick={() => navigate(`/pets/${petId}?tab=history`)} variant="outline">
            ← Volver
          </Button>
        </header>
        <div className="page-content">
          <p>Registro no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <Button onClick={handleCancel} variant="outline" className="back-btn">
            ← Volver
          </Button>
          <h1 className="page-title">Editar Registro Médico</h1>
        </div>
      </header>

      <main className="page-content">
        <div className="form-container">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}
          
          <HistoryForm
            petId={petId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            initialData={record}
          />
        </div>
      </main>
    </div>
  );
};

export default EditHistory;
