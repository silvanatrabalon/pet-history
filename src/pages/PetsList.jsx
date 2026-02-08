import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PetCard from '../components/pets/PetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './PetsList.css';

const PetsList = () => {
  const navigate = useNavigate();
  const { user, login, logout, isAuthenticated } = useAuth();
  const { pets, loading, error, loadPets } = useData();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const handleAddPet = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar mascotas');
      return;
    }
    navigate('/pets/new');
  };

  const handleVets = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para gestionar veterinarias');
      setMenuOpen(false);
      return;
    }
    setMenuOpen(false);
    navigate('/vets');
  };

  const handleLogin = async () => {
    setMenuOpen(false);
    try {
      await login();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Mis Mascotas</h1>
            {user ? (
              <p className="user-email">{user.email}</p>
            ) : (
              <p className="user-email">Modo Observador</p>
            )}
          </div>
          <div className="header-menu">
            <button onClick={toggleMenu} className="hamburger-btn" aria-label="Menú">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            {menuOpen && (
              <>
                <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
                <div className="dropdown-menu">
                  {isAuthenticated ? (
                    <>
                      <button onClick={handleVets} className="menu-item">
                        <span className="menu-icon">🏥</span>
                        <span>Veterinarias</span>
                      </button>
                      <button onClick={handleLogout} className="menu-item logout">
                        <span className="menu-icon">🚪</span>
                        <span>Salir</span>
                      </button>
                    </>
                  ) : (
                    <button onClick={handleLogin} className="menu-item">
                      <span className="menu-icon">🔑</span>
                      <span>Iniciar Sesión</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
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

      {isAuthenticated && (
        <div className="fab-container">
          <button
            onClick={handleAddPet}
            className="fab"
            aria-label="Agregar mascota"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default PetsList;
