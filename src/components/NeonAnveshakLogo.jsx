import React from 'react';

export const NeonAnveshakLogo = () => {
  return (
    <svg 
      viewBox="0 0 353 391" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      // Tailwind classes for size, animation, and hover effect
      className="w-56 h-auto md:w-72 animate-pulse transition-transform duration-300 hover:scale-105 mb-2.5"
    >
      <defs>
        {/* The Neon Glow Filter */}
        <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <path 
        // This is your exact path from Figma!
        d="M163.057 0.5L0.557292 325.5L32.0573 390.5M163.057 0.5L276.557 226V239.5L272.057 249.5L265.057 256.5L256.057 260.5L229.557 262M163.057 0.5H230.057L341.057 224.5L348.057 238.5L351.557 253.5V271.5L348.057 283L341.557 298M229.557 262H163.057M229.557 262L196.057 196M163.057 262L196.057 196M163.057 262L130.557 328H295.057L300.057 326.5L307.557 324.5L316.057 321L321.557 317.5L326.057 314.5L330.557 311L335.057 306L341.557 298M196.057 196L163.057 131L32.0573 390.5M32.0573 390.5H272.057L282.557 387.5L292.557 382L302.057 373L308.557 363.5L341.557 298" 
        stroke="#EA0808" 
        strokeWidth="4" /* Added thickness to make the neon visible */
        strokeLinejoin="round" 
        strokeLinecap="round"
        filter="url(#red-glow)" /* Connects the path to the filter above */
      />
    </svg>
  );
};