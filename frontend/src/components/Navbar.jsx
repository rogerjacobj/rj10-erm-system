import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import bell from '../assets/Navbar/Bell_pin_fill.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navItems = [
    { to: '/events', label: 'Events' },
    { to: '/mission', label: 'Our Mission' },
    { to: '/tickets', label: 'Tickets' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <header className="flex items-center mr-2 p-4 md:p-6 font-mono" style={{ color: 'var(--color-text)' }}>
   
      <div className="mr-6 hidden md:block">
        <Link to="/login" className="login-pill inline-block text-center">Login</Link>
      </div>

      
      <button
        className="md:hidden p-2 mr-2"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
      >
        <span
          className="block w-6 h-0.5 bg-current mb-1 transition-transform duration-300"
          style={{ transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }}
        />
        <span
          className="block w-6 h-0.5 bg-current mb-1 transition-opacity duration-200"
          style={{ opacity: open ? 0 : 1 }}
        />
        <span
          className="block w-6 h-0.5 bg-current transition-transform duration-300"
          style={{ transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
        />
      </button>

      {/* Centered Nav: use flex-1 and justify-center on md+ screens */}
      <nav className={`flex-1 ${open ? 'block' : 'hidden'} md:block`}>
        <ul className="flex flex-col md:flex-row md:justify-center md:items-center gap-4 md:gap-8 text-[var(--color-primary)]">
          {navItems.map((item, idx) => (
            <li key={item.to} className="list-none">
              <Link
                to={item.to}
                className="nav-link block px-3 py-2 rounded-3xl transition transform duration-300 hover:scale-105 hover:bg-[var(--color-highlight)] hover:text-[var(--color-text)]"
                style={{ transitionDelay: `${idx * 60}ms` }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right: bell */}
      <div className="ml-4">
        <img src={bell} alt="notifications" className="w-8" />
      </div>
    </header>
  );
};

export default Navbar;