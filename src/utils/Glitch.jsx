import React, { useState } from 'react';
import '../styling/GlitchPage.css';

function GlitchPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    
    <div className="glitch-page">
      <div
        className={`glitch-effect ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1> Leave</h1>
        <div className="evil-eyes"></div>
        <div className="evil-smile"></div>
        <div className="glitch-text"> please
        {isHovered && <div className="evil-smile"></div>}
      </div>
    </div>
    </div>
  );
}

export default GlitchPage;
