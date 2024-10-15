import React from 'react';
import './App.css';
import FdRates from './components/FdRates';

function App() {
  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="App">
      <header className="App-header">
        <h1>FD Rates</h1> {/* Title for the app */}
        <p>{currentDate}</p> {/* Display the current date */}
      </header>
      
      {/* Adding the FdRates component */}
      <div className="FdRates-section">
        <FdRates />
      </div>
    </div>
  );
}

export default App;
