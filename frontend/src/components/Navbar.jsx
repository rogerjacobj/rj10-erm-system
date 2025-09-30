import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import bell from '../assets/Navbar/Bell_pin_fill.png';
import user from '../assets/Navbar/User_fill.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className='flex justify-around pt-6 mb-8 font-mono items-center' style={{ color: 'var(--color-text)' }}>
      <div 
        className="group border-3 rounded-full px-3 py-2 flex gap-2 cursor-pointer transition delay-200 ease"
        style={{ 
          borderColor: 'var(--color-primary)',
          borderWidth: '3px',
          borderStyle: 'solid'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
       <span><img src={user} alt="" className='w-7'/></span> 
  <Link to="" className='font-black text-lg login-link'>Login</Link>
      </div>
      <button
        className="md:hidden p-2 ml-2"
        aria-label="Toggle navigation"
        onClick={() => setOpen(prev => !prev)}
      >
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current"></span>
      </button>

      <nav className="">
        <div className={`${open ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row justify-center gap-4 md:gap-20 items-center" style={{ color: 'var(--color-primary)' }}>
          <li 
            className="items1 cursor-pointer transition-transform duration-300 hover:scale-110 rounded-3xl px-3 py-2"
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-highlight)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Events
          </li>
          <li 
            className="items2 cursor-pointer transition-transform duration-300 hover:scale-110 rounded-3xl px-3 py-2"
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-highlight)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Our Mission
          </li>
          <li 
            className="items3 cursor-pointer transition-transform duration-300 hover:scale-110 rounded-3xl px-3 py-2"
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-highlight)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Tickets
          </li>
          <li 
            className="items4 cursor-pointer transition-transform duration-300 hover:scale-110 rounded-3xl px-3 py-2"
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-highlight)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Blog
          </li>
          </ul>
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <div className="notification">
          <img src={bell} alt="" className='w-8'/>
        </div>
      </div>
    </header>
  )
}

export default Navbar