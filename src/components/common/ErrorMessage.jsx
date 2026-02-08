import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message || 'Ha ocurrido un error'}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-btn">
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
