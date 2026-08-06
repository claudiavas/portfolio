import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "./Tooltip";

const MobileMenu = ({ darkTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuOptions = [
    { text: "Home", path: "/" },
    { text: "About", path: "/about" },
    { text: "My Journey", path: "/journey" },
    { text: "Skills", path: "/skills" },
    { text: "Portfolio", path: "/portfolio" },
    { text: "Contact", path: "/contact" },
    { text: "Download CV", path: "/cv", isCV: true },
  ];

  const handleDownloadCV = (e) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = "/documents/resume.pdf";
    link.download = "Claudia_Vasquez_CV.pdf";
    link.click();
  };

  return (
    <>
      <div className={`mobile-header ${darkTheme ? "dark" : "light"}`}>
        <h3 className="mobile-name">Claudia Vásquez</h3>

        <div className="mobile-header-icons">
          <Tooltip text="LinkedIn" placement="bottom">
            <a
              href="https://linkedin.com/in/claudiavas/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin" />
            </a>
          </Tooltip>
          <Tooltip text="GitHub" placement="bottom">
            <a
              href="http://www.github.com/claudiavas"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github" />
            </a>
          </Tooltip>
        </div>

        <button
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isOpen && <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)} />}

      <nav className={`mobile-menu-drawer ${isOpen ? "open" : ""} ${darkTheme ? "dark" : "light"}`}>
        {menuOptions.map((option) =>
          option.isCV ? (
            <button
              key={option.path}
              className="mobile-nav-link cv-link"
              onClick={handleDownloadCV}
            >
              {option.text}
              <i className="fas fa-download" />
            </button>
          ) : (
            <Link
              key={option.path}
              to={option.path}
              className={`mobile-nav-link ${
                location.pathname === option.path ? "active" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {option.text}
            </Link>
          )
        )}
      </nav>
    </>
  );
};

export default MobileMenu;
