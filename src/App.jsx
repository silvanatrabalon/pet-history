import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import PetsList from './pages/PetsList';
import NewPet from './pages/NewPet';
import EditPet from './pages/EditPet';
import PetDetail from './pages/PetDetail';
import AddHistory from './pages/AddHistory';
import EditHistory from './pages/EditHistory';
import VetsList from './pages/VetsList';
import './App.css';

// Componente para rutas protegidas (modo edición)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isInitialized } = useAuth();

  if (!isInitialized || loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    alert('Debes iniciar sesión para editar');
    return <Navigate to="/pets" replace />;
  }

  return children;
};

// Componente de rutas
const AppRoutes = () => {
  const { loading, isInitialized } = useAuth();

  if (!isInitialized || loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas públicas (modo observador) */}
      <Route path="/pets" element={<PetsList />} />
      <Route path="/pets/:id" element={<PetDetail />} />
      
      {/* Rutas protegidas (requieren autenticación para editar) */}
      <Route
        path="/pets/new"
        element={
          <ProtectedRoute>
            <NewPet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/:id/edit"
        element={
          <ProtectedRoute>
            <EditPet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/:petId/add-history"
        element={
          <ProtectedRoute>
            <AddHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/:petId/history/:historyId/edit"
        element={
          <ProtectedRoute>
            <EditHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vets"
        element={
          <ProtectedRoute>
            <VetsList />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/pets" replace />} />
      <Route path="*" element={<Navigate to="/pets" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter basename="/pet-history">
      <AuthProvider>
        <DataProvider>
          <div className="app">
            <AppRoutes />
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
