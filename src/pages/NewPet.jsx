import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PetForm from '../components/pets/PetForm';
import Button from '../components/common/Button';
import './NewPet.css';

const NewPet = () => {
  const navigate = useNavigate();
  const { addPet } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (petData) => {
    try {
      setLoading(true);
      setError(null);
      await addPet(petData);
      navigate('/pets');
    } catch (err) {
      setError('Error al guardar la mascota. Intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/pets');
  };

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
          <h1 className="page-title">Nueva Mascota</h1>
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
          />
        </div>
      </main>
    </div>
  );
};

export default NewPet;
