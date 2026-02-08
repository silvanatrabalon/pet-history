import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUploader from './ImageUploader';
import './HistoryForm.css';

const HistoryForm = ({ petId, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    petId: petId,
    fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    diagnostico: '',
    peso: '',
    medicacion: ''
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (files) => {
    setImageFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, imageFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="history-form">
      <Input
        label="Fecha"
        name="fecha"
        type="date"
        value={formData.fecha}
        onChange={handleChange}
        required
      />

      <Input
        label="Diagnóstico"
        name="diagnostico"
        type="textarea"
        value={formData.diagnostico}
        onChange={handleChange}
        placeholder="Descripción de la consulta, síntomas, diagnóstico..."
        required
      />

      <Input
        label="Peso (kg)"
        name="peso"
        type="number"
        step="0.1"
        value={formData.peso}
        onChange={handleChange}
        placeholder="Ej: 15.5"
      />

      <Input
        label="Medicación"
        name="medicacion"
        type="textarea"
        value={formData.medicacion}
        onChange={handleChange}
        placeholder="Medicamentos recetados, dosis, indicaciones..."
      />

      <ImageUploader
        onChange={handleImagesChange}
        maxFiles={5}
      />

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Guardando...' : 'Guardar Registro'}
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

export default HistoryForm;
