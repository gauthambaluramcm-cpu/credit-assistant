import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FinancialForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    credit_score: '', utilization: '', missed_payments: '',
    active_loans: '', monthly_salary: '', monthly_expenses: '',
    monthly_savings: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user_id = localStorage.getItem('user_id');
    try {
      await axios.post('http://127.0.0.1:8000/financial-data', {
        user_id: parseInt(user_id),
        credit_score: parseInt(form.credit_score),
        utilization: parseFloat(form.utilization),
        missed_payments: parseInt(form.missed_payments),
        active_loans: parseInt(form.active_loans),
        monthly_salary: parseFloat(form.monthly_salary),
        monthly_expenses: parseFloat(form.monthly_expenses),
        monthly_savings: parseFloat(form.monthly_savings),
      });
      setMessage('Data saved! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📊 Your Financial Profile</h2>
        <p style={styles.subtitle}>Help us understand your financial situation</p>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'credit_score', label: 'Current Credit Score (300-900)' },
            { name: 'utilization', label: 'Credit Utilization %' },
            { name: 'missed_payments', label: 'Missed EMI Payments' },
            { name: 'active_loans', label: 'Number of Active Loans' },
            { name: 'monthly_salary', label: 'Monthly Salary (₹)' },
            { name: 'monthly_expenses', label: 'Monthly Expenses (₹)' },
            { name: 'monthly_savings', label: 'Monthly Savings (₹)' },
          ].map((field) => (
            <div key={field.name} style={styles.fieldGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                style={styles.input}
                name={field.name}
                type="number"
                placeholder={`Enter ${field.label}`}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Analyse My Credit →'}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    width: '450px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '24px',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    color: '#555',
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '8px',
  },
  message: {
    textAlign: 'center',
    marginTop: '16px',
    color: '#667eea',
    fontWeight: 'bold',
  }
};

export default FinancialForm;