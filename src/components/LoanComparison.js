import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseclient.js';
import { Loader2, ArrowUpDown } from 'lucide-react';

function LoanComparison() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('personal_loans')
          .select('*');

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!data) {
          throw new Error('No data received from the database');
        }

        setLoans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching loans');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedLoans = [...loans].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === 'interest_rate_low') {
        aValue = Number(a.interest_rate_low);
        bValue = Number(b.interest_rate_low);
      } else if (key === 'minimum_loan_amount' || key === 'maximum_loan_amount') {
        aValue = Number(a[key]);
        bValue = Number(b[key]);
      } else if (key === 'processing_fee') {
        aValue = Number(a.processing_fee.value);
        bValue = Number(b.processing_fee.value);
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setLoans(sortedLoans);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Loader2 style={{ height: '32px', width: '32px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '16px auto', 
        padding: '16px', 
        backgroundColor: '#FEF2F2', 
        border: '1px solid #DC2626', 
        borderRadius: '8px' 
      }}>
        <p style={{ color: '#DC2626' }}>{error}</p>
      </div>
    );
  }

  const tableStyles = {
    container: {
      maxWidth: '1200px',
      margin: '16px auto',
      padding: '24px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '24px',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      border: '2px solid #E5E7EB',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      backgroundColor: '#F9FAFB',
      border: '2px solid #E5E7EB',
      fontWeight: '600',
      cursor: 'pointer',
    },
    td: {
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
    },
    tr: {
      '&:hover': {
        backgroundColor: '#F9FAFB',
      }
    },
    sortHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }
  };

  return (
    <div style={tableStyles.container}>
      <h2 style={tableStyles.title}>Personal Loan ROI Comparison</h2>
      <div style={tableStyles.tableWrapper}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {[
                { key: 'lender_id', label: 'Bank Name' },
                { key: 'interest_rate_low', label: 'Interest Rate' },
                { key: 'loan_tenure', label: 'Loan Tenure' },
                { key: 'minimum_loan_amount', label: 'Min Amount' },
                { key: 'maximum_loan_amount', label: 'Max Amount' },
                { key: 'processing_fee', label: 'Processing Fee' },
                { key: 'eligibility_criteria', label: 'Eligibility Criteria' }
              ].map((column) => (
                <th 
                  key={column.key} 
                  style={tableStyles.th}
                  onClick={() => handleSort(column.key)}
                >
                  <div style={tableStyles.sortHeader}>
                    {column.label}
                    <ArrowUpDown size={14} style={{ color: '#6B7280' }} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} style={tableStyles.tr}>
                <td style={tableStyles.td}>{loan.lender_name}</td>
                <td style={tableStyles.td}>
                  {Number(loan.interest_rate_low).toFixed(2)} - {Number(loan.interest_rate_high).toFixed(2)}%
                </td>
                <td style={tableStyles.td}>{loan.loan_tenure} months</td>
                <td style={tableStyles.td}>{formatCurrency(loan.minimum_loan_amount)}</td>
                <td style={tableStyles.td}>{formatCurrency(loan.maximum_loan_amount)}</td>
                <td style={tableStyles.td}>
                  {loan.processing_fee?.type === 'percentage'
                    ? `${Number(loan.processing_fee.value).toFixed(2)}%`
                    : formatCurrency(loan.processing_fee.value)}
                </td>
                <td style={tableStyles.td}>{loan.eligibility_criteria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LoanComparison;