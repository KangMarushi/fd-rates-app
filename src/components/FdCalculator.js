import React, { useState } from 'react';

function FdCalculator({ rates }) {
  const [amount, setAmount] = useState(0);
  const [tenure, setTenure] = useState('');
  const [frequency, setFrequency] = useState('quarterly');
  const [tds, setTds] = useState(0);
  const [payout, setPayout] = useState('maturity');
  const [results, setResults] = useState([]);

  const handleCalculation = () => {
    const selectedRate = rates.find((rate) => rate['High ROI Tenure'] === tenure);
    if (!selectedRate) return;

    // Calculate maturity based on inputs
    let rate = selectedRate['High ROI'] / 100;
    if (tds !== 0) {
      rate -= rate * (tds / 100); // Adjust ROI with TDS
    }

    const compoundedAmount = amount * Math.pow(1 + rate / getCompoundingFrequency(frequency), getCompoundingFrequency(frequency) * getYearsFromTenure(tenure));

    setResults([...results, { bank: selectedRate['Bank Name'], amount: compoundedAmount.toFixed(2) }]);
  };

  const getCompoundingFrequency = (frequency) => {
    switch (frequency) {
      case 'quarterly':
        return 4;
      case 'half-yearly':
        return 2;
      case 'yearly':
        return 1;
      default:
        return 4;
    }
  };

  const getYearsFromTenure = (tenure) => {
    if (tenure.includes('year')) {
      return parseInt(tenure);
    }
    if (tenure.includes('month')) {
      return parseInt(tenure) / 12;
    }
    return 1; // Default
  };

  return (
    <div>
      <h2>FD Maturity Calculator</h2>
      <div>
        <label>Investment Amount: </label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label>Tenure: </label>
        <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
          <option value="">Select Tenure</option>
          {rates.map((rate, index) => (
            <option key={index} value={rate['High ROI Tenure']}>
              {rate['High ROI Tenure']}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Compounding Frequency: </label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="quarterly">Quarterly</option>
          <option value="half-yearly">Half-Yearly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        <label>TDS Percentage: </label>
        <select value={tds} onChange={(e) => setTds(e.target.value)}>
          <option value={0}>0%</option>
          <option value={10}>10%</option>
          <option value={20}>20%</option>
        </select>
      </div>
      <div>
        <label>Interest Payout: </label>
        <select value={payout} onChange={(e) => setPayout(e.target.value)}>
          <option value="maturity">On Maturity</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <button onClick={handleCalculation}>Calculate</button>
      <div>
        <h3>Results</h3>
        <table>
          <thead>
            <tr>
              <th>Bank</th>
              <th>Maturity Amount</th>
            </tr>
          </thead>
          <tbody>
            {results
              .sort((a, b) => b.amount - a.amount)
              .map((result, index) => (
                <tr key={index}>
                  <td>{result.bank}</td>
                  <td>{result.amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FdCalculator;
