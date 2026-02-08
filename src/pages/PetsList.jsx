import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PetCard from '../components/pets/PetCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './PetsList.css';

const PetsList = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pets, loading, error, loadPets } = useData();

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const handleAddPet = () => {
    navigate('/pets/new');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Mis Mascotas</h1>
            {user && (
              <p className="user-email">{user.email}</p>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Salir
          </button>
        </div>
      </header>

      <main className="page-content">
        {loading && <LoadingSpinner message="Cargando mascotas..." />}
        
        {error && <ErrorMessage message={error} onRetry={loadPets} />}

        {!loading && !error && pets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🐾</div>
            <h2 className="empty-title">No hay mascotas registradas</h2>
            <p className="empty-text">
              Comienza agregando la primera mascota
            </p>
          </div>
        )}

        {!loading && !error && pets.length > 0 && (
          <div className="pets-grid">
            {pets.map(pet => (
              <PetCard key={pet.petId} pet={pet} />
            ))}
          </div>
        )}
      </main>

      <div className="fab-container">
        <button
          onClick={handleAddPet}
          className="fab"
          aria-label="Agregar mascota"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default PetsList;
