import React, { useEffect, useRef, useState } from "react";
import Isotope from "isotope-layout";
import ProjectDetailsModal from "./ProjectDetailsModal";
const withUtm = (url, source, campaign) =>
  url +
  (url.includes("?") ? "&" : "?") +
  `utm_source=${source}&utm_medium=social&utm_campaign=${campaign}`;

const Portfolio = ({ classicHeader, darkTheme }) => {
  // init one ref to store the future isotope object
  const isotope = useRef();
  // store the filter keyword in a state
  const [filterKey, setFilterKey] = useState("*");
  const [imagesLoaded, setimagesLoaded] = useState(0);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState();

  const filters = {
    DESIGN: "Desing",
    BRAND: "Brand",
    PHOTOS: "Photos",
  };

  const projectsData = [
    {
      title: "Domus",
      projectInfo:
        "Domus is a real estate platform that connects buyers, sellers and agents. Full-stack web application with property listings, an interactive map (Leaflet), advanced filters powered by real Spanish geographic data (INE), saved searches with relevance scoring, dark mode and a bilingual interface (ES/EN). Fully responsive, tested end to end and deployed on Railway.",
      client: "personal",
      technologies: "React, Material UI, Leaflet, i18next (ES/EN), dark mode, Node.js, Express, MongoDB, JWT, Railway, Jest + Supertest, Playwright (E2E)",
      industry: "Web Development",
      date: "July, 2023",
      url: {
        name: "domus-frontend-production-f950.up.railway.app",
        link: "https://domus-frontend-production-f950.up.railway.app",
      },
      socialLinks: {
        linkedin:
          "https://www.linkedin.com/sharing/share-offsite/?url=" +
          encodeURIComponent(
            withUtm(
              "https://domus-frontend-production-f950.up.railway.app",
              "linkedin",
              "share_linkedin_domus"
            )
          ),
        github: "https://github.com/claudiavas/domus",
        whatsapp:
          "https://wa.me/?text=" +
          encodeURIComponent(
            "Domus — real estate platform: " +
              withUtm(
                "https://domus-frontend-production-f950.up.railway.app",
                "whatsapp",
                "share_whatsapp_domus"
              )
          ),
        instagram: "http://www.instagram.com/",
        facebook:
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(
            withUtm(
              "https://domus-frontend-production-f950.up.railway.app",
              "facebook",
              "share_facebook_domus"
            )
          ),
      },
      thumbImage: "images/projects/domus-desktop.png",
      sliderImages: [
        "images/projects/domus-map.png",
        "images/projects/domus-dark.png",
        "images/projects/domus-mobile.png",
      ],
      categories: [filters.BRAND],
    },
    {
      title: "Gift Cards API",
      projectInfo:
        "A REST API that automates reward delivery: it generates Amazon gift cards, encrypts them with AES-256-GCM the instant they are created, delivers them by email and keeps an append-only audit trail. Idempotency is enforced by the database (UNIQUE + ON CONFLICT), so a retry can never generate or pay for two cards. Any CRM or backoffice can trigger it. The live demo is interactive: every button fires a real HTTP request against the deployed API and shows the server's response.",
      client: "personal",
      technologies: "Node.js, Express, PostgreSQL, AES-256-GCM, Amazon Incentives API (AWS SigV4), SendGrid, Docker, Jest, GitHub Actions, Railway",
      industry: "Web Development",
      date: "August, 2026",
      url: {
        name: "gift-cards-api-production.up.railway.app",
        link: "https://gift-cards-api-production.up.railway.app",
      },
      socialLinks: {
        linkedin:
          "https://www.linkedin.com/sharing/share-offsite/?url=" +
          encodeURIComponent(
            withUtm(
              "https://gift-cards-api-production.up.railway.app",
              "linkedin",
              "share_linkedin_giftcards"
            )
          ),
        github: "https://github.com/claudiavas/gift-cards-api-demo",
        whatsapp:
          "https://wa.me/?text=" +
          encodeURIComponent(
            "Gift Cards API — automated reward delivery: " +
              withUtm(
                "https://gift-cards-api-production.up.railway.app",
                "whatsapp",
                "share_whatsapp_giftcards"
              )
          ),
        instagram: "http://www.instagram.com/",
        facebook:
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(
            withUtm(
              "https://gift-cards-api-production.up.railway.app",
              "facebook",
              "share_facebook_giftcards"
            )
          ),
      },
      thumbImage: "images/projects/giftcards-hero.png",
      sliderImages: [
        "images/projects/giftcards-flowchart.png",
        "images/projects/giftcards-playground.png",
        "images/projects/giftcards-security.png",
      ],
      categories: [filters.BRAND],
    },
    {
      title: "Project Title 3",
      projectInfo:
        "Quidam lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure. Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
      client: "Ruby Clinton",
      technologies: "iOS, HTML5, CSS3, PHP, Java",
      industry: "Art & Design",
      date: "July 16, 2019",
      url: {
        name: "www.example.com",
        link: "https://www.example.com",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/project-3.jpg",
      sliderImages: [
        "images/projects/project-3.jpg",
        "images/projects/project-5.jpg",
      ],
      categories: [filters.PHOTOS],
    },
    {
      title: "Project Title 4",
      projectInfo:
        "Quidam lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure. Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
      client: "Ruby Clinton",
      technologies: "iOS, HTML5, CSS3, PHP, Java",
      industry: "Art & Design",
      date: "July 16, 2019",
      url: {
        name: "www.example.com",
        link: "https://www.example.com",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/project-4.jpg",
      sliderImages: [
        "images/projects/project-1.jpg",
        "images/projects/project-4.jpg",
      ],
      categories: [filters.BRAND, filters.PHOTOS],
    },
    {
      title: "Project Title 5",
      projectInfo:
        "Quidam lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure. Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
      client: "Ruby Clinton",
      technologies: "iOS, HTML5, CSS3, PHP, Java",
      industry: "Art & Design",
      date: "July 16, 2019",
      url: {
        name: "www.example.com",
        link: "https://www.example.com",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/project-5.jpg",
      sliderImages: [
        "images/projects/project-1.jpg",
        "images/projects/project-5.jpg",
      ],
      categories: [filters.DESIGN],
    },
    {
      title: "Project Title 6",
      projectInfo:
        "Quidam lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure. Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
      client: "Ruby Clinton",
      technologies: "iOS, HTML5, CSS3, PHP, Java",
      industry: "Art & Design",
      date: "July 16, 2019",
      url: {
        name: "www.example.com",
        link: "https://www.example.com",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/project-6.jpg",
      sliderImages: [
        "images/projects/project-1.jpg",
        "images/projects/project-5.jpg",
      ],
      categories: [filters.BRAND],
    },
    {
      title: "Project Title 7",
      projectInfo:
        "Quidam lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure. Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
      client: "Ruby Clinton",
      technologies: "iOS, HTML5, CSS3, PHP, Java",
      industry: "Art & Design",
      date: "July 16, 2019",
      url: {
        name: "www.example.com",
        link: "https://www.example.com",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/project-7.jpg",
      sliderImages: [
        "images/projects/project-1.jpg",
        "images/projects/project-5.jpg",
      ],
      categories: [filters.DESIGN, filters.PHOTOS],
    },
  ];

  // initialize an Isotope object with configs
  useEffect(() => {
    isotope.current = new Isotope(".portfolio-filter", {
      itemSelector: ".filter-item",
      layoutMode: "masonry",
    });

    // cleanup
    return () => {
      isotope.current.destroy();
    };
  }, []);

  // handling filter key change
  useEffect(() => {
    if (imagesLoaded) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey, imagesLoaded]);

  const handleFilterKeyChange = (key) => () => setFilterKey(key);

  return (
    <>
      <section
        className={"section " + (darkTheme ? "bg-dark-2" : "bg-light")}
        style={{ paddingBottom: "80px" }}
      >
        <div className={"container " + (classicHeader ? "" : "px-lg-5")}>
          {/* Heading */}
          <div className="position-relative d-flex text-center mb-5">
            <h2
              className={
                "text-24  text-uppercase fw-600 w-100 mb-0 " +
                (darkTheme ? "text-muted opacity-1" : "text-light opacity-4")
              }
            >
              Portfolio
            </h2>
            <p
              className={
                "text-9 text-dark fw-600 position-absolute w-100 align-self-center lh-base mb-0 " +
                (darkTheme ? "text-white" : "text-dark")
              }
            >
              {" "}
              My Work
              <span className="heading-separator-line border-bottom border-3 border-primary d-block mx-auto" />
            </p>
          </div>
          {/* Heading end*/}
          {/* Filter Menu */}
          <ul
            className={
              "portfolio-menu nav nav-tabs justify-content-center border-bottom-0 mb-5 " +
              (darkTheme ? "nav-light" : "")
            }
          >
            <li className="nav-item">
              <button
                className={"nav-link text-3 " + (filterKey === "*" ? "active" : "")}
                onClick={handleFilterKeyChange("*")}
              >
                All
              </button>
            </li>
            {Object.keys(filters).map((oneKey, i) => (
              <li className="nav-item" key={i}>
                <button
                  className={
                    "nav-link text-3 " +
                    (filterKey === filters[oneKey] ? "active" : "")
                  }
                  onClick={handleFilterKeyChange(filters[oneKey])}
                >
                  {filters[oneKey]}
                </button>
              </li>
            ))}
          </ul>
          {/* Filter Menu end */}
          <div className="portfolio popup-ajax-gallery">
            <div className="row portfolio-filter filter-container g-4">
              {projectsData.length > 0 &&
                projectsData.map((project, index) => (
                  <div
                    className={
                      "col-sm-6 col-lg-4 filter-item " +
                      project.categories.join(" ")
                    }
                    key={index}
                  >
                    <div className="portfolio-box rounded">
                      <div className="portfolio-img rounded">
                        <img
                          onLoad={() => {
                            setimagesLoaded(imagesLoaded + 1);
                          }}
                          className="img-fluid d-block portfolio-image"
                          src={project.thumbImage}
                          alt=""
                        />
                        <div className="portfolio-overlay">
                          <a
                            className="popup-ajax stretched-link"
                            href=""
                            onClick={() => {
                              setSelectedProjectDetails(projectsData[index]);
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          />
                          <div className="portfolio-overlay-details">
                            <h5 className="text-white fw-400">
                              {project.title}
                            </h5>
                            <span className="text-light">Category</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      <div className="project-details-modal">
        {/* Modal */}
        <ProjectDetailsModal
          projectDetails={selectedProjectDetails}
          darkTheme={darkTheme}
        ></ProjectDetailsModal>
      </div>
    </>
  );
};

export default Portfolio;
