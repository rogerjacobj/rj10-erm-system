import { useState } from "react";
import arrow from "../assets/Footers/Arrow.png";
import moon from "../assets/Footers/moon.png";
import sun from "../assets/Footers/sun.png";
import { useTheme } from "../context/ThemeContext";
import "./Footer.css";

const Footer = () => {
  const [expanded, setExpanded] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="footer-container mt-10">
      <button
        onClick={handleClick}
        className={`arrow-button transition-transform duration-300 ${expanded ? "-rotate-90" : ""}`}
      >
        <img src={arrow} alt="arrow" className="arrow-img" />
      </button>

      <div className={`palette transition-all duration-300 ${expanded ? "open" : ""}`}>
        <div className="flex flex-col gap-10 py-4 transition-all duration-500">
          <button onClick={toggleTheme} className="transition-transform duration-500 hover:scale-110">
            <img src={isDark ? sun : moon} alt="theme toggle" className="w-6" />
          </button>
        </div>
      </div>

      <div className="footer-line"></div>
    </div>
  );
};

export default Footer;
