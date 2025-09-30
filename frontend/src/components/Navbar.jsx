import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import bell from '../assets/Navbar/Bell_pin_fill.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 font-mono" style={{ color: 'var(--color-text)' }}>
      {/* Login pill centered */}
      <div className="mb-3 md:mb-0">
        <Link to="" className="login-pill inline-block text-center">Login</Link>
      </div>

      {/* Hamburger (mobile) */}
      <button
        className="md:hidden p-2"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
      >
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current"></span>
      </button>

      {/* Nav */}
      <nav className={`${open ? 'block' : 'hidden'} md:block`}> 
        <ul className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-[var(--color-primary)]">
          <li className="cursor-pointer px-3 py-2 rounded-3xl">Events</li>
          <li className="cursor-pointer px-3 py-2 rounded-3xl">Our Mission</li>
          <li className="cursor-pointer px-3 py-2 rounded-3xl">Tickets</li>
          <li className="cursor-pointer px-3 py-2 rounded-3xl">Blog</li>
        </ul>
      </nav>

      {/* Right: bell */}
      <div className="mt-3 md:mt-0">
        <img src={bell} alt="notifications" className="w-8" />
      </div>
    </header>
  );
};

export default Navbar;