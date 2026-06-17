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
import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
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
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}