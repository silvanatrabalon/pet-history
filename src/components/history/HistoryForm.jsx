import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUploader from './ImageUploader';
import './HistoryForm.css';

const HistoryForm = ({ petId, onSubmit, onCancel, loading = false, initialData = null }) => {
  const { vets, loadVets } = useData();
  const [formData, setFormData] = useState({
    petId: petId,
    fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    motivo: '',
    detalle: '',
    veterinaria: '',
    peso: '',
    medicacion: ''
  });

  const [imageFiles, setImageFiles] = useState([]);

  // Cargar veterinarias
  useEffect(() => {
    loadVets();
  }, [loadVets]);

  // Cargar datos iniciales si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        petId: initialData.petId,
        fecha: initialData.fecha || new Date().toISOString().split('T')[0],
        motivo: initialData.motivo || '',
        detalle: initialData.detalle || '',
        veterinaria: initialData.veterinaria || '',
        peso: initialData.peso || '',
        medicacion: initialData.medicacion || ''
      });
    }
  }, [initialData]);

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
        label="Motivo de Consulta"
        name="motivo"
        type="text"
        value={formData.motivo}
        onChange={handleChange}
        placeholder="Ej: Control anual, Vacunación, Consulta por vómitos..."
        required
      />

      <Input
        label="Detalle"
        name="detalle"
        type="textarea"
        value={formData.detalle}
        onChange={handleChange}
        placeholder="Descripción detallada de la consulta, síntomas, diagnóstico, tratamiento..."
      />

      <div className="form-group">
        <label htmlFor="veterinaria" className="form-label">Veterinaria</label>
        <select
          id="veterinaria"
          name="veterinaria"
          value={formData.veterinaria}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Seleccionar veterinaria...</option>
          {vets.map((vet, index) => (
            <option key={index} value={vet.nombre}>
              {vet.nombre}{vet.especialidad ? ` - ${vet.especialidad}` : ''}
            </option>
          ))}
        </select>
      </div>

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
          {loading ? 'Guardando...' : (initialData ? 'Actualizar Registro' : 'Guardar Registro')}
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
