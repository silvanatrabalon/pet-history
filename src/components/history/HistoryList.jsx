import React from 'react';
import HistoryItem from './HistoryItem';
import './HistoryList.css';

const HistoryList = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="history-empty">
        <div className="empty-icon">📋</div>
        <p className="empty-text">No hay registros médicos aún</p>
        <p className="empty-subtext">Agrega el primer evento médico de tu mascota</p>
      </div>
    );
  }

  // Ordenar por fecha más reciente primero
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.fecha) - new Date(a.fecha)
  );

  return (
    <div className="history-list">
      <h2 className="history-list-title">
        Historial Médico ({history.length})
      </h2>
      <div className="history-items">
        {sortedHistory.map((record) => (
          <HistoryItem key={record.historyId} record={record} />
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
