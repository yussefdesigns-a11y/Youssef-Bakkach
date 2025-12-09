import React from 'react';

interface MascotProps {
  emotion: 'happy' | 'sad' | 'neutral' | 'excited';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({ emotion, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  // Simple SVG representation of a green owl-like mascot
  return (
    <div className={`${sizeClasses[size]} ${className} relative transition-all duration-300`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <path
          d="M20,90 Q10,90 10,80 L10,40 Q10,10 50,10 Q90,10 90,40 L90,80 Q90,90 80,90 Z"
          fill="#58CC02"
        />
        {/* Wings */}
        <path d="M10,50 Q-5,60 10,70 Z" fill="#46A302" />
        <path d="M90,50 Q105,60 90,70 Z" fill="#46A302" />
        
        {/* Belly */}
        <path d="M30,90 Q50,70 70,90 Z" fill="#89E219" opacity="0.6"/>

        {/* Eyes based on emotion */}
        {emotion === 'neutral' && (
          <g>
            <circle cx="35" cy="40" r="12" fill="white" />
            <circle cx="65" cy="40" r="12" fill="white" />
            <circle cx="35" cy="40" r="4" fill="black" />
            <circle cx="65" cy="40" r="4" fill="black" />
          </g>
        )}
        {emotion === 'happy' && (
           <g>
            <circle cx="35" cy="40" r="12" fill="white" />
            <circle cx="65" cy="40" r="12" fill="white" />
            {/* Happy eyes (arcs) */}
            <path d="M28,40 Q35,35 42,40" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <path d="M58,40 Q65,35 72,40" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
            {/* Smile */}
            <path d="M40,60 Q50,70 60,60" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
           </g>
        )}
        {emotion === 'excited' && (
            <g className="animate-bounce">
             <circle cx="35" cy="40" r="14" fill="white" />
             <circle cx="65" cy="40" r="14" fill="white" />
             <circle cx="35" cy="40" r="6" fill="black" />
             <circle cx="65" cy="40" r="6" fill="black" />
             {/* Open mouth */}
             <path d="M40,60 Q50,75 60,60 Z" fill="#4a0e0e" />
            </g>
         )}
        {emotion === 'sad' && (
          <g>
            <circle cx="35" cy="45" r="12" fill="white" />
            <circle cx="65" cy="45" r="12" fill="white" />
            {/* Sad eyes/eyelids */}
            <path d="M25,40 L45,40" stroke="#46A302" strokeWidth="8" />
            <path d="M55,40 L75,40" stroke="#46A302" strokeWidth="8" />
             <circle cx="35" cy="48" r="4" fill="black" />
             <circle cx="65" cy="48" r="4" fill="black" />
             {/* Frown */}
             <path d="M40,70 Q50,60 60,70" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* Beak */}
        <path d="M45,50 L55,50 L50,58 Z" fill="#FFC800" />
      </svg>
    </div>
  );
};