import React from "react";

const AboutMe = ({ classicHeader, darkTheme }) => {
  return (
    <section
      className={"section " + (darkTheme ? "bg-dark-1" : "")}
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
            About Me
          </h2>
          <p
            className={
              "text-9 text-dark fw-600 position-absolute w-100 align-self-center lh-base mb-0 " +
              (darkTheme ? "text-white" : "text-dark")
            }
          >
            {" "}
            About Me
            <span className="heading-separator-line border-bottom border-3 border-primary d-block mx-auto" />
          </p>
        </div>
        {/* Heading end*/}

        {/* About Me intro */}
        <div className="col-lg-10 mx-auto text-center" style={{ marginBottom: "50px" }}>
          <p
            className={
              "text-3 " +
              (darkTheme ? "text-white" : "text-dark")
            }
          >
            I'm a strategic technical lead combining solid experience in business operations with full stack development — uniquely positioned to bridge business strategy with technical execution. Currently architecting CRM ecosystems delivering business impact through AI-powered automation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
