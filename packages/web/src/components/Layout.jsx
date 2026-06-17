import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Olivas</h1>
          <span>Gestion de Olivar</span>
        </div>
        <Sidebar />
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}