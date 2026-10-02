import { NavLink } from 'react-router-dom';
const links = [['/', 'Dashboard', true], ['/enquiries', 'Enquiries', true], ['/enquiries/new', 'Add Enquiry', true]];
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">B</span>BusinessDesk</div>
      <nav>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>{label}</NavLink>
        ))}
      </nav>
    </aside>
  );
}
