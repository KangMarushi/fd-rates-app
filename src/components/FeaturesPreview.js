import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

function FeaturesPreview() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      title: 'SIP Calculator',
      description: 'Plan your systematic investments',
      comingSoon: 'Coming Soon',
    },
    {
      title: 'EMI Calculator',
      description: 'Calculate your loan EMIs',
      comingSoon: 'Coming Soon',
    },
    {
      title: 'Prepayment Calculator',
      description: 'Optimize your loan prepayments',
      comingSoon: 'Coming Soon',
    }
  ];

  return (
    <div className="features-grid">
      {features.map((feature, index) => (
        <div 
          key={feature.title}
          className={`feature-card card ${hoveredFeature === index ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredFeature(index)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          <div className="card-header">
            <div className="feature-title">
              <span>{feature.title}</span>
              <ArrowUpRight className="feature-arrow" size={16} />
            </div>
            <p className="feature-description">{feature.description}</p>
            <span className="coming-soon">{feature.comingSoon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturesPreview;