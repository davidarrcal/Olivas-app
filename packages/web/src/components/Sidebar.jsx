import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: 'D' },
  { to: '/fincas', label: 'Fincas', icon: 'F' },
  { to: '/productos', label: 'Productos', icon: 'P' },
];

export default function Sidebar() {
  return (
    <nav>
      <ul className="sidebar-nav">
        {links.map(l => (
          <li key={l.to}>
            <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}