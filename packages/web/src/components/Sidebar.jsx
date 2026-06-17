import { NavLink } from 'react-router-dom';

const sections = [
  {
    title: null,
    links: [
      { to: '/', label: 'Dashboard', icon: '📊' },
      { to: '/fincas', label: 'Fincas', icon: '🏡' },
    ]
  },
  {
    title: 'Gestion',
    links: [
      { to: '/meteo', label: 'Meteo', icon: '🌤' },
      { to: '/economia', label: 'Economia', icon: '💶' },
      { to: '/maquinaria', label: 'Maquinaria', icon: '🚜' },
      { to: '/inventario', label: 'Inventario', icon: '📦' },
      { to: '/productos', label: 'Productos', icon: '🧪' },
    ]
  },
  {
    title: 'Planificacion',
    links: [
      { to: '/calendario', label: 'Calendario', icon: '📅' },
      { to: '/informes', label: 'Informes', icon: '📄' },
    ]
  }
];

export default function Sidebar() {
  return (
    <nav>
      {sections.map((section, i) => (
        <div key={i}>
          {section.title && (
            <div style={{
              padding: '0.75rem 1.5rem 0.3rem',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: '600'
            }}>
              {section.title}
            </div>
          )}
          <ul className="sidebar-nav">
            {section.links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="nav-icon">{l.icon}</span>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}