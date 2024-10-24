import React, { useState } from 'react';
import { Calculator, Landmark } from 'lucide-react';
import FdRates from './FdRates.js';
import FdCalculator from './FdCalculator.js';

function ToolsSection({ rates }) {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className="tools-section">
      <div className="tabs-list">
        <button 
          className={`tab-trigger ${activeTab === 'rates' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'rates' ? null : 'rates')}
        >
          <Landmark size={16} />
          <span className="tab-text">FD Rates Comparison</span>
        </button>
        <button 
          className={`tab-trigger ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'calculator' ? null : 'calculator')}
        >
          <Calculator size={16} />
          <span className="tab-text">Returns Calculator</span>
        </button>
      </div>

      {activeTab && (
        <div className="tool-content card">
          
          <div className="card-content">
            {activeTab === 'rates' && <FdRates rates={rates} />}
            {activeTab === 'calculator' && <FdCalculator rates={rates} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsSection;