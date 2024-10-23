import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolsSection from './components/ToolsSection';
import FeaturesPreview from './components/FeaturesPreview';
import AudienceSection from './components/AudienceSection';

function App() {
  const [rates, setRates] = useState([]);

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

  return (
    <div className="app-container">
      <div className="container">
        <Navbar />
        <Hero />
        <ToolsSection rates={rates} />
        <FeaturesPreview />
        <AudienceSection />
      </div>
    </div>
  );
}

export default App;