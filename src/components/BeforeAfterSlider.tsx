import { useState, useRef, MouseEvent, TouchEvent } from 'react';


const slides = [
  { before: '/assets/before-1.png', after: '/assets/after-1.png', title: 'Living Room Transformation' },
  { before: '/assets/before-2.png', after: '/assets/after-2.png', title: 'Kitchen Deep Clean' },
];

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

export default function BeforeAfterSlider({ before, after }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl shadow-teal-500/10 select-none cursor-ew-resize"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <img src={after} alt="After cleaning" className="absolute w-full h-full object-cover pointer-events-none" loading="lazy" />
      <div 
        className="absolute w-full h-full object-cover overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={before} alt="Before cleaning" className="w-full h-full object-cover pointer-events-none" loading="lazy" />
      </div>
      <div 
        className="absolute top-0 bottom-0 w-1 bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)] cursor-ew-resize pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-teal-400 border-4 border-[#0D0D0D] shadow-lg flex items-center justify-center pointer-events-auto"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="h-4 w-1 bg-[#0D0D0D] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
