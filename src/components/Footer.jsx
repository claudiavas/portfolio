import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = ({ classicHeader, darkTheme }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className={"footer-component " + (darkTheme ? "footer-dark bg-dark-1" : "")}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}
    >
      <div className="footer-inner">
        <div className="footer-content">
          <p className="footer-copyright">
            Copyright © {currentYear} {" "}
            <a
              href="/"
              className="fw-500"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Claudia Vásquez
            </a>
          </p>
          <ul className="footer-links">
            <li>
              <a
                className="nav-link"
                data-bs-toggle="modal"
                data-bs-target="#terms-policy"
                href="#terms-policy"
              >
                Terms &amp; Policy
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                data-bs-toggle="modal"
                data-bs-target="#disclaimer"
                href="#disclaimer"
              >
                Disclaimer
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
