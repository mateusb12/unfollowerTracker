import React, { useState, useEffect, useRef } from 'react';

const SimpleCarousel = ({ images, interval = 3000, autoPlay = false }) => {
    const [current, setCurrent] = useState(0);
    const imgRef = useRef(null);

    useEffect(() => {
        let timer;
        if (autoPlay) {
            timer = setInterval(() => {
                setCurrent((prev) => (prev + 1) % images.length);
            }, interval);
        }
        return () => clearInterval(timer);
    }, [images.length, interval, autoPlay]);

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
                        {index === current && (
                            <img
                                src={img}
                                alt={`Slide ${index + 1}`}
                                ref={imgRef}
                            />
                        )}
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
