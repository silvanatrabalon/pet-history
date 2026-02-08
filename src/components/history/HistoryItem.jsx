import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, splitImageUrls } from '../../utils/helpers';
import './HistoryItem.css';

const HistoryItem = ({ record, petId }) => {
  const navigate = useNavigate();
  const imageUrls = splitImageUrls(record.imageUrls);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleEdit = () => {
    navigate(`/pets/${petId}/history/${record.historyId}/edit`);
  };

  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
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
              <img
                src={imageUrls[currentImageIndex]}
                alt={`Imagen ${currentImageIndex + 1}`}
                className="gallery-image"
              />
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
