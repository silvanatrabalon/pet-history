import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatAge } from '../../utils/helpers';
import './PetCard.css';

const PetCard = ({ pet }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pets/${pet.petId}`);
  };

  return (
    <div className="pet-card" onClick={handleClick}>
      <div className="pet-card-header">
        <div className="pet-avatar">
          {pet.nombre.charAt(0).toUpperCase()}
        </div>
        <div className="pet-info">
          <h3 className="pet-name">{pet.nombre}</h3>
          <p className="pet-species">{pet.especie} {pet.raza && `• ${pet.raza}`}</p>
        </div>
      </div>
      
      <div className="pet-card-details">
        {pet.edad && (
          <div className="pet-detail-item">
            <span className="detail-icon">🎂</span>
            <span>{formatAge(parseFloat(pet.edad))}</span>
          </div>
        )}
        {pet.sexo && (
          <div className="pet-detail-item">
            <span className="detail-icon">{pet.sexo === 'Macho' ? '♂' : '♀'}</span>
            <span>{pet.sexo}</span>
          </div>
        )}
      </div>

      {pet.notas && (
        <p className="pet-notes">{pet.notas}</p>
      )}
      
      <div className="pet-card-arrow">›</div>
    </div>
  );
};

export default PetCard;
