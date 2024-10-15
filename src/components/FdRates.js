import React, { useEffect, useState } from 'react';

function FdRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://fd-roi-api.onrender.com/api/rates');
        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }
        const data = await response.json();
        setRates(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRates = React.useMemo(() => {
    if (sortConfig.key) {
      return [...rates].sort((a, b) => {
        const valueA = sortConfig.key.includes('Rates')
          ? (a.Rates && a.Rates[sortConfig.key.replace('Rates.', '')]) || 0
          : a[sortConfig.key];
        const valueB = sortConfig.key.includes('Rates')
          ? (b.Rates && b.Rates[sortConfig.key.replace('Rates.', '')]) || 0
          : b[sortConfig.key];

        if (sortConfig.direction === 'ascending') {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
          return 0;
        } else {
          if (valueA > valueB) return -1;
          if (valueA < valueB) return 1;
          return 0;
        }
      });
    }
    return rates;
  }, [rates, sortConfig]);

  if (loading) {
    return <div>Loading FD Rates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tenures = ["7 days", "30 days", "3 month", "6 month", "1 year", "2 year", "5 year"];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div>
        <h2>FD Rates Table</h2>
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th onClick={() => handleSort('Bank Name')} style={{ cursor: 'pointer' }}>
                Bank Name {sortConfig.key === 'Bank Name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              {tenures.map((tenure, index) => (
                <th key={index} onClick={() => handleSort(`Rates.${tenure}`)} style={{ cursor: 'pointer' }}>
                  {tenure} {sortConfig.key === `Rates.${tenure}` ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
              ))}
              <th onClick={() => handleSort('High ROI')} style={{ cursor: 'pointer' }}>
                Highest ROI {sortConfig.key === 'High ROI' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRates.map((rate, index) => (
              <tr key={index}>
                <td>{rate['Bank Name'] || 'N/A'}</td>
                {tenures.map((tenure, tIndex) => (
                  <td key={tIndex}>
                    {rate.Rates && rate.Rates[tenure] !== undefined ? `${rate.Rates[tenure]}%` : 'N/A'}
                  </td>
                ))}
                <td>{rate['High ROI']}% ({rate['High ROI Tenure']})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FdRates;
