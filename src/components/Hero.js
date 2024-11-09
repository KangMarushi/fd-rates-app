import React from 'react';
import { ReactTyped as Typed } from 'react-typed';
import { Calculator } from 'lucide-react';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h2 className="hero-title">Your Finance Hub</h2>
        <p className="hero-description">
          Access tools to compare live rates, calculate returns, and more.
        </p>
        <Typed
          className="hero-typed-text"
          strings={[
            'Live FD Rates Comparison',
            'FD Returns Calculator',
            'Personal Loan ROI Comparison',
            'Personal Loan EMI Calculator',
            
          ]}
          typeSpeed={40}
          backSpeed={50}
          loop
        />
      </div>
      
    </div>
  );
}

export default Hero;
