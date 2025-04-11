
import React, { useEffect, useRef } from 'react';

const StarField = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Clear existing stars
    container.innerHTML = '';
    
    // Create stars
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random position
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      
      // Random size
      const size = Math.random() * 2 + 1;
      
      // Apply styles
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      
      // Random animation delay
      star.style.animation = `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(star);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden"
    />
  );
};

export default StarField;
