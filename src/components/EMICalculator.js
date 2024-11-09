import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient.js';
import './EMICalculator.css';


function EMICalculator() {
    const [loanAmount, setLoanAmount] = useState('');
    const [loanTenure, setLoanTenure] = useState('');
    const [emiType, setEmiType] = useState('reducing'); // Default to reducing balance EMI
    const [loanData, setLoanData] = useState([]);
    const [results, setResults] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    // Fetch loan data from Supabase
    useEffect(() => {
        const fetchLoanData = async () => {
            const { data, error } = await supabase.from('personal_loans').select('*');
            if (error) console.error('Error fetching loan data:', error);
            else setLoanData(data);
        };
        fetchLoanData();
    }, []);

    // Handle form submission
    const handleCalculate = (e) => {
        e.preventDefault();

        const calculationResults = loanData.map((loan) => {
            const interestRates = {
                low: loan.interest_rate_low,
                mean: loan.interest_rate_mean,
                high: loan.interest_rate_high,
            };

            const emiResults = {};
            for (const [key, rate] of Object.entries(interestRates)) {
                emiResults[key] = calculateEMI(rate, loanTenure, loanAmount, emiType);
            }

            return {
                lender: loan.lender_name,
                loanAmount: loanAmount,
                interestRates,
                emiResults,
                processingFee: calculateProcessingFee(loan.processing_fee, loanAmount),
            };
        });

        setResults(calculationResults);
    };

    // EMI Calculation Functions
    const calculateEMI = (rate, tenure, amount, type) => {
        const monthlyRate = rate / 12 / 100;
        if (type === 'flat') {
            const totalInterest = amount * (rate / 100) * (tenure / 12);
            const totalAmount = amount + totalInterest;
            return { emi: totalAmount / tenure, totalInterest };
        } else {
            const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
                        (Math.pow(1 + monthlyRate, tenure) - 1);
            const totalInterest = emi * tenure - amount;
            return { emi, totalInterest };
        }
    };

    const calculateProcessingFee = (fee, amount) => {
        return fee.type === 'percentage' ? (amount * fee.value) / 100 : fee.value;
    };

    // Sorting function
    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        const sortedResults = [...results].sort((a, b) => {
            const aValue = a.emiResults[sortField]?.emi || 0;
            const bValue = b.emiResults[sortField]?.emi || 0;
            return order === 'asc' ? aValue - bValue : bValue - aValue;
        });

        setResults(sortedResults);
    };

    return (
        <div className="emi-calculator">
            <h2>Personal Loan EMI Calculator</h2>
            <form onSubmit={handleCalculate}>
                <input 
                    type="number" 
                    placeholder="Enter Loan Amount" 
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(e.target.value)} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Enter Loan Tenure (months)" 
                    value={loanTenure} 
                    onChange={(e) => setLoanTenure(e.target.value)} 
                    required 
                />
                <div className="toggle-switch1">
                    <button
                        type="button"
                        className={`toggle-option ${emiType === 'reducing' ? 'active' : ''}`}
                        onClick={() => setEmiType('reducing')}
                    >
                        Reducing Balance EMI
                    </button>
                    <button
                        type="button"
                        className={`toggle-option ${emiType === 'flat' ? 'active' : ''}`}
                        onClick={() => setEmiType('flat')}
                    >
                        Flat EMI
                    </button>
                </div>
                <button type="submit">Calculate EMI</button>
            </form>

            {/* Results Table */}
            {results.length > 0 && (
            <div className="results-container">
                <h4>EMI Results</h4>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Lender</th>
                            <th>Loan Amount</th>
                            <th onClick={() => handleSort('low')}>EMI (Low Rate)</th>
                            <th onClick={() => handleSort('mean')}>EMI (Mean Rate)</th>
                            <th onClick={() => handleSort('high')}>EMI (High Rate)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.lender}</td>
                                <td>₹{result.loanAmount}</td>
                                {['low', 'mean', 'high'].map((rateType) => (
                                    <td key={rateType}>
                                        <p>EMI: ₹{result.emiResults[rateType].emi.toFixed(2)}</p>
                                        <p>Interest: ₹{result.emiResults[rateType].totalInterest.toFixed(2)}</p>
                                        <p>Rate: {result.interestRates[rateType]}%</p>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
}

export default EMICalculator;
