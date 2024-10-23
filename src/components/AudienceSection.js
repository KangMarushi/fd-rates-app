import React from 'react';
import { Landmark, TrendingUp, Calculator } from 'lucide-react';


function AudienceSection() {
  const audiences = [
    {
      icon: Landmark,
      title: 'Bank Employees',
      description: 'Quick access to competitive rate information',
    },
    {
      icon: TrendingUp,
      title: 'Investors',
      description: 'Make informed investment decisions',
    },
    {
      icon: Calculator,
      title: 'Senior Citizens',
      description: 'Easy-to-use tools for retirement planning',
    }
  ];

  return (
    <div className="audience-grid">
      {audiences.map(({ icon: Icon, title, description }) => (
        <div key={title} className="audience-card card">
          <Icon className="audience-icon" />
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>
      ))}
    </div>
  );
}

export default AudienceSection;