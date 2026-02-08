import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, splitImageUrls } from '../../utils/helpers';
import googleDriveService from '../../services/googleDrive';
import './HistoryDetail.css';

const HistoryDetail = ({ record, petId, onClose }) => {
  const navigate = useNavigate();
  const { vets, loadVets } = useData();
  const { isAuthenticated } = useAuth();
  const imageUrls = splitImageUrls(record.imageUrls);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageBlob, setCurrentImageBlob] = useState(null);
  const [showVetInfo, setShowVetInfo] = useState(false);

  useEffect(() => {
    loadVets();
  }, [loadVets]);

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
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para editar');
      return;
    }
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
            {/* Tabla de información principal */}
            <div className="detail-table">
              <div className="detail-table-row">
                <div className="detail-table-cell header">Fecha</div>
                <div className="detail-table-cell">{formatDate(record.fecha)}</div>
              </div>

              {record.peso && (
                <div className="detail-table-row">
                  <div className="detail-table-cell header">Peso</div>
                  <div className="detail-table-cell">{record.peso} kg</div>
                </div>
              )}

              {record.veterinaria && (
                <div className="detail-table-row">
                  <div className="detail-table-cell header">
                    Vet
                    <button 
                      className="vet-info-toggle"
                      onClick={() => setShowVetInfo(!showVetInfo)}
                      type="button"
                      title="Ver información"
                    >
                      ⓘ
                    </button>
                  </div>
                  <div className="detail-table-cell">
                    {record.veterinaria}
                    {showVetInfo && (() => {
                      const vetInfo = vets.find(v => v.nombre === record.veterinaria);
                      return vetInfo && (vetInfo.especialidad || vetInfo.contacto) ? (
                        <div className="vet-info-inline">
                          {vetInfo.especialidad && (
                            <span className="vet-info-item">
                              <strong>Esp:</strong> {vetInfo.especialidad}
                            </span>
                          )}
                          {vetInfo.contacto && (
                            <span className="vet-info-item">
                              <strong>Tel:</strong> {vetInfo.contacto}
                            </span>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Secciones de texto expandido */}
            {record.motivo && (
              <div className="detail-text-section">
                <div className="detail-text-header">Motivo de Consulta</div>
                <div className="detail-text-content">{record.motivo}</div>
              </div>
            )}

            {record.detalle && (
              <div className="detail-text-section">
                <div className="detail-text-header">Detalle</div>
                <div className="detail-text-content">{record.detalle}</div>
              </div>
            )}

            {record.medicacion && (
              <div className="detail-text-section">
                <div className="detail-text-header">Medicación</div>
                <div className="detail-text-content">{record.medicacion}</div>
              </div>
            )}

            {/* Imágenes */}
            {imageUrls.length > 0 && (
              <button
                onClick={() => openGallery(0)}
                className="view-images-btn"
                type="button"
              >
                <span className="btn-icon">📷</span>
                <span>Ver imágenes ({imageUrls.length})</span>
              </button>
            )}
          </div>

          <div className="history-detail-actions">
            {isAuthenticated && (
              <button className="detail-action-btn edit" onClick={handleEdit}>
                ✏️ Editar
              </button>
            )}
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
