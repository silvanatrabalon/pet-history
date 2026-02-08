import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import googleDriveService from '../services/googleDrive';
import PetForm from '../components/pets/PetForm';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './NewPet.css'; // Reutilizamos los mismos estilos

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPetById, updatePet, loadPets } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pet, setPet] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadPetData();
    // eslint-disable-next-line
  }, [id]);

  const loadPetData = async () => {
    try {
      // Forzar recarga para obtener los datos más recientes del Sheet
      await loadPets(true);
      const petData = getPetById(id);
      console.log('🐾 Pet data cargado para edición:', petData);
      setPet(petData);
    } catch (err) {
      console.error('Error cargando mascota:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mantener datos originales y solo actualizar lo que viene del formulario
      const updatedData = {
        petId: pet.petId,
        nombre: formData.nombre || pet.nombre,
        nickname: formData.nickname || '', // Guardar tal cual viene del form
        especie: formData.especie || pet.especie,
        raza: formData.raza || '',
        nacimiento: formData.nacimiento || '', // Guardar tal cual viene del form
        sexo: formData.sexo || pet.sexo,
        notas: formData.notas || '',
        createdAt: pet.createdAt,
        photoUrl: formData.photoFile ? '' : pet.photoUrl // Se actualizará después si hay nueva foto
      };

      // Si hay una nueva foto, subirla primero
      if (formData.photoFile) {
        try {
          const result = await googleDriveService.uploadImage(
            formData.photoFile,
            `pet_${pet.petId}_${Date.now()}`
          );
          updatedData.photoUrl = result.url;
        } catch (err) {
          console.error('Error subiendo foto:', err);
          // Continuar sin la foto
        }
      }
      
      await updatePet(id, updatedData);
      navigate(`/pets/${id}`);
    } catch (err) {
      setError('Error al actualizar la mascota. Intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/pets/${id}`);
  };

  if (initialLoading) {
    return (
      <div className="page">
        <LoadingSpinner message="Cargando..." />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="page">
        <header className="page-header">
          <Button onClick={() => navigate('/pets')} variant="outline">
            ← Volver
          </Button>
        </header>
        <div className="page-content">
          <p>Mascota no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="back-btn"
          >
            ← Volver
          </Button>
          <h1 className="page-title">Editar Mascota</h1>
        </div>
      </header>

      <main className="page-content">
        <div className="form-container">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}
          
          <PetForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            initialData={pet}
          />
        </div>
      </main>
    </div>
  );
};

export default EditPet;
