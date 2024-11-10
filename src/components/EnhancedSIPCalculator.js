import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './EnhancedSIPCalculator.css';

// Function to format numbers in Indian style
const formatIndianNumber = (num) => {
  if (num === undefined || num === null) return '';
  const numStr = Math.round(num).toString();
  if (numStr.length <= 3) return numStr;
  
  let lastThree = numStr.substring(numStr.length - 3);
  let remaining = numStr.substring(0, numStr.length - 3);
  if (remaining) {
    lastThree = ',' + lastThree;
  }
  if (remaining.length > 0) {
    remaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  }
  return `₹${remaining}${lastThree}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">Year {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatIndianNumber(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const EnhancedUnifiedCalculator = () => {
  const [calculationType, setCalculationType] = useState('wealth');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [annualStepUp, setAnnualStepUp] = useState('0');
  const [returnRate, setReturnRate] = useState('12');
  const [years, setYears] = useState('10');
  const [targetAmount, setTargetAmount] = useState('');
  const [inflationRate, setInflationRate] = useState('6');

  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [requiredSIP, setRequiredSIP] = useState(0);

  const calculateWealthCreation = () => {
    const annualRate = parseFloat(returnRate) / 100;
    const monthlyRate = annualRate / 12;
    const stepUpPercent = parseFloat(annualStepUp) / 100;
    let yearlyData = [];
    let currentMonthlyInvestment = parseFloat(monthlyInvestment);
    let totalInvestment = 0;
    let accumulatedValue = 0;

    for (let year = 1; year <= parseInt(years); year++) {
      let yearlyInvestment = 0;
      let yearStartValue = accumulatedValue;

      for (let month = 1; month <= 12; month++) {
        yearlyInvestment += currentMonthlyInvestment;
        accumulatedValue = (accumulatedValue + currentMonthlyInvestment) * (1 + monthlyRate);
      }

      totalInvestment += yearlyInvestment;

      yearlyData.push({
        year,
        invested: Math.round(totalInvestment),
        value: Math.round(accumulatedValue),
        returns: Math.round(accumulatedValue - totalInvestment)
      });

      currentMonthlyInvestment *= (1 + stepUpPercent);
    }

    setYearlyBreakdown(yearlyData);
    setTotalInvested(Math.round(totalInvestment));
    setTotalReturns(Math.round(accumulatedValue - totalInvestment));
  };

  const calculateRequiredSIP = () => {
    const annualRate = parseFloat(returnRate) / 100;
    const monthlyRate = annualRate / 12;
    const numberOfMonths = parseInt(years) * 12;
    const inflationAdjustedTarget = parseFloat(targetAmount) * 
      Math.pow(1 + parseFloat(inflationRate) / 100, parseInt(years));

    const required = inflationAdjustedTarget * monthlyRate / 
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    setRequiredSIP(Math.round(required));

    let yearlyData = [];
    let totalInvestment = 0;
    let accumulatedValue = 0;

    for (let year = 1; year <= parseInt(years); year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvestment += required;
        accumulatedValue = (accumulatedValue + required) * (1 + monthlyRate);
      }

      yearlyData.push({
        year,
        invested: Math.round(totalInvestment),
        value: Math.round(accumulatedValue),
        returns: Math.round(accumulatedValue - totalInvestment),
        targetValue: Math.round(inflationAdjustedTarget)
      });
    }

    setYearlyBreakdown(yearlyData);
  };

  const handleCalculate = () => {
    if (calculationType === 'wealth' && monthlyInvestment && returnRate && years) {
      calculateWealthCreation();
    } else if (calculationType === 'goal' && targetAmount && returnRate && years && inflationRate) {
      calculateRequiredSIP();
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Unified SIP Calculator</h1>
      </div>

      <div className="tab-container">
        <button
          className={`tab-button ${calculationType === 'wealth' ? 'active' : ''}`}
          onClick={() => setCalculationType('wealth')}
        >
          Wealth Creation
        </button>
        <button
          className={`tab-button ${calculationType === 'goal' ? 'active' : ''}`}
          onClick={() => setCalculationType('goal')}
        >
          Goal Based
        </button>
      </div>

      {calculationType === 'wealth' && (
        <div className="input-grid">
          <div className="input-group">
            <label className="input-label">Monthly Investment (₹)</label>
            <input
              type="number"
              className="input-field"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Annual Step-up (%)</label>
            <input
              type="number"
              className="input-field"
              value={annualStepUp}
              onChange={(e) => setAnnualStepUp(e.target.value)}
            />
          </div>
        </div>
      )}

      {calculationType === 'goal' && (
        <div className="input-grid">
          <div className="input-group">
            <label className="input-label">Target Amount (₹)</label>
            <input
              type="number"
              className="input-field"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Inflation Rate (%)</label>
            <input
              type="number"
              className="input-field"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="input-grid">
        <div className="input-group">
          <label className="input-label">Expected Return (%)</label>
          <input
            type="number"
            className="input-field"
            value={returnRate}
            onChange={(e) => setReturnRate(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Time Period (Years)</label>
          <input
            type="number"
            className="input-field"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
      </div>

      <div className="button-container">
        <button className="calculate-button" onClick={handleCalculate}>
          Calculate
        </button>
      </div>

      {calculationType === 'wealth' && totalInvested > 0 && (
        <div>
          <div className="results-grid">
            <div className="result-card">
              <h3 className="result-title">Total Investment</h3>
              <p className="result-value">{formatIndianNumber(totalInvested)}</p>
            </div>
            <div className="result-card">
              <h3 className="result-title">Total Returns</h3>
              <p className="result-value success">{formatIndianNumber(totalReturns)}</p>
            </div>
            <div className="result-card">
              <h3 className="result-title">Final Amount</h3>
              <p className="result-value">
                {formatIndianNumber(totalInvested + totalReturns)}
              </p>
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={yearlyBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={value => formatIndianNumber(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="invested" stroke="#2563eb" name="Total Invested" strokeWidth={2} />
                  <Line type="monotone" dataKey="value" stroke="#16a34a" name="Portfolio Value" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {calculationType === 'goal' && requiredSIP > 0 && (
        <div>
          <div className="result-card">
            <h3 className="result-title">Required Monthly SIP</h3>
            <p className="result-value">{formatIndianNumber(requiredSIP)}</p>
          </div>

          <div className="chart-wrapper">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={yearlyBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={value => formatIndianNumber(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="invested" stroke="#2563eb" name="Total Invested" strokeWidth={2} />
                  <Line type="monotone" dataKey="value" stroke="#16a34a" name="Portfolio Value" strokeWidth={2} />
                  <Line type="monotone" dataKey="targetValue" stroke="#dc2626" name="Target Amount" strokeDasharray="5 5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedUnifiedCalculator;