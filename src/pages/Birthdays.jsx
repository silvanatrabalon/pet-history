import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Birthdays.css';

const getDaysUntilBirthday = (nacimiento) => {
  if (!nacimiento) return null;
  const [, month, day] = nacimiento.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  let next = new Date(currentYear, month - 1, day);
  if (next < today) {
    next = new Date(currentYear + 1, month - 1, day);
  }

  const diff = Math.round((next - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const getNextBirthdayDate = (nacimiento) => {
  if (!nacimiento) return null;
  const [, month, day] = nacimiento.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  let next = new Date(currentYear, month - 1, day);
  if (next < today) {
    next = new Date(currentYear + 1, month - 1, day);
  }
  return next.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
};

const getTurningAge = (nacimiento) => {
  if (!nacimiento) return null;
  const [birthYear, month, day] = nacimiento.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  let next = new Date(currentYear, month - 1, day);
  if (next < today) {
    return currentYear + 1 - birthYear;
  }
  return currentYear - birthYear;
};

const Birthdays = () => {
  const navigate = useNavigate();
  const { pets, loadPets, loading } = useData();

  useEffect(() => {
    loadPets();
    // eslint-disable-next-line
  }, []);

  const petsWithBirthday = pets
    .filter(pet => pet.nacimiento)
    .map(pet => ({
      ...pet,
      daysUntil: getDaysUntilBirthday(pet.nacimiento),
      nextDate: getNextBirthdayDate(pet.nacimiento),
      turningAge: getTurningAge(pet.nacimiento),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const petsWithoutBirthday = pets.filter(pet => !pet.nacimiento);

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => navigate('/pets')} className="back-btn-plain">
            ← Volver
          </button>
          <h1 className="page-title">Cumpleaños</h1>
          <div style={{ width: 60 }} />
        </div>
      </header>

      <main className="page-content">
        {loading && <LoadingSpinner message="Cargando mascotas..." />}

        {!loading && petsWithBirthday.length === 0 && petsWithoutBirthday.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎂</div>
            <h2 className="empty-title">No hay mascotas registradas</h2>
          </div>
        )}

        {!loading && petsWithBirthday.length > 0 && (
          <div className="birthdays-list">
            {petsWithBirthday.map(pet => {
              const isToday = pet.daysUntil === 0;
              const displayName = pet.nickname || pet.nombre;
              return (
                <div
                  key={pet.petId}
                  className={`birthday-card ${isToday ? 'birthday-today' : ''}`}
                  onClick={() => navigate(`/pets/${pet.petId}`)}
                >
                  <div className="birthday-avatar">
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={displayName} className="birthday-photo" />
                    ) : (
                      <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="birthday-info">
                    <div className="birthday-name">{displayName}</div>
                    <div className="birthday-date">
                      {isToday ? '🎉 ¡Hoy es su cumpleaños!' : pet.nextDate}
                    </div>
                    <div className="birthday-meta">
                      {isToday
                        ? `Cumple ${pet.turningAge} ${pet.turningAge === 1 ? 'año' : 'años'}`
                        : `Cumple ${pet.turningAge} ${pet.turningAge === 1 ? 'año' : 'años'} · en ${pet.daysUntil} ${pet.daysUntil === 1 ? 'día' : 'días'}`}
                    </div>
                  </div>
                  {isToday && <div className="birthday-badge">🎂</div>}
                  {!isToday && pet.daysUntil <= 7 && (
                    <div className="birthday-soon">Próximo</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && petsWithoutBirthday.length > 0 && (
          <div className="birthdays-no-date">
            <p className="no-date-label">Sin fecha de nacimiento</p>
            {petsWithoutBirthday.map(pet => (
              <div
                key={pet.petId}
                className="birthday-card birthday-no-date"
                onClick={() => navigate(`/pets/${pet.petId}`)}
              >
                <div className="birthday-avatar birthday-avatar-gray">
                  {pet.photoUrl ? (
                    <img src={pet.photoUrl} alt={pet.nickname || pet.nombre} className="birthday-photo" />
                  ) : (
                    <span>{(pet.nickname || pet.nombre).charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="birthday-info">
                  <div className="birthday-name">{pet.nickname || pet.nombre}</div>
                  <div className="birthday-date birthday-date-unknown">Fecha desconocida</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Birthdays;
