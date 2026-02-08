import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PetProfile from '../components/pets/PetProfile';
import HistoryList from '../components/history/HistoryList';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './PetDetail.css';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPetById, getPetHistory, loadPets, loadMedicalHistory, loading, pets, medicalHistory } = useData();
  
  const [pet, setPet] = useState(null);
  const [history, setHistory] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [id]);

  // Efecto para actualizar cuando cambien los datos en el contexto
  useEffect(() => {
    if (pets.length > 0 || medicalHistory.length > 0) {
      const petData = getPetById(id);
      const petHistory = getPetHistory(id);
      
      setPet(petData);
      setHistory(petHistory);
    }
  }, [id, pets, medicalHistory, getPetById, getPetHistory]);

  const loadData = async () => {
    try {
      setDataLoading(true);
      
      // Cargar datos si no están en el contexto
      await Promise.all([loadPets(), loadMedicalHistory()]);
      
      // Los datos se actualizarán automáticamente por el useEffect que escucha pets y medicalHistory
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddHistory = () => {
    navigate(`/pets/${id}/add-history`);
  };

  const handleEditPet = () => {
    navigate(`/pets/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/pets');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: `Historial de ${pet?.nombre}`,
      text: `Mira el historial clínico de ${pet?.nombre}`,
      url: url
    };
    
    // Verificar si Web Share API está disponible y soporta los datos
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        console.log('✅ Contenido compartido exitosamente');
      } catch (err) {
        // El usuario canceló el compartir o hubo un error
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          // Fallback a copiar al portapapeles
          copyToClipboard(url);
        }
      }
    } else {
      // Fallback: copiar al portapapeles
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('✅ Link copiado al portapapeles');
        })
        .catch((err) => {
          console.error('Error copiando:', err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('✅ Link copiado al portapapeles');
    } catch (err) {
      console.error('Error copiando:', err);
      alert('No se pudo copiar el link');
    }
    document.body.removeChild(textArea);
  };

  if (dataLoading || loading) {
    return (
      <div className="page">
        <LoadingSpinner message="Cargando información..." />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="page">
        <header className="page-header">
          <Button onClick={handleBack} variant="outline" className="back-btn">
            ← Volver
          </Button>
        </header>
        <ErrorMessage message="Mascota no encontrada" />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content header-with-actions">
          <Button onClick={handleBack} variant="outline" className="back-btn">
            ← Volver
          </Button>
          <button onClick={handleShare} className="share-btn" title="Compartir">
            🔗
          </button>
        </div>
      </header>

      <main className="page-content">
        <div className="pet-detail-container">
          <div className="pet-profile-section">
            <PetProfile pet={pet} />
            <Button
              onClick={handleEditPet}
              variant="outline"
              fullWidth
              className="edit-pet-btn"
            >
              ✏️ Editar Información
            </Button>
          </div>

          <div className="history-section">
            <HistoryList history={history} petId={id} />
          </div>

          <div className="add-history-cta">
            <Button
              onClick={handleAddHistory}
              variant="primary"
              fullWidth
            >
              + Agregar Registro Médico
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetDetail;
