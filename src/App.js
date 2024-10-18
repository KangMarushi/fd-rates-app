import React, { useState } from 'react';
import './App.css';
import FdRates from './components/FdRates';
import FdCalculator from './components/FdCalculator';

function App() {
  const [view, setView] = useState('rates');
  const [rates, setRates] = useState([]); // Fetch rates from API or use your data

  const handleViewChange = (selectedView) => {
    setView(selectedView);
  };

  return (
    <div className="App">
      <header>
        <h1>FD Rates & Calculator</h1>
      </header>
      <div className="view-options">
        <button onClick={() => handleViewChange('rates')}>View FD Rates Table</button>
        <button onClick={() => handleViewChange('calculator')}>Visualize Maturity via Calculator</button>
      </div>
      <div className="content">
        {view === 'rates' && <FdRates rates={rates} />}
        {view === 'calculator' && <FdCalculator rates={rates} />}
      </div>
    </div>
  );
}

export default App;
