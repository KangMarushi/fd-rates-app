import React, { useState } from 'react';
import { Calculator, Landmark, MessageSquareShare, Percent, IndianRupee, SquarePercent } from 'lucide-react';
import FdRates from './FdRates.js';
import FdCalculator from './FdCalculator.js';
import LoanComparison from './LoanComparison.js';
import FeedbackForm from './FeedbackForm.js';
import EMICalculator from './EMICalculator.js';



function ToolsSection({ rates }) {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className="tools-section">
      <div className="tabs-list">
        <button 
          className={`tab-trigger ${activeTab === 'rates' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'rates' ? null : 'rates')}
        >
          <IndianRupee size={16} />
          <span className="tab-text">FD Rates Comparison</span>
        </button>
        <button 
          className={`tab-trigger ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'calculator' ? null : 'calculator')}
        >
          <Calculator size={16} />
          <span className="tab-text">Returns Calculator</span>
        </button>
        <button 
          className={`tab-trigger ${activeTab === 'loanComparison' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'loanComparison' ? null : 'loanComparison')}
        >
          <Percent size={16} />
          <span className="tab-text">Personal Loan ROI Comparison</span>
        </button>
        <button 
          className={`tab-trigger ${activeTab === 'emiCalculator' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'emiCalculator' ? null : 'emiCalculator')}
        >
          <SquarePercent size={16} />
          <span className="tab-text">Persoanl Loan EMI Calculator</span>
        </button>

        <button 
          className={`tab-trigger ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'feedback' ? null : 'feedback')}
        >
          <MessageSquareShare size={16} />
          <span className="tab-text">Feedback / Request</span>
        </button>

      </div>

      {activeTab && (
        <div className="tool-content card">
          <div className="card-content">
            {activeTab === 'rates' && <FdRates rates={rates} />}
            {activeTab === 'calculator' && <FdCalculator rates={rates} />}
            {activeTab === 'loanComparison' && <LoanComparison />}
            {activeTab === 'emiCalculator' && <EMICalculator />}
            {activeTab === 'feedback' && <FeedbackForm />}

          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsSection;
