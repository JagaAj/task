import section1 from "../assets/slider/slider-1.jpg";
import section2 from "../assets/slider/slider-2.jpg";
import section3 from "../assets/slider/slider-3.jpg";
import section4 from "../assets/slider/slider-4.jpg";
import section5 from "../assets/slider/slider-5.jpg";
import React from "react";
import { useState, useRef, useEffect } from "react";

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const slides = [section1, section2, section3, section4, section5];
  const totalSlides = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.clientWidth * currentSlide,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  const handleNavClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="slider-container">
      <div className="slider-wrapper">
        <div className="slider" ref={sliderRef}>
          {slides.map((slide, index) => (
            <img key={index} src={slide} alt={`Slide ${index + 1}`} />
          ))}
        </div>
        <div className="slider-nav">
          {slides.map((_, index) => (
            <a
              key={index}
              href="#"
              onClick={() => handleNavClick(index)}
              style={{
                opacity: currentSlide === index ? 1 : 0.75,
                backgroundColor: currentSlide === index ? "#000" : "#fff",
              }}
            ></a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slider;
