import React, { useState, useRef } from 'react';
import { isImageFile, formatFileSize } from '../../utils/helpers';
import './ImageUploader.css';

const ImageUploader = ({ onChange, maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validar que sean imágenes
    const validFiles = selectedFiles.filter(isImageFile);
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Solo se permiten archivos de imagen');
    }

    // Limitar cantidad de archivos
    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      alert(`Solo puedes subir hasta ${maxFiles} imágenes`);
      return;
    }

    // Crear previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    const updatedFiles = [...files, ...validFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    // Liberar memoria del preview
    URL.revokeObjectURL(previews[index]);
    
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange(updatedFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <label className="uploader-label">
        Imágenes
        <span className="uploader-hint">(Opcional, máx. {maxFiles})</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="file-input-hidden"
      />

      {previews.length > 0 && (
        <div className="preview-grid">
          {previews.map((preview, index) => (
            <div key={index} className="preview-item">
              <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="remove-button"
                aria-label="Eliminar imagen"
              >
                ✕
              </button>
              <div className="file-info">
                {formatFileSize(files[index].size)}
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length < maxFiles && (
        <button
          type="button"
          onClick={handleButtonClick}
          className="upload-button"
        >
          <span className="upload-icon">📷</span>
          {files.length === 0 ? 'Seleccionar imágenes' : 'Agregar más imágenes'}
        </button>
      )}

      {files.length > 0 && (
        <p className="files-count">
          {files.length} {files.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
