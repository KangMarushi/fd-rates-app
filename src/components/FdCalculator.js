import React, { useState } from 'react';
import './FdCalculator.css'; // Ensure you have styles defined for loading animation and table

const FdCalculator = () => {
    const [amount, setAmount] = useState('');
    const [tenure, setTenure] = useState('1 year'); // Default to '7 days'
    const [compounding, setCompounding] = useState('quarterly');
    const [tds, setTds] = useState(0);
    const [payout, setPayout] = useState('maturity');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(''); // State for loading message
    const [error, setError] = useState(null); // State for error

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

    const compoundingMap = {
        'yearly': 1,
        'half-yearly': 2,
        'quarterly': 4,
    };

    const handleCalculate = async () => {
        setLoading(true);
        setLoadingMessage('Fetching Interest Rates...');

        // Fetch FD data from the API
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

        const tenureMonths = getTenureInMonths(tenure);
        const calculatedResults = apiData.map((bank) => {
            const rate = (tenure === 'Special schemes in Days')
                ? bank['High ROI'] // Use highest ROI for special schemes
                : bank.Rates[tenure]; // Fetch rate based on selected tenure
            
            if (!rate) {
                console.warn(`No interest rate available for tenure ${tenure} in bank ${bank['Bank Name']}`);
                return null;
            }

            // Calculate maturity value
            const frequency = compoundingMap[compounding];
            const maturityValue = amount * Math.pow(1 + rate / (100 * frequency), frequency * tenureMonths / 12);
            const interestEarned = maturityValue - amount;
            const tdsDeductible = (tds / 100) * interestEarned;
            const interestAfterTds = interestEarned - tdsDeductible;

            // Prepare result object
            const result = {
                bank: bank['Bank Name'],
                maturityValue,
                interestEarned,
                tdsDeductible,
                interestAfterTds,
                roi: rate, // Interest rate used for calculation
                highRoiTenure: tenure === 'Special schemes in Days' ? bank['High ROI Tenure'] || '' : null, // High ROI tenure only for special schemes
            };

            return result;
        }).filter(result => result !== null); // Filter out invalid entries

        // Sort by maturity value in descending order
        const sortedResults = calculatedResults.sort((a, b) => b.maturityValue - a.maturityValue);
        setResults(sortedResults);
        setShowResults(true);

        setLoadingMessage('Deducting TDS!');
        setLoading(false);
    };

    return (
        <div className="calculator-container">
            <h2>FD Calculator</h2>
            <form>
                <div>
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
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
                <button type="button" onClick={handleCalculate}>
                    Calculate
                </button>
            </form>

            {loading && (
                <div className="loading-animation">
                    <span>{loadingMessage} <span className="loader">/</span></span>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {showResults && (
                <div className="results-container">
                    <h3>Results</h3>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Bank</th>
                                <th>Interest Rate (%)</th>
                                <th>Maturity Value</th>
                                <th>Interest Earned</th>
                                {tds !== 0 && <th>TDS Deductible</th>} {/* Show TDS Deductible only if TDS is not 0 */}
                                {tds !== 0 && <th>Interest After TDS</th>} {/* Show Interest After TDS only if TDS is not 0 */}
                                {results.some(result => result.highRoiTenure) && <th>High ROI Tenure</th>} {/* Conditional rendering of the header */}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.bank}</td>
                                    <td>{result.roi}</td>
                                    <td>{result.maturityValue.toFixed(2)}</td>
                                    <td>{result.interestEarned.toFixed(2)}</td>
                                    {tds !== 0 && <td>{result.tdsDeductible.toFixed(2)}</td>} {/* Conditional rendering of TDS Deductible */}
                                    {tds !== 0 && <td>{result.interestAfterTds.toFixed(2)}</td>} {/* Conditional rendering of Interest After TDS */}
                                    {result.highRoiTenure && <td>{result.highRoiTenure}</td>} {/* Conditional rendering of High ROI Tenure */}
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
