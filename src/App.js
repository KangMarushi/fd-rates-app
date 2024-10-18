import React, { useState, useEffect } from 'react';
import './App.css';
import FdRates from './components/FdRates';
import FdCalculator from './components/FdCalculator';

function App() {
  const [view, setView] = useState(''); // Initially empty to hide both tables
  const [rates, setRates] = useState([]); // Fetch rates from your API or use static data

  // Fetch FD rates from the API (or use your stored data)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://fd-roi-api.onrender.com/api/rates');
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data = await response.json();
        setRates(data);
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    };
    fetchRates();
  }, []);

  const handleViewChange = (selectedView) => {
    setView(selectedView);
  };

  useEffect(() => {
    document.title = 'FD Rates App'; // Update tab name
  }, []);

  return (
    <div className="App">
      <header>
        <h1>FD Rates & Maturity Calculator</h1>
      </header>
      <div className="view-options">
        <button onClick={() => handleViewChange('rates')}>View FD Rates Table</button>
        <button onClick={() => handleViewChange('calculator')}>Visualize Maturity via Calculator</button>
      </div>

      {/* Render components conditionally based on the user's choice */}
      <div className="content">
        {view === 'rates' && <FdRates rates={rates} />} {/* FD Rates Table */}
        {view === 'calculator' && <FdCalculator rates={rates} />} {/* FD Calculator */}
      </div>
    </div>
  );
}

export default App;
