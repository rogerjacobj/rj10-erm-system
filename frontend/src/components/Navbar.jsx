import { Link } from 'react-router-dom';
import bell from '../assets/Navbar/Bell_pin_fill.png';
import user from '../assets/Navbar/User_fill.png';

const Navbar = () => {

  return (
    <header className='flex justify-around pt-6 mb-8 font-mono' style={{ color: 'var(--color-text)' }}>
      <div 
        className="border-3 rounded-full px-3 py-2 flex gap-2 cursor-pointer transition delay-200 ease"
        style={{ 
          borderColor: 'var(--color-primary)',
          borderWidth: '3px',
          borderStyle: 'solid'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
       <span><img src={user} alt="" className='w-7'/></span> 
       <Link to="" className='font-black text-lg' style={{ color: 'var(--color-primary)' }}>Login</Link>
      </div>
      <nav className="">
        <ul className="flex justify-center gap-20" style={{ color: 'var(--color-primary)' }}>
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