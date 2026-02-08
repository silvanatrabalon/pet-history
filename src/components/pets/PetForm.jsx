import React, { useState, useRef } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { SPECIES, SEX_OPTIONS } from '../../utils/constants';
import { isImageFile } from '../../utils/helpers';
import './PetForm.css';

const PetForm = ({ onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    sexo: '',
    notas: '',
    photoFile: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file && isImageFile(file)) {
      setFormData(prev => ({ ...prev, photoFile: file }));
      setPhotoPreview(URL.createObjectURL(file));
    } else if (file) {
      alert('Por favor selecciona un archivo de imagen válido');
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setFormData(prev => ({ ...prev, photoFile: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="pet-form">
      <div className="photo-upload-section">
        <label className="input-label">Foto de Perfil (Opcional)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="file-input-hidden"
        />
        
        {photoPreview ? (
          <div className="photo-preview-container">
            <img src={photoPreview} alt="Preview" className="photo-preview" />
            <div className="photo-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Cambiar foto
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRemovePhoto}
                disabled={loading}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            fullWidth
          >
            📷 Seleccionar foto
          </Button>
        )}
      </div>

      <Input
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ej: Luna"
        required
      />

      <div className="input-group">
        <label htmlFor="especie" className="input-label">
          Especie<span className="required">*</span>
        </label>
        <select
          id="especie"
          name="especie"
          value={formData.especie}
          onChange={handleChange}
          required
          className="input-field"
        >
          <option value="">Seleccionar...</option>
          {SPECIES.map(species => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Raza"
        name="raza"
        value={formData.raza}
        onChange={handleChange}
        placeholder="Ej: Golden Retriever"
      />

      <Input
        label="Edad (años)"
        name="edad"
        type="number"
        step="0.1"
        value={formData.edad}
        onChange={handleChange}
        placeholder="Ej: 3.5"
      />

      <div className="input-group">
        <label htmlFor="sexo" className="input-label">Sexo</label>
        <select
          id="sexo"
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Seleccionar...</option>
          {SEX_OPTIONS.map(sex => (
            <option key={sex} value={sex}>
              {sex}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Notas"
        name="notas"
        type="textarea"
        value={formData.notas}
        onChange={handleChange}
        placeholder="Información adicional sobre la mascota..."
      />

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Guardando...' : 'Guardar Mascota'}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            fullWidth
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default PetForm;
