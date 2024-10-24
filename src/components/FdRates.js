import React, { useEffect, useState } from 'react';
import styles from './FdRates.module.css'; // Updated to use FdRates.module.css

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

  const tenures = ["7 days", "30 days", "3 month", "6 month", "1 year", "2 year", "5 year"];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading FD Rates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          Error: {error}
        </div>
      </div>
    );
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Fixed Deposit Interest Rates</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('Bank Name')}>
                <div className={styles.headerCell}>
                  <span>Bank Name</span>
                  <span className={styles.sortIcon}>{getSortIcon('Bank Name')}</span>
                </div>
              </th>
              {tenures.map((tenure) => (
                <th key={tenure} onClick={() => handleSort(`Rates.${tenure}`)}>
                  <div className={styles.headerCell}>
                    {tenure}
                    <span className={styles.sortIcon}>{getSortIcon(`Rates.${tenure}`)}</span>
                  </div>
                </th>
              ))}
              <th onClick={() => handleSort('High ROI')}>
                <div className={styles.headerCell}>
                  Highest ROI
                  <span className={styles.sortIcon}>{getSortIcon('High ROI')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRates.map((rate, index) => (
              <tr key={index}>
                <td className={styles.bankName}>{rate['Bank Name'] || 'N/A'}</td>
                {tenures.map((tenure) => (
                  <td key={tenure} className={styles.rateCell}>
                    {rate.Rates && rate.Rates[tenure] !== undefined
                      ? <span className={styles.rateValue}>{rate.Rates[tenure]}%</span>
                      : <span className={styles.naValue}>N/A</span>
                    }
                  </td>
                ))}
                <td className={styles.highRoi}>
                  <span className={styles.rateValue}>{rate['High ROI']}%</span>
                  <span className={styles.tenure}>({rate['High ROI Tenure']})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FdRates;
