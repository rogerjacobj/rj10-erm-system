import Bros from '../assets/Hero/Handshake_Light.png'
import TalkingImage from '../assets/Hero/Talking.png'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'

const Home = () => {
  const { isDark } = useTheme();

  return (
    <div className='min-h-screen'>
        <header>
            <Navbar />
        </header>
        <section className="hero relative flex justify-between px-16 py-8  mt-20">
          <div className="flex flex-col gap-6 max-w-lg items-start z-10">
            <div className="small-text w-[30ch] tracking-tighter">
              <p>Bridge the gap between employees and HR. One platform for all your workplace conversations</p>
            </div>
            <div className="heading">
              <h1 className='text-4xl w-[12ch] font-bold text-left'>Making A Difference:</h1>
            </div>
            <div className="description">
              <h1 
                className='text-4xl w-[15ch] font-bold text-left'
                style={{ color: 'var(--color-primary)' }}
              >
                Communication Starts with You
              </h1>
            </div>
          </div>
          <div className="">
            <div className="text-4xl font-rubik w-[12ch] text-right relative top-10">
              <p className='capitalize font-bold'>
                A small act of <span className='underline' style={{ color: 'var(--color-primary)' }}>communication</span> is a big <span className='underline' style={{ color: 'var(--color-primary)' }}>difference</span> in someone's work life.
              </p>
            </div>
          </div>
          <img 
            key={isDark ? 'dark-image' : 'light-image'}
            src={isDark ? TalkingImage : Bros} 
            alt={isDark ? "People talking in dark mode" : "Handshake in light mode"} 
            className={`absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 opacity-80 pointer-events-none transition-all duration-300 ease-in-out ${isDark ? 'w-[380px] mt-11' : 'w-[550px]'}`}
            style={{zIndex: 1}}
          />
        </section>
        <footer>
          <Footer />
        </footer>
    </div>
  )
}

export default Home