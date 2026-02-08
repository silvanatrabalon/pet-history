import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PetCard.css';

const PetCard = ({ pet }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pets/${pet.petId}`);
  };

  const displayName = pet.nickname || pet.nombre;

  return (
    <div className="pet-card" onClick={handleClick}>
      {pet.photoUrl ? (
        <img 
          src={pet.photoUrl} 
          alt={displayName} 
          className="pet-card-photo"
        />
      ) : (
        <div className="pet-card-placeholder">
          <span className="pet-placeholder-icon">
            {pet.especie === 'Perro' ? '🐕' : pet.especie === 'Gato' ? '🐱' : '🐾'}
          </span>
        </div>
      )}
      <div className="pet-card-name">
        {displayName}
      </div>
    </div>
  );
};

export default PetCard;
