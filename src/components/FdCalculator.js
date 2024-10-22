import React, { useState } from 'react';
import './FdCalculator.css';

const FdCalculator = () => {
    const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
    const [amount, setAmount] = useState('');
    const [tenure, setTenure] = useState('7 days');
    const [compounding, setCompounding] = useState('yearly');
    const [tds, setTds] = useState(0);
    const [payout, setPayout] = useState('maturity');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState(null);

    const getTenureInMonths = (tenureLabel) => {
        switch (tenureLabel) {
            case '7 days': return 0.23;
            case '30 days': return 1;
            case '3 month': return 3;
            case '6 month': return 6;
            case '1 year': return 12;
            case '2 year': return 24;
            case '5 year': return 60;
            default: return 0;
        }
    };

    // Function to handle user selection (toggle between Individual and Senior Citizen)
    const handleUserTypeChange = (event) => {
    setIsSeniorCitizen(event.target.value === 'senior');
    };

    const handleCalculate = async () => {
        setLoading(true);
        setLoadingMessage('Fetching Interest Rates...');
        let apiData = [];
        try {
            const response = await fetch('https://fd-roi-api.onrender.com/api/rates');
            if (!response.ok) throw new Error('Network response was not ok');
            apiData = await response.json();
        } catch (error) {
            console.error('Error fetching FD data:', error);
            setError('Failed to load data. Please try again later.');
            setLoading(false);
            return;
        }

        setLoadingMessage('Calculating Maturity Amount...');

        const tenureMonths = getTenureInMonths(tenure);  // Convert tenure to months if needed
    const calculatedResults = apiData.map((bank) => {
        let rate;
        let tenureInDays;

        // Check if the selected tenure is "Special schemes in Days"
        if (tenure === 'Special schemes in Days') {
            rate = bank['High ROI'];  // Use the High ROI rate for special schemes
            tenureInDays = parseInt(bank['High ROI Tenure'].split(' ')[0]);  // Extract tenure days from "444 Days" etc.
        } else {
            rate = bank.Rates[tenure];  // Use the regular rate for standard tenures
        }

        if (!rate) {
            console.warn(`No interest rate available for tenure ${tenure} in bank ${bank['Bank Name']}`);
            return null;  // Skip banks that don't have rates for the selected tenure
        }

        // Use tenure in days for special schemes, otherwise calculate with months
        const tenureDuration = tenureInDays || (tenureMonths * 30);  // For regular tenures, use months converted to days


            let maturityValue = 0;
            let monthlyInterest = 0;
            let interestEarned = 0;
            const adjustedRate = isSeniorCitizen ? rate + 0.5 : rate;

            if (payout === 'maturity') {
                // Compounding logic
                const frequency = compounding === 'monthly' ? 0 : { yearly: 1, 'half-yearly': 2, quarterly: 4 }[compounding];
                if (frequency) {
                    maturityValue = amount * Math.pow(1 + adjustedRate / (100 * frequency), frequency * tenureDuration / 365);
                    interestEarned = maturityValue - amount;
                } else {
                    interestEarned = (amount * adjustedRate * tenureDuration) / 365 / 100;
                    maturityValue = amount + interestEarned;
                }
            } else if (payout === 'monthly') {
                // Calculate monthly payout
                monthlyInterest = (amount * adjustedRate) / 12 / 100;
                interestEarned = monthlyInterest * tenureDuration / 30;
                maturityValue = amount + interestEarned;
            }

            const tdsDeductible = (tds / 100) * interestEarned;
            const interestAfterTds = interestEarned - tdsDeductible;

            return {
                bank: bank['Bank Name'],
                maturityValue,
                interestEarned,
                monthlyInterest,
                tdsDeductible,
                interestAfterTds,
                roi: adjustedRate,
                highRoiTenure: tenure === 'Special schemes in Days' ? bank['High ROI Tenure'] || '' : null,
            };
        }).filter(result => result !== null);

        const sortedResults = calculatedResults.sort((a, b) => b.maturityValue - a.maturityValue);
        setResults(sortedResults);
        setShowResults(true);
        setLoading(false);
    };

    return (
        <div className="calculator-container">
            <h2>FD Calculator</h2>
            <form>
                {/* Input fields */}
                <div className="form-row">
                    <label className="user-type-label">
                    User Type:
                    <select onChange={handleUserTypeChange} className="user-type-dropdown">
                        <option value="individual">Individual</option>
                        <option value="senior">Senior Citizen</option>
                    </select>
                    </label>

                    <label className="amount-label">
                        Amount:
                        <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="amount-input"
                        />
                    </label>
                </div>
                <div>
                    <label>Tenure:</label>
                    <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
                        <option value="7 days">7 Days</option>
                        <option value="30 days">30 Days</option>
                        <option value="3 month">3 Months</option>
                        <option value="6 month">6 Months</option>
                        <option value="1 year">1 Year</option>
                        <option value="2 year">2 Years</option>
                        <option value="5 year">5 Years</option>
                        <option value="Special schemes in Days">Special schemes in Days</option>
                    </select>
                </div>
                <div>
                    <label>Compounding Frequency:</label>
                    <select value={compounding} onChange={(e) => setCompounding(e.target.value)}>
                        <option value="yearly">Yearly</option>
                        <option value="half-yearly">Half-Yearly</option>
                        <option value="quarterly">Quarterly</option>
                    </select>
                </div>
                <div>
                    <label>TDS Percentage:</label>
                    <select value={tds} onChange={(e) => setTds(e.target.value)}>
                        <option value={0}>0%</option>
                        <option value={10}>10%</option>
                        <option value={20}>20%</option>
                    </select>
                </div>
                <div>
                    <label>Payout:</label>
                    <select value={payout} onChange={(e) => setPayout(e.target.value)}>
                        <option value="maturity">Maturity</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <button type="button" onClick={handleCalculate}>Calculate</button>
            </form>

            {loading && (
                <div className="loading-animation">
                    <span>{loadingMessage}</span>
                </div>
            )}

            {showResults && (
                <div className="results-container">
                    <h3>Results</h3>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Bank</th>
                                <th>Interest Rate (%)</th>
                                <th>{payout === 'maturity' ? 'Maturity Value' : 'Monthly Interest'}</th>
                                <th>Interest Earned</th>
                                {tds !== 0 && <th>TDS Deductible</th>}
                                {tds !== 0 && <th>Interest After TDS</th>}
                                {results.some(result => result.highRoiTenure) && <th>High ROI Tenure</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.bank}</td>
                                    <td>{result.roi}</td>
                                    <td>{payout === 'maturity' ? result.maturityValue.toFixed(2) : result.monthlyInterest.toFixed(2)}</td>
                                    <td>{result.interestEarned.toFixed(2)}</td>
                                    {tds !== 0 && <td>{result.tdsDeductible.toFixed(2)}</td>}
                                    {tds !== 0 && <td>{result.interestAfterTds.toFixed(2)}</td>}
                                    {result.highRoiTenure && <td>{result.highRoiTenure}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FdCalculator;
