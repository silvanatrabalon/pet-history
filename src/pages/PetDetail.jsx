import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PetProfile from '../components/pets/PetProfile';
import HistoryTimeline from '../components/history/HistoryTimeline';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './PetDetail.css';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getPetById, getPetHistory, loadPets, loadMedicalHistory, loading, pets, medicalHistory } = useData();
  const { isAuthenticated } = useAuth();
  
  const [pet, setPet] = useState(null);
  const [history, setHistory] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile'); // Leer tab de URL

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
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar registros');
      return;
    }
    navigate(`/pets/${id}/add-history`);
  };

  const handleEditPet = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para editar');
      return;
    }
    navigate(`/pets/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/pets');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
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
        <div className="header-content">
          <Button onClick={handleBack} variant="outline" className="back-btn">
            ← Volver
          </Button>
        </div>
      </header>

      <main className="page-content">
        <div className="pet-detail-container">
          {/* Tab de Perfil */}
          {activeTab === 'profile' && (
            <div className="pet-profile-section">
              <PetProfile pet={pet} />
              {isAuthenticated && (
                <Button
                  onClick={handleEditPet}
                  variant="outline"
                  fullWidth
                  className="edit-pet-btn"
                >
                  ✏️ Editar Información
                </Button>
              )}
            </div>
          )}

          {/* Tab de Historial */}
          {activeTab === 'history' && (
            <div className="history-section">
              <HistoryTimeline history={history} petId={id} />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Tab Navigator */}
      <nav className="bottom-tab-navigator">
        <button
          className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <span className="tab-icon">🐾</span>
          <span className="tab-label">Info</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-label">Historial</span>
        </button>
      </nav>

      {/* FAB solo visible en tab de historial y si está autenticado */}
      {activeTab === 'history' && isAuthenticated && (
        <div className="fab-container">
          <button
            onClick={handleAddHistory}
            className="fab"
            aria-label="Agregar registro médico"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default PetDetail;
