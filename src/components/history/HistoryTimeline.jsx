import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import HistoryDetail from './HistoryDetail';
import './HistoryTimeline.css';

const HistoryTimeline = ({ history, petId }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Ordenar por fecha descendente (más reciente primero)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.fecha) - new Date(a.fecha)
  );

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseDetail = () => {
    setSelectedRecord(null);
  };

  if (history.length === 0) {
    return (
      <div className="timeline-empty">
        <div className="empty-icon">📝</div>
        <p className="empty-text">No hay registros médicos aún</p>
      </div>
    );
  }

  return (
    <>
      <div className="history-timeline">
        {sortedHistory.map((record, index) => (
          <div 
            key={record.historyId} 
            className="timeline-item"
            onClick={() => handleRecordClick(record)}
          >
            <div className="timeline-marker">
              <div className="timeline-dot"></div>
              {index < sortedHistory.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <div className="timeline-date">{formatDate(record.fecha)}</div>
              <div className="timeline-diagnosis">
                {record.diagnostico || 'Sin diagnóstico registrado'}
              </div>
              <div className="timeline-arrow">›</div>
            </div>
          </div>
        ))}
      </div>

      {selectedRecord && (
        <HistoryDetail 
          record={selectedRecord} 
          petId={petId}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default HistoryTimeline;
