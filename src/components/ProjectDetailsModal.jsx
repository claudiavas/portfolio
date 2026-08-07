import React, { useEffect, useRef } from "react";

import Slider from "react-slick";

const ProjectDetailsModal = ({ darkTheme, projectDetails }) => {
  const sliderRef = useRef();

  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    adaptiveHeight: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  useEffect(() => {
    sliderRef.current.slickGoTo(0);
  }, [projectDetails]);

  return (
    <>
      <div
        className="modal fade bg-dark-1"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div
            className={
              "modal-content " + (darkTheme ? "bg-dark-2 text-light" : "")
            }
          >
            <div className="modal-body">
              <button
                type="button"
                className={"btn-close " + (darkTheme ? "btn-close-white" : "")}
                data-bs-dismiss="modal"
                aria-label="Close"
              />
              <div
                className={
                  "container ajax-container " +
                  (darkTheme ? "bg-dark-2 text-light" : "")
                }
              >
                <h2
                  className={
                    "text-6 font-weight-600 text-center mb-4" +
                    (darkTheme ? " text-white" : "")
                  }
                >
                  {projectDetails?.title}
                </h2>
                <div className="row g-4">
                  <div className="col-md-7">
                    <Slider {...settings} ref={sliderRef}>
                      <div className="item">
                        <div className="img-frame">
                          <img
                            className="img-fluid"
                            alt=""
                            src={projectDetails?.thumbImage}
                          />
                        </div>
                      </div>
                      {projectDetails?.sliderImages?.length > 0 &&
                        projectDetails?.sliderImages?.map((image, index) => (
                          <div className="item" key={index}>
                            <div className="img-frame">
                              <img className="img-fluid" alt="" src={image} />
                            </div>
                          </div>
                        ))}
                    </Slider>
                  </div>
                  <div className="col-md-5">
                    <h4
                      className={
                        "text-4 font-weight-600" +
                        (darkTheme ? " text-white" : "")
                      }
                    >
                      Project Info:
                    </h4>
                    <p>{projectDetails?.projectInfo}</p>
                    <h4
                      className={
                        "text-4 font-weight-600 mt-4" +
                        (darkTheme ? " text-white" : "")
                      }
                    >
                      Project Details:
                    </h4>
                    <ul
                      className={
                        "list-style-2 " + (darkTheme ? "list-style-light" : "")
                      }
                    >
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Client:
                        </span>
                        {projectDetails?.client}
                      </li>
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Technologies:
                        </span>
                        {projectDetails?.technologies}
                      </li>
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Industry:
                        </span>
                        {projectDetails?.industry}
                      </li>
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Date:
                        </span>
                        {projectDetails?.date}
                      </li>
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          URL:
                        </span>
                        <a
                          href={projectDetails?.url?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {projectDetails?.url?.name}
                        </a>
                      </li>
                      {projectDetails?.socialLinks?.github && (
                        <li>
                          <span
                            className={
                              "text-dark font-weight-600 me-2" +
                              (darkTheme ? " text-white" : "")
                            }
                          >
                            Code:
                          </span>
                          <a
                            href={projectDetails?.socialLinks?.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub
                          </a>
                        </li>
                      )}
                    </ul>
                    <div className="row no-gutters align-items-center">
                      <div
                        className={
                          "col-auto text-dark font-weight-600" +
                          (darkTheme ? " text-white" : "")
                        }
                      >
                        Share:
                      </div>
                      <div className="col-auto">
                        <ul
                          className={
                            "social-icons" +
                            (darkTheme ? " social-icons-muted" : "")
                          }
                        >
                          {projectDetails?.socialLinks?.linkedin && (
                            <li className="social-icons-linkedin">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="LinkedIn"
                              >
                                <i className="fab fa-linkedin-in" />
                              </a>
                            </li>
                          )}
                          {projectDetails?.socialLinks?.github && (
                            <li className="social-icons-github">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="GitHub"
                              >
                                <i className="fab fa-github" />
                              </a>
                            </li>
                          )}
                          {projectDetails?.socialLinks?.whatsapp && (
                            <li className="social-icons-whatsapp">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="WhatsApp"
                              >
                                <i className="fab fa-whatsapp" />
                              </a>
                            </li>
                          )}
                          {projectDetails?.socialLinks?.instagram && (
                            <li className="social-icons-instagram">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="Instagram"
                              >
                                <i className="fab fa-instagram" />
                              </a>
                            </li>
                          )}
                          {projectDetails?.socialLinks?.facebook && (
                            <li className="social-icons-facebook">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="Facebook"
                              >
                                <i className="fab fa-facebook-f" />
                              </a>
                            </li>
                          )}
                          {projectDetails?.socialLinks?.twitter && (
                            <li className="social-icons-twitter">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="Twitter"
                              >
                                <i className="fab fa-twitter" />
                              </a>
                            </li>
                          )}
                          {projectDetails?.socialLinks?.google && (
                            <li className="social-icons-google">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.google}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="Google"
                              >
                                <i className="fab fa-google" />
                              </a>
                            </li>
                          )}
                          {projectDetails?.socialLinks?.mail && (
                            <li className="social-icons-email">
                              <a
                                data-toggle="tooltip"
                                href={projectDetails.socialLinks.mail}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-original-title="Email"
                              >
                                <i className="fas fa-envelope" />
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsModal;
