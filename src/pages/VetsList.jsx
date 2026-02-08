import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './VetsList.css';

const VetsList = () => {
  const navigate = useNavigate();
  const { vets, loadVets, addVet, updateVet, deleteVet, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingVet, setEditingVet] = useState(null);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    contacto: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    loadVets();
  }, [loadVets]);

  const handleBack = () => {
    navigate('/pets');
  };

  const openAddModal = () => {
    setEditingVet(null);
    setEditingRowIndex(null);
    setFormData({ nombre: '', especialidad: '', contacto: '' });
    setShowModal(true);
  };

  const openEditModal = (vet) => {
    console.log('📝 Editando veterinaria:', vet);
    setEditingVet(vet);
    setEditingRowIndex(vet.rowIndex);
    setFormData({
      nombre: vet.nombre,
      especialidad: vet.especialidad,
      contacto: vet.contacto
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVet(null);
    setEditingRowIndex(null);
    setFormData({ nombre: '', especialidad: '', contacto: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setFormLoading(true);
      
      if (editingRowIndex) {
        console.log('🔄 Actualizando con rowIndex:', editingRowIndex, 'datos:', formData);
        await updateVet(editingRowIndex, formData);
      } else {
        await addVet(formData);
      }
      
      closeModal();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (vet) => {
    try {
      setFormLoading(true);
      await deleteVet(vet.rowIndex);
      setShowDeleteConfirm(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <Button onClick={handleBack} variant="outline">
            ← Volver
          </Button>
          <h1 className="page-title">Veterinarias</h1>
          <button 
            onClick={openAddModal} 
            className="add-vet-btn"
          >
            + Agregar
          </button>
        </div>
      </header>

      <main className="page-content">
        {loading && <LoadingSpinner message="Cargando veterinarias..." />}

        {!loading && vets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏥</div>
            <h2 className="empty-title">No hay veterinarias registradas</h2>
            <p className="empty-text">
              Comienza agregando la primera veterinaria
            </p>
          </div>
        )}

        {!loading && vets.length > 0 && (
          <div className="vets-list">
            {vets.filter(v => v.nombre).map((vet, index) => (
              <div key={`${vet.rowIndex}-${vet.nombre}-${index}`} className="vet-card">
                <div className="vet-card-header">
                  <h3 className="vet-name">{vet.nombre}</h3>
                  <div className="vet-actions">
                    <button 
                      className="vet-action-btn edit" 
                      onClick={() => openEditModal(vet)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="vet-action-btn delete" 
                      onClick={() => setShowDeleteConfirm(vet)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {vet.especialidad && (
                  <p className="vet-detail">
                    <span className="vet-label">Especialidad:</span> {vet.especialidad}
                  </p>
                )}
                {vet.contacto && (
                  <p className="vet-detail">
                    <span className="vet-label">Contacto:</span> {vet.contacto}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal para agregar/editar */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingVet ? 'Editar Veterinaria' : 'Agregar Veterinaria'}</h2>
            
            <form onSubmit={handleSubmit} className="vet-form">
              <Input
                label="Nombre *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre de la veterinaria"
                required
              />
              
              <Input
                label="Especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                placeholder="Ej: General, Exóticos, Emergencias"
              />
              
              <Input
                label="Contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                placeholder="Teléfono o email"
              />

              <div className="modal-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={formLoading}
                  fullWidth
                >
                  {formLoading ? 'Guardando...' : (editingVet ? 'Actualizar' : 'Guardar')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  disabled={formLoading}
                  fullWidth
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content delete-confirm" onClick={(e) => e.stopPropagation()}>
            <h2>¿Eliminar veterinaria?</h2>
            <p className="delete-message">
              ¿Estás segura de que quieres eliminar <strong>{showDeleteConfirm.nombre}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                className="btn-delete"
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={formLoading}
              >
                {formLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={formLoading}
                fullWidth
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetsList;
