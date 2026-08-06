import "./App.scss";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import Home from "./components/Home";
import AboutMe from "./components/AboutMe";
import Journey from "./components/Journey";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import ClassicHeader from "./components/ClassicHeader";
import { commonConfig } from "./config/commonConfig";
import TermsAndConditions from "./components/TermsAndConditions";
import Disclaimer from "./components/Disclaimer";
import PreLoader from "./components/Preloader";
import { Tooltip } from "./components/Tooltip";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

const AppContent = ({ classicHeader, darkTheme, isLoading }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [containerCenter, setContainerCenter] = useState(null);

  useEffect(() => {
    const updateContainerCenter = () => {
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 768;
      const footerElement = document.querySelector("#footer");

      if (footerElement) {
        const rect = footerElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        setContainerCenter(centerX);
      }
    };

    updateContainerCenter();
    const resizeObserver = new ResizeObserver(updateContainerCenter);
    const footer = document.querySelector("#footer");
    if (footer) resizeObserver.observe(footer);

    window.addEventListener("resize", updateContainerCenter);
    return () => {
      window.removeEventListener("resize", updateContainerCenter);
      resizeObserver.disconnect();
    };
  }, [classicHeader]);

  const pages = [
    { path: "/", name: "home" },
    { path: "/about", name: "about" },
    { path: "/journey", name: "journey" },
    { path: "/skills", name: "skills" },
    { path: "/portfolio", name: "portfolio" },
    { path: "/contact", name: "contact" },
  ];

  const currentPageIndex = pages.findIndex(p => p.path === location.pathname);
  const nextPage = currentPageIndex < pages.length - 1 ? pages[currentPageIndex + 1] : null;
  const prevPage = currentPageIndex > 0 ? pages[currentPageIndex - 1] : null;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      style={{ position: "relative" }}
      className={classicHeader || isMobile ? "" : "side-header"}
    >
      {isLoading && <PreLoader></PreLoader>}

      <div id="main-wrapper">
        {isMobile ? (
          <MobileMenu darkTheme={darkTheme} />
        ) : classicHeader ? (
          <ClassicHeader></ClassicHeader>
        ) : (
          <Header></Header>
        )}

        <div id="content" role="main">
          <Routes>
            <Route path="/" element={<Home classicHeader={classicHeader} darkTheme={darkTheme} />} />
            <Route path="/about" element={<AboutMe classicHeader={classicHeader} darkTheme={darkTheme} />} />
            <Route path="/journey" element={<Journey classicHeader={classicHeader} darkTheme={darkTheme} />} />
            <Route path="/skills" element={<Skills classicHeader={classicHeader} darkTheme={darkTheme} />} />
            <Route path="/portfolio" element={<Portfolio classicHeader={classicHeader} darkTheme={darkTheme} />} />
            <Route path="/contact" element={<Contact classicHeader={classicHeader} darkTheme={darkTheme} />} />
          </Routes>
        </div>
        <Footer
          classicHeader={classicHeader}
          darkTheme={darkTheme}
        ></Footer>
      </div>

      {containerCenter && (
        <>
          {prevPage && (
            <a
              href="#prev"
              className="scroll-down-arrow text-white"
              style={{
                position: "fixed",
                bottom: "120px",
                left: containerCenter - 60,
                transform: "translateX(-50%) rotate(180deg)",
                zIndex: 99
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate(prevPage.path);
              }}
            >
              <span className="animated">
                <i className="fa fa-chevron-down" />
              </span>
            </a>
          )}

          {nextPage && (
            <a
              href="#next"
              className="scroll-down-arrow text-white"
              style={{
                position: "fixed",
                bottom: "120px",
                left: containerCenter + (prevPage ? 60 : 0),
                transform: "translateX(-50%)",
                zIndex: 99
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate(nextPage.path);
              }}
            >
              <span className="animated">
                <i className="fa fa-chevron-down" />
              </span>
            </a>
          )}
        </>
      )}

      <TermsAndConditions darkTheme={darkTheme}></TermsAndConditions>
      <Disclaimer darkTheme={darkTheme}></Disclaimer>
    </div>
  );
};

function App() {
  const classicHeader = commonConfig.classicHeader;
  const darkTheme = commonConfig.darkTheme;

  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setisLoading(false);
    }, 1000);
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppContent classicHeader={classicHeader} darkTheme={darkTheme} isLoading={isLoading} />
    </BrowserRouter>
  );
}

export default App;
