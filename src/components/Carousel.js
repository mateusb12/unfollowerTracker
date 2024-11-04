// SimpleCarousel.js
import React, { useState, useEffect } from 'react';

const SimpleCarousel = ({ images, interval = 3000 }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, [images.length, interval]);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="simple-carousel">
            <div className="carousel-inner">
                {images.map((img, index) => (
                    <div
                        className={`carousel-item ${index === current ? 'active' : ''}`}
                        key={index}
                    >
                        {index === current && <img src={img} alt={`Slide ${index + 1}`} />}
                    </div>
                ))}
            </div>
            <button className="prev-button" onClick={prevSlide}>❮</button>
            <button className="next-button" onClick={nextSlide}>❯</button>
            <div className="dots">
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        className={`dot ${idx === current ? 'active' : ''}`}
                        onClick={() => setCurrent(idx)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default SimpleCarousel;
