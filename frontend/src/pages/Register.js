import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Register() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate password on register
    if (!isLogin) {
      if (form.password.length < 6) {
        setMessage('Password must be at least 6 characters.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/login`, {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('user_id', res.data.user_id);
        localStorage.setItem('user_name', res.data.name);
        setMessage('Welcome back! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        const res = await axios.post(`${API_BASE_URL}/register`, {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        });
        localStorage.setItem('user_id', res.data.user_id);
        localStorage.setItem('user_name', res.data.name);
        setMessage('Registered successfully! Redirecting...');
        setTimeout(() => navigate('/financial-data'), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💳 Credit Assistant</h1>
        <p style={styles.subtitle}>Your AI-powered financial advisor</p>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            type="button"
            style={{ ...styles.tab, ...(isLogin ? {} : styles.activeTab) }}
            onClick={() => { setIsLogin(false); setMessage(''); }}
          >
            Register
          </button>
          <button
            type="button"
            style={{ ...styles.tab, ...(isLogin ? styles.activeTab : {}) }}
            onClick={() => { setIsLogin(true); setMessage(''); }}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Register only fields */}
          {!isLogin && (
            <>
              <input
                style={styles.input} name="name"
                placeholder="Full Name"
                onChange={handleChange} required
              />
              <input
                style={styles.input} name="mobile"
                placeholder="Mobile Number"
                onChange={handleChange} required
              />
            </>
          )}

          {/* Common fields */}
          <input
            style={styles.input} name="email" type="email"
            placeholder="Email Address"
            onChange={handleChange} required
          />

          {/* Password field with show/hide */}
          <div style={styles.passwordWrap}>
            <input
              style={{ ...styles.input, marginBottom: 0 }}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChange={handleChange} required
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Confirm password on register */}
          {!isLogin && (
            <input
              style={{ ...styles.input, marginTop: '12px' }}
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              onChange={handleChange} required
            />
          )}

          {/* Password hint on register */}
          {!isLogin && (
            <p style={styles.hint}>Password must be at least 6 characters</p>
          )}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login →' : 'Get Started →'}
          </button>
        </form>

        {message && (
          <p style={{
            ...styles.message,
            color: message.includes('wrong') || message.includes('not') ||
                   message.includes('match') || message.includes('Incorrect') ||
                   message.includes('least')
              ? '#ef4444' : '#667eea'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    background: 'white', padding: '40px',
    borderRadius: '16px', width: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: { textAlign: 'center', color: '#333', marginBottom: '8px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '24px' },
  tabs: {
    display: 'flex', marginBottom: '24px',
    background: '#f1f5f9', borderRadius: '10px', padding: '4px',
  },
  tab: {
    flex: 1, padding: '10px', border: 'none',
    borderRadius: '8px', cursor: 'pointer',
    fontSize: '15px', background: 'transparent',
    color: '#666', fontWeight: 'bold',
  },
  activeTab: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  input: {
    width: '100%', padding: '12px',
    marginBottom: '14px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '16px',
    boxSizing: 'border-box',
  },
  passwordWrap: {
    position: 'relative',
    marginBottom: '0px',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '18px',
  },
  hint: {
    fontSize: '12px', color: '#94a3b8',
    margin: '6px 0 12px', paddingLeft: '4px',
  },
  button: {
    width: '100%', padding: '14px', marginTop: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer', fontWeight: 'bold',
  },
  message: {
    textAlign: 'center', marginTop: '16px',
    fontWeight: 'bold', fontSize: '14px',
  },
};

export default Register;