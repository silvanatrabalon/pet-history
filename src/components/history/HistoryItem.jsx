import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, splitImageUrls } from '../../utils/helpers';
import googleDriveService from '../../services/googleDrive';
import './HistoryItem.css';

const HistoryItem = ({ record, petId }) => {
  const navigate = useNavigate();
  const imageUrls = splitImageUrls(record.imageUrls);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageBlob, setCurrentImageBlob] = useState(null);

  // Función para extraer el fileId de diferentes formatos de URL de Drive
  const extractFileId = (url) => {
    // Formato: https://lh3.googleusercontent.com/d/FILE_ID
    if (url.includes('googleusercontent.com/d/')) {
      return url.split('/d/')[1].split('?')[0];
    }
    // Formato: https://drive.google.com/uc?export=view&id=FILE_ID
    if (url.includes('drive.google.com/uc') && url.includes('id=')) {
      return url.split('id=')[1].split('&')[0];
    }
    // Formato: https://drive.google.com/file/d/FILE_ID
    if (url.includes('drive.google.com/file/d/')) {
      return url.split('/d/')[1].split('/')[0];
    }
    return null;
  };

  // Cargar imagen como blob cuando cambia el índice
  useEffect(() => {
    if (!showGallery) return;

    const loadImage = async () => {
      setImageLoaded(false);
      setImageError(false);
      
      try {
        const currentUrl = imageUrls[currentImageIndex];
        const fileId = extractFileId(currentUrl);
        
        if (!fileId) {
          console.error('No se pudo extraer el fileId de:', currentUrl);
          setImageError(true);
          return;
        }

        console.log('🖼️ Cargando imagen con fileId:', fileId);
        const blobUrl = await googleDriveService.getImageBlob(fileId);
        setCurrentImageBlob(blobUrl);
        setImageLoaded(true);
      } catch (error) {
        console.error('Error cargando imagen:', error);
        setImageError(true);
      }
    };

    loadImage();

    // Cleanup: liberar el blob URL anterior
    return () => {
      if (currentImageBlob) {
        URL.revokeObjectURL(currentImageBlob);
      }
    };
  }, [showGallery, currentImageIndex]);

  const handleEdit = () => {
    navigate(`/pets/${petId}/history/${record.historyId}/edit`);
  };

  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
    if (currentImageBlob) {
      URL.revokeObjectURL(currentImageBlob);
      setCurrentImageBlob(null);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <>
      <div className="history-item">
        <div className="history-header">
          <span className="history-date">{formatDate(record.fecha)}</span>
          <button 
            onClick={handleEdit} 
            className="edit-history-btn"
            title="Editar registro"
          >
            ✏️
          </button>
        </div>

        {record.diagnostico && (
          <div className="history-section">
            <h4 className="history-section-title">Diagnóstico</h4>
            <p className="history-text">{record.diagnostico}</p>
          </div>
        )}

        {record.peso && (
          <div className="history-detail">
            <span className="history-icon">⚖️</span>
            <span className="history-detail-text">Peso: {record.peso} kg</span>
          </div>
        )}

        {record.medicacion && (
          <div className="history-section">
            <h4 className="history-section-title">Medicación</h4>
            <p className="history-text">{record.medicacion}</p>
          </div>
        )}

        {imageUrls.length > 0 && (
          <div className="history-images-button-container">
            <button
              onClick={() => openGallery(0)}
              className="view-images-button"
              type="button"
            >
              📷 Ver imágenes ({imageUrls.length})
            </button>
          </div>
        )}
      </div>

      {showGallery && (
        <div 
          className="image-gallery-modal" 
          onClick={closeGallery}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={closeGallery}>
              ✕
            </button>
            
            <div className="gallery-image-container">
              {!imageLoaded && !imageError && (
                <div className="gallery-loading">
                  <div className="spinner"></div>
                  <p>Cargando imagen...</p>
                </div>
              )}
              
              {imageError ? (
                <div className="gallery-error">
                  <span className="error-icon">⚠️</span>
                  <p>No se pudo cargar la imagen</p>
                  <small>Intenta abrirla con el botón de abajo</small>
                </div>
              ) : (
                imageLoaded && currentImageBlob && (
                  <img
                    src={currentImageBlob}
                    alt={`Imagen ${currentImageIndex + 1}`}
                    className="gallery-image"
                  />
                )
              )}
            </div>

            {imageUrls.length > 1 && (
              <>
                <button className="gallery-nav gallery-prev" onClick={prevImage}>
                  ‹
                </button>
                <button className="gallery-nav gallery-next" onClick={nextImage}>
                  ›
                </button>
                <div className="gallery-counter">
                  {currentImageIndex + 1} / {imageUrls.length}
                </div>
              </>
            )}

            <div className="gallery-actions">
              <a
                href={imageUrls[currentImageIndex]}
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-action-btn"
              >
                🔗 Abrir original
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryItem;
