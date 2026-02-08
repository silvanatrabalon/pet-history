import React from 'react';
import { formatAge, formatDate } from '../../utils/helpers';
import './PetProfile.css';

const PetProfile = ({ pet }) => {
  if (!pet) {
    return <div className="pet-profile-empty">Mascota no encontrada</div>;
  }

  const displayName = pet.nickname || pet.nombre;

  return (
    <div className="pet-profile">
      <div className="pet-profile-header">
        <div className="pet-profile-avatar">
          {pet.photoUrl ? (
            <img src={pet.photoUrl} alt={displayName} className="pet-profile-photo" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        <h1 className="pet-profile-name">{displayName}</h1>
        {pet.nickname && pet.nombre !== pet.nickname && (
          <p className="pet-profile-fullname">{pet.nombre}</p>
        )}
      </div>

      <div className="pet-profile-info">
        <div className="info-row">
          <span className="info-label">Especie</span>
          <span className="info-value">{pet.especie}</span>
        </div>

        {pet.raza && (
          <div className="info-row">
            <span className="info-label">Raza</span>
            <span className="info-value">{pet.raza}</span>
          </div>
        )}

        {pet.nacimiento && (
          <>
            <div className="info-row">
              <span className="info-label">Edad</span>
              <span className="info-value">{formatAge(pet.nacimiento)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nacimiento</span>
              <span className="info-value">{formatDate(pet.nacimiento)}</span>
            </div>
          </>
        )}

        {pet.sexo && (
          <div className="info-row">
            <span className="info-label">Sexo</span>
            <span className="info-value">{pet.sexo}</span>
          </div>
        )}

        {pet.notas && (
          <div className="info-row info-row-full">
            <span className="info-label">Notas</span>
            <p className="info-value info-notes">{pet.notas}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfile;
