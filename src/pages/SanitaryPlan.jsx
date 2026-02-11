import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './SanitaryPlan.css';

const SanitaryPlan = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { pets, reminders, loadPets, loadReminders, addReminder, updateReminder, deleteReminder, loading } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    tipo: 'vacuna',
    detalle: '',
    fecha: ''
  });

  useEffect(() => {
    loadPets();
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    navigate('/pets');
  };

  const getPetColor = (petId) => {
    const colors = [
      '#E91E63', // Rosa
      '#9C27B0', // Púrpura
      '#3F51B5', // Azul índigo
      '#2196F3', // Azul
      '#00BCD4', // Cian
      '#009688', // Verde azulado
      '#4CAF50', // Verde
      '#8BC34A', // Verde claro
      '#CDDC39', // Lima
      '#FFC107', // Ámbar
      '#FF9800', // Naranja
      '#FF5722', // Naranja profundo
      '#F44336', // Rojo
      '#E91E63', // Rosa fuerte
      '#9C27B0', // Púrpura profundo
      '#673AB7'  // Púrpura oscuro
    ];
    const index = pets.findIndex(p => p.petId === petId);
    return colors[index % colors.length];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getRemindersForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return reminders.filter(r => r.fecha === dateStr);
  };

  const openAddModal = (date) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar reminders');
      return;
    }
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setEditingReminder(null);
    setFormData({ petId: '', tipo: 'vacuna', detalle: '', fecha: dateStr });
    setShowModal(true);
  };

  const openEditModal = (reminder) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para editar');
      return;
    }
    setEditingReminder(reminder);
    setFormData({
      petId: reminder.petId,
      tipo: reminder.tipo,
      detalle: reminder.detalle || '',
      fecha: reminder.fecha
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReminder(null);
    setFormData({ petId: '', tipo: 'vacuna', detalle: '', fecha: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.fecha) {
      alert('Pet y fecha son obligatorios');
      return;
    }

    try {
      if (editingReminder) {
        await updateReminder(editingReminder.rowIndex, {
          ...editingReminder,
          ...formData
        });
      } else {
        await addReminder(formData);
      }
      closeModal();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (reminder) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para eliminar');
      return;
    }
    try {
      await deleteReminder(reminder.rowIndex);
      closeModal();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayReminders = getRemindersForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      
      // Obtener el color del primer reminder (si hay)
      const bgColor = dayReminders.length > 0 ? getPetColor(dayReminders[0].petId) : 'transparent';
      const hasCompleted = dayReminders.some(r => r.completado);
      const hasMultiple = dayReminders.length > 1;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${dayReminders.length > 0 ? 'has-reminder' : ''} ${hasCompleted ? 'completed' : ''}`}
          style={{ 
            backgroundColor: dayReminders.length > 0 ? bgColor + '20' : 'transparent',
            borderColor: dayReminders.length > 0 ? bgColor : '#E5E7EB'
          }}
          onClick={() => isAuthenticated && (dayReminders.length > 0 ? openEditModal(dayReminders[0]) : openAddModal(date))}
        >
          <div className="day-number">{day}</div>
          {hasMultiple && <div className="multiple-indicator">+{dayReminders.length - 1}</div>}
          {hasCompleted && <div className="completed-check">✓</div>}
        </div>
      );
    }

    return (
      <>
        <div className="calendar-header">
          <button onClick={prevMonth} className="month-nav">←</button>
          <h2 className="month-title">{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="month-nav">→</button>
        </div>
        <div className="calendar-weekdays">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </>
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-content">
          <Button onClick={handleBack} variant="outline">
            ← Volver
          </Button>
          <h1 className="page-title">Plan Sanitario</h1>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      <main className="page-content">
        {loading && <LoadingSpinner message="Cargando plan sanitario..." />}

        {!loading && (
          <div className="calendar-container">
            {renderCalendar()}
          </div>
        )}

        {/* Leyenda de mascotas */}
        {pets.length > 0 && (
          <div className="pets-legend">
            <h3>Mascotas:</h3>
            <div className="legend-items">
              {pets.map(pet => (
                <div key={pet.petId} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: getPetColor(pet.petId) }}
                  ></div>
                  <span>{pet.nickname}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal para agregar/editar reminder */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingReminder ? 'Editar Reminder' : 'Agregar Reminder'}</h2>
            
            <form onSubmit={handleSubmit} className="reminder-form">
              <div className="form-group">
                <label>Mascota *</label>
                <select
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Selecciona una mascota</option>
                  {pets.map(pet => (
                    <option key={pet.petId} value={pet.petId}>
                      {pet.nickname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="vacuna">Vacuna</option>
                  <option value="desparasitacion">Desparasitación</option>
                </select>
              </div>

              <div className="form-group">
                <label>Detalle</label>
                <input
                  type="text"
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleChange}
                  placeholder="Ej: Antirrábica, Triple felina..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Fecha *</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              {editingReminder && (
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.completado}
                      onChange={(e) => setFormData(prev => ({ ...prev, completado: e.target.checked }))}
                    />
                    Completado
                  </label>
                </div>
              )}

              <div className="modal-actions">
                <Button type="submit" variant="primary" fullWidth>
                  {editingReminder ? 'Actualizar' : 'Guardar'}
                </Button>
                <Button type="button" variant="secondary" fullWidth onClick={closeModal}>
                  Cancelar
                </Button>
                {editingReminder && (
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => handleDelete(editingReminder)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanitaryPlan;
