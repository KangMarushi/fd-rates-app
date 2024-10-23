import React from 'react';
import { Calculator } from 'lucide-react';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h2 className="hero-title">Smart Financial Decision Making</h2>
        <p className="hero-description">
          Compare FD rates across banks and calculate returns
        </p>
      </div>
      <div className="hero-animation">
        <Calculator className="hero-icon" size={48} />
      </div>
    </div>
  );
}

export default Hero;