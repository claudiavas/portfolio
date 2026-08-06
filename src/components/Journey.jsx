import React from "react";

const Journey = ({ classicHeader, darkTheme }) => {

  const chapters = [
    {
      src: "/images/about/Chapter1.png",
      title: "Fearless Beginner",
      content: "After high school, I completed a year-long programming course. A world full of challenges awaited me!"
    },
    {
      src: "/images/about/Chapter2.png",
      title: "Academic Adventures",
      content: "I enrolled in a prestigious university for Business Administration. A journey full of strategy and learning!"
    },
    {
      src: "/images/about/Chapter3.png",
      title: "The Multifaceted Expert",
      content: "With over 20 years of experience in Finance and Human Resources, I became a master of multitasking."
    },
    {
      src: "/images/about/Chapter4.png",
      title: "The Efficient Implementer",
      content: "During years problem-solving with an IT mindset, I implemented numerous systems."
    },
    {
      src: "/images/about/Chapter5.png",
      title: "From Code Curious to Full Stack Fan",
      content: "It's never too late to switch lanes and embrace the full stack life. Join me in my coding adventures!"
    }
  ];

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
            My Journey
          </h2>
          <p
            className={
              "text-9 text-dark fw-600 position-absolute w-100 align-self-center lh-base mb-0 " +
              (darkTheme ? "text-white" : "text-dark")
            }
          >
            {" "}
            My Journey
            <span className="heading-separator-line border-bottom border-3 border-primary d-block mx-auto" />
          </p>
        </div>
        {/* Heading end*/}

        {/* content start - Journey path */}
        <div className="col-lg-10 mx-auto" style={{ position: "relative" }}>
          {chapters.length > 0 &&
            chapters.map((chapter, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "30px",
                  alignItems: "center",
                  marginBottom: "35px",
                  paddingLeft: "0px",
                  backgroundColor: "transparent"
                }}
              >
                {/* Left: Circle with image - no background */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center", flexShrink: 0 }}>
                  <img
                    className="img-fluid d-inline-block w-auto"
                    src={chapter.src}
                    alt=""
                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                  />
                </div>

                {/* Right: Title and content */}
                <div>
                  <h3 className={"text-3 mb-2 fw-600 " + (darkTheme ? "text-white" : "")}>
                    {chapter.title}
                  </h3>
                  <p className={"text-3 mb-0 " + (darkTheme ? "text-white-50" : "")} style={{ lineHeight: "1.4", color: darkTheme ? "rgba(255, 255, 255, 0.6)" : "#666" }}>
                    {chapter.content}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {/* content end */}
      </div>
    </section>
  );
};

export default Journey;
