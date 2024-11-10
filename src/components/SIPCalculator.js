import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './SIPCalculator.css';

const SIPCalculator = () => {
    const [investmentType, setInvestmentType] = useState('SIP');
    const [sipAmount, setSipAmount] = useState('');
    const [returnRate, setReturnRate] = useState('');
    const [investmentPeriod, setInvestmentPeriod] = useState('');
    const [investedAmount, setInvestedAmount] = useState(null);
    const [returnAmount, setReturnAmount] = useState(null);
    const [totalValue, setTotalValue] = useState(null);

    const calculateReturns = () => {
        const P = parseFloat(sipAmount);
        const r = parseFloat(returnRate) / 100;
        const t = parseFloat(investmentPeriod);
        const n = 12;

        let A = 0;
        let invested = 0;

        if (investmentType === 'SIP') {
            invested = P * t * n;
            A = P * ((Math.pow(1 + r / n, n * t) - 1) / (r / n)) * (1 + r / n);
        } else {
            invested = P;
            A = P * Math.pow(1 + r / n, n * t);
        }

        const returns = A - invested;
        setInvestedAmount(invested.toFixed(2));
        setReturnAmount(returns.toFixed(2));
        setTotalValue(A.toFixed(2));
    };

    const data = {
        labels: ['Invested Amount', 'Return Amount'],
        datasets: [
            {
                data: [investedAmount, returnAmount],
                backgroundColor: ['#4caf50', '#2196f3'],
            },
        ],
    };

    return (
        <div className="sip-calculator-container">
            <div className="sip-calculator-header">
                <h2>SIP Calculator</h2>
            </div>

            <div className="toggle-switch">
            <div className="toggle-buttons">
                <div
                    className={`toggle-option ${investmentType === 'SIP' ? 'active' : ''}`}
                    onClick={() => setInvestmentType('SIP')}
                >
                    SIP
                </div>
                <div
                    className={`toggle-option ${investmentType === 'Lumpsum' ? 'active' : ''}`}
                    onClick={() => setInvestmentType('Lumpsum')}
                >
                    Lumpsum
                </div>
            </div>
            </div>
            <br/>
            <div className="sip-calculator-form">
                <div className="input-group">
                    <label>Monthly SIP Amount:</label>
                    <input
                        type="number"
                        value={sipAmount}
                        onChange={(e) => setSipAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>

                <div className="input-group">
                    <label>Return Rate (%):</label>
                    <input
                        type="number"
                        value={returnRate}
                        onChange={(e) => setReturnRate(e.target.value)}
                        placeholder="Enter return percentage"
                    />
                </div>

                <div className="input-group">
                    <label>Investment Period (Years):</label>
                    <input
                        type="number"
                        value={investmentPeriod}
                        onChange={(e) => setInvestmentPeriod(e.target.value)}
                        placeholder="Enter years"
                    />
                </div>

                <button onClick={calculateReturns}>Calculate</button>
            </div>

            {totalValue !== null && (
                <div className="results-container">
                    <h3>Results</h3>
                    <p>Invested Amount: ₹{investedAmount}</p>
                    <p>Return Amount: ₹{returnAmount}</p>
                    <p>Total Value: ₹{totalValue}</p>
                    <div className="chart-container">
                        <Pie data={data} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SIPCalculator;
