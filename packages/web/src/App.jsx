import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Fincas from './pages/Fincas';
import FincaDetalle from './pages/FincaDetalle';
import BancalDetalle from './pages/BancalDetalle';
import Productos from './pages/Productos';
import Meteo from './pages/Meteo';
import Economia from './pages/Economia';
import Maquinaria from './pages/Maquinaria';
import Inventario from './pages/Inventario';
import Calendario from './pages/Calendario';
import Informes from './pages/Informes';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { ToastProvider } from './context/ToastContext';
import './styles.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '2rem' }}>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fincas" element={<Fincas />} />
        <Route path="/fincas/:id" element={<FincaDetalle />} />
        <Route path="/fincas/:id/meteo" element={<Meteo />} />
        <Route path="/fincas/:id/economia" element={<Economia />} />
        <Route path="/fincas/:id/maquinaria" element={<Maquinaria />} />
        <Route path="/fincas/:id/inventario" element={<Inventario />} />
        <Route path="/fincas/:id/calendario" element={<Calendario />} />
        <Route path="/fincas/:id/informes" element={<Informes />} />
        <Route path="/bancales/:id" element={<BancalDetalle />} />
        <Route path="/productos" element={<Productos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}