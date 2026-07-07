import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AsistenteIA from './components/AsistenteIA';
import './styles.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh', gap: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>🌱</div>
        <div style={{ color: '#6b7c6b' }}>Cargando...</div>
        <div style={{ color: '#999', fontSize: '0.85rem' }}>Si es la primera vez, el servidor puede tardar 30 segundos en despertar</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
        <Route path="/bancales/:id" element={<BancalDetalle />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/meteo" element={<Meteo />} />
        <Route path="/economia" element={<Economia />} />
        <Route path="/maquinaria" element={<Maquinaria />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/informes" element={<Informes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function AppShell() {
  const { user } = useAuth();
  return (
    <>
      <AppRoutes />
      {user && <AsistenteIA />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ToastProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}