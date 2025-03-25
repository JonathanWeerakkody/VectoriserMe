// components/BeforeAfterSlider.js
import React, { useState, useEffect, useRef } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage, title }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md">
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 z-10">
          {title}
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-col-resize"
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before image (full width) */}
        <div className="absolute inset-0">
          <img 
            src={beforeImage} 
            alt="Before" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* After image (clipped by slider) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={afterImage} 
            alt="After" 
            className="w-full h-full object-contain"
            style={{ width: `${100 / (sliderPosition / 100)}%` }}
          />
        </div>
        
        {/* Slider control */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
