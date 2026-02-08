import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './Login.css';

const Login = () => {
  const { login, loading, error, isInitialized } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  if (!isInitialized || loading) {
    return (
      <div className="login-page">
        <LoadingSpinner message="Inicializando..." />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">🐾</div>
          <h1 className="login-title">Pet History</h1>
          <p className="login-subtitle">
            Historial clínico de tus mascotas
          </p>
        </div>

        <div className="login-content">
          {error && <ErrorMessage message={error} />}
          
          <Button
            onClick={handleLogin}
            variant="primary"
            fullWidth
            disabled={loading}
          >
            <span className="google-icon">G</span>
            Iniciar sesión con Google
          </Button>

          <p className="login-info">
            Necesitas una cuenta de Google para usar esta aplicación
          </p>
        </div>

        <div className="login-features">
          <div className="feature">
            <span className="feature-icon">📋</span>
            <span>Registra visitas médicas</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📸</span>
            <span>Adjunta imágenes</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📱</span>
            <span>Accede desde cualquier lugar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
