import React, { useState, useRef } from 'react';

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  if (!slides.length) return null;

  const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));

  // Swipe support
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove  = (e) => { touchEndX.current = e.touches[0].clientX; };
  const onTouchEnd   = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-9rem)] max-w-6xl mx-auto relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide */}
      <div className="w-full h-full">
        {slides[currentIndex]}
      </div>

      {/* Nav buttons — inside bounds, hidden on mobile */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 
              bg-black/40 hover:bg-black/60 text-white p-2 rounded-full 
              backdrop-blur-sm transition-all z-10"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 
              bg-black/40 hover:bg-black/60 text-white p-2 rounded-full 
              backdrop-blur-sm transition-all z-10"
          >
            ▶
          </button>

          {/* Dots — inside the container, anchored to bottom */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300
                  ${currentIndex === i ? 'bg-blue-500 w-4' : 'bg-gray-500 w-2'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
