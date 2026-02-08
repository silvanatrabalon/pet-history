import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, splitImageUrls } from '../../utils/helpers';
import googleDriveService from '../../services/googleDrive';
import './HistoryDetail.css';

const HistoryDetail = ({ record, petId, onClose }) => {
  const navigate = useNavigate();
  const imageUrls = splitImageUrls(record.imageUrls);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageBlob, setCurrentImageBlob] = useState(null);

  const extractFileId = (url) => {
    if (url.includes('googleusercontent.com/d/')) {
      return url.split('/d/')[1].split('?')[0];
    }
    if (url.includes('drive.google.com/uc') && url.includes('id=')) {
      return url.split('id=')[1].split('&')[0];
    }
    if (url.includes('drive.google.com/file/d/')) {
      return url.split('/d/')[1].split('/')[0];
    }
    return null;
  };

  useEffect(() => {
    if (!showGallery) return;

    const loadImage = async () => {
      setImageLoaded(false);
      setImageError(false);
      
      try {
        const currentUrl = imageUrls[currentImageIndex];
        const fileId = extractFileId(currentUrl);
        
        if (!fileId) {
          setImageError(true);
          return;
        }

        const blobUrl = await googleDriveService.getImageBlob(fileId);
        setCurrentImageBlob(blobUrl);
        setImageLoaded(true);
      } catch (error) {
        console.error('Error cargando imagen:', error);
        setImageError(true);
      }
    };

    loadImage();

    return () => {
      if (currentImageBlob) {
        URL.revokeObjectURL(currentImageBlob);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="history-detail-overlay" onClick={onClose}>
        <div className="history-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="history-detail-header">
            <h3 className="history-detail-title">Detalle de Visita</h3>
            <button className="history-detail-close" onClick={onClose}>×</button>
          </div>

          <div className="history-detail-content">
            <div className="detail-row">
              <span className="detail-label">Fecha</span>
              <span className="detail-value">{formatDate(record.fecha)}</span>
            </div>

            {record.diagnostico && (
              <div className="detail-row detail-row-full">
                <span className="detail-label">Diagnóstico</span>
                <p className="detail-value detail-text">{record.diagnostico}</p>
              </div>
            )}

            {record.peso && (
              <div className="detail-row">
                <span className="detail-label">Peso</span>
                <span className="detail-value">{record.peso} kg</span>
              </div>
            )}

            {record.medicacion && (
              <div className="detail-row detail-row-full">
                <span className="detail-label">Medicación</span>
                <p className="detail-value detail-text">{record.medicacion}</p>
              </div>
            )}

            {imageUrls.length > 0 && (
              <div className="detail-images">
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

          <div className="history-detail-actions">
            <button className="detail-action-btn edit" onClick={handleEdit}>
              ✏️ Editar
            </button>
            <button className="detail-action-btn close" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {showGallery && (
        <div 
          className="image-gallery-modal" 
          onClick={closeGallery}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={closeGallery}>×</button>
            
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
                <button className="gallery-nav gallery-prev" onClick={prevImage}>‹</button>
                <button className="gallery-nav gallery-next" onClick={nextImage}>›</button>
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

export default HistoryDetail;
