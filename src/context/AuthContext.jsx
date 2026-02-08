/**
 * AuthContext - Maneja el estado de autenticación global
 * Provee información del usuario y métodos de login/logout
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import googleAuthService from '../services/googleAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar Google Auth al montar el componente
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      await googleAuthService.initialize();
      setIsInitialized(true);
      
      // Intentar restaurar sesión desde localStorage
      const restored = await googleAuthService.restoreSession();
      if (restored) {
        setUser(restored.user);
        console.log('✅ Sesión restaurada:', restored.user.email);
      }
      
      console.log('✅ Auth inicializado correctamente');
    } catch (err) {
      console.error('❌ Error inicializando auth:', err);
      setError('Error inicializando la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authData = await googleAuthService.login();
      setUser(authData.user);
      
      console.log('✅ Usuario autenticado:', authData.user.email);
      return authData.user;
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError('Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    googleAuthService.logout();
    setUser(null);
    console.log('✅ Sesión cerrada');
  };

  const value = {
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
