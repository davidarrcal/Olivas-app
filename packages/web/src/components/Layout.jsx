import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-container">
      <button className={`hamburger ${menuOpen ? 'hidden' : ''}`} onClick={() => setMenuOpen(true)} aria-label="Menu">
        ☰
      </button>
      <div className={`sidebar-backdrop ${menuOpen ? 'open' : ''}`} onClick={closeMenu} />
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>Olivas</h1>
          <span>Gestion de Olivar</span>
        </div>
        <div onClick={closeMenu}>
          <Sidebar />
        </div>
        {user && (
          <div style={{
            padding: '1rem', borderTop: '1px solid #3a5a34', marginTop: 'auto',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: '#4a7c3f',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0
            }}>
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#d4e8d4', fontWeight: '500', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.nombre}
              </div>
              <div style={{ color: '#8faa8f', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            </div>
            <button
              onClick={() => { logout(); closeMenu(); }}
              title="Cerrar sesion"
              style={{
                background: 'none', border: 'none', color: '#8faa8f', cursor: 'pointer',
                fontSize: '1.1rem', padding: '0.2rem', flexShrink: 0
              }}
            >
              Logout
            </button>
          </div>
        )}
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}