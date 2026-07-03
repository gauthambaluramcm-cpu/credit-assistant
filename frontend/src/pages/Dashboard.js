import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);

  const user_id = localStorage.getItem('user_id');
  const user_name = localStorage.getItem('user_name');

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/dashboard/${user_id}`);
      setDashboard(res.data);
      const historyRes = await axios.get(`http://127.0.0.1:8000/score-history/${user_id}`);
      setScoreHistory(historyRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    setAiLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/recommendations/${user_id}`);
      setRecommendations(res.data.ai_recommendations);
    } catch (err) { setRecommendations('Failed to load recommendations.'); }
    setAiLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 750) return '#22c55e';
    if (score >= 650) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent ✨';
    if (score >= 650) return 'Good 👍';
    if (score >= 550) return 'Fair ⚠️';
    return 'Poor 🔴';
  };

  const renderRecommendations = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###')) {
        return (
          <div key={i} style={styles.recHeading}>
            <span>{line.replace(/###/g, '').replace(/\*\*/g, '').trim()}</span>
          </div>
        );
      }
      if (line.match(/^\d\./)) {
        return (
          <div key={i} style={styles.recNumbered}>
            <span style={styles.recNumber}>{line.match(/^\d/)[0]}</span>
            <span>{line.replace(/^\d\./, '').replace(/\*\*/g, '').trim()}</span>
          </div>
        );
      }
      if (line.startsWith('* **') || (line.startsWith('* ') && line.includes('**'))) {
        return (
          <div key={i} style={styles.recHighlight}>
            💡 {line.replace(/\* \*\*/g, '').replace(/\*\*/g, '').replace('* ', '').trim()}
          </div>
        );
      }
      if (line.startsWith('* ')) {
        return (
          <div key={i} style={styles.recBullet}>
            <span style={styles.bulletDot}>●</span>
            <span>{line.replace('* ', '').replace(/\*\*/g, '').trim()}</span>
          </div>
        );
      }
      if (line.startsWith('---')) return <hr key={i} style={styles.recDivider} />;
      if (line.trim() === '') return <div key={i} style={{ height: '8px' }} />;
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={styles.recBold}>{line.replace(/\*\*/g, '')}</p>;
      }
      return <p key={i} style={styles.recText}>{line.replace(/\*\*/g, '')}</p>;
    });
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}>💳</div>
      <p style={styles.loadingText}>Loading your dashboard...</p>
    </div>
  );

  const utilizationData = [
    { name: 'Used', value: dashboard?.utilization },
    { name: 'Available', value: 100 - dashboard?.utilization },
  ];
  const COLORS = ['#ef4444', '#e5e7eb'];

  return (
    <div style={styles.container}>

     {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>💳 Credit Assistant</h1>
        <p style={styles.headerSub}>Welcome back, <strong>{user_name}</strong>!</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
          <button style={{...styles.updateButton, background: 'rgba(139,92,246,0.3)', color: 'white'}} onClick={() => navigate('/financial-data')}>
            📊 Update My Score
          </button>
          <button
            style={{ ...styles.updateButton, background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Score Card */}
      <div style={styles.scoreCard}>
        <p style={styles.cardLabel}>YOUR CIBIL SCORE</p>
        <div style={styles.scoreRow}>
          <span style={{ ...styles.scoreNumber, color: getScoreColor(dashboard?.credit_score) }}>
            {dashboard?.credit_score}
          </span>
          <span style={{ ...styles.scoreBadge, background: getScoreColor(dashboard?.credit_score) }}>
            {getScoreLabel(dashboard?.credit_score)}
          </span>
        </div>
        <div style={styles.scoreBarBg}>
          <div style={{
            ...styles.scoreBarFill,
            width: `${((dashboard?.credit_score - 300) / 600) * 100}%`,
            background: getScoreColor(dashboard?.credit_score)
          }} />
        </div>
        <div style={styles.scoreRange}>
          <span>300 — Poor</span>
          <span>600 — Fair</span>
          <span>750+ — Excellent</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.grid}>
        {[
          {
            label: 'Credit Utilization',
            value: `${dashboard?.utilization}%`,
            status: dashboard?.utilization > 30 ? 'danger' : 'good',
            hint: dashboard?.utilization > 30 ? '⚠️ Too High — Aim below 30%' : '✅ Healthy Range',
          },
          {
            label: 'Missed Payments',
            value: dashboard?.missed_payments,
            status: dashboard?.missed_payments > 0 ? 'danger' : 'good',
            hint: dashboard?.missed_payments > 0 ? '🚨 Critical Issue' : '✅ Perfect Record',
          },
          {
            label: 'Debt to Income',
            value: `${dashboard?.debt_to_income}%`,
            status: dashboard?.debt_to_income > 50 ? 'danger' : 'good',
            hint: dashboard?.debt_to_income > 50 ? '⚠️ High Burden' : '✅ Manageable',
          },
          {
            label: 'Monthly Savings',
            value: `₹${dashboard?.monthly_savings?.toLocaleString()}`,
            status: 'good',
            hint: '✅ Keep saving!',
          },
        ].map((stat, i) => (
          <div key={i} style={{
            ...styles.statCard,
            borderTop: `4px solid ${stat.status === 'danger' ? '#ef4444' : '#22c55e'}`
          }}>
            <p style={styles.statLabel}>{stat.label}</p>
            <p style={{
              ...styles.statValue,
              color: stat.status === 'danger' ? '#ef4444' : '#22c55e'
            }}>{stat.value}</p>
            <p style={styles.statHint}>{stat.hint}</p>
          </div>
        ))}
      </div>

      {/* Utilization Chart */}
      <div style={styles.chartCard}>
        <p style={styles.cardLabel}>CREDIT UTILIZATION BREAKDOWN</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={utilizationData} cx="50%" cy="50%"
              innerRadius={65} outerRadius={90} dataKey="value" paddingAngle={3}>
              {utilizationData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={styles.chartLegend}>
          <span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444', marginRight:'4px' }} />
          Used: {dashboard?.utilization}%
          &nbsp;&nbsp;
          <span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', background:'#e5e7eb', marginRight:'4px' }} />
          Available: {100 - dashboard?.utilization}%
        </div>
      </div>

      {/* Score History Chart */}
      {scoreHistory.length > 0 && (
        <div style={styles.chartCard}>
          <p style={styles.cardLabel}>SCORE IMPROVEMENT HISTORY</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[300, 900]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`Score: ${value}`, '']}
              />
              <Line
                type="monotone" dataKey="score"
                stroke="#2d6a9f" strokeWidth={3}
                dot={{ fill: '#2d6a9f', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>
            Your credit score journey over time
          </p>
        </div>
      )}

      {/* AI Section */}
      <div style={styles.aiCard}>
        <p style={styles.cardLabel}>AI FINANCIAL ADVISOR</p>
        <h3 style={styles.aiTitle}>🤖 Personalised Recommendations</h3>
        <p style={styles.aiSubtext}>
          Get expert advice tailored to your CIBIL profile from our AI advisor
        </p>

        {!recommendations && (
          <button style={styles.aiButton} onClick={fetchRecommendations} disabled={aiLoading}>
            {aiLoading ? '🤔 Analysing your profile...' : '✨ Get AI Recommendations'}
          </button>
        )}

        {recommendations && (
          <div style={styles.recommendationsBox}>
            {renderRecommendations(recommendations)}
          </div>
        )}
      </div>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: '820px', margin: '0 auto',
    padding: '20px', fontFamily: 'Segoe UI, sans-serif',
    background: '#0f172a', minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
  },
  loadingSpinner: { fontSize: '48px', marginBottom: '16px' },
  loadingText: { fontSize: '20px', color: '#667eea' },
  header: {
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    padding: '32px 24px', borderRadius: '20px',
    marginBottom: '20px', color: 'white', textAlign: 'center',
    border: '1px solid rgba(139,92,246,0.3)',
    boxShadow: '0 8px 32px rgba(99,102,241,0.2)',
  },
  headerTitle: {
    margin: '0 0 4px', fontSize: '36px',
    letterSpacing: '2px', fontWeight: '800',
    background: 'linear-gradient(135deg, #818cf8, #c084fc, #67e8f9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  headerSub: { margin: '8px 0 0', opacity: 0.85, fontSize: '16px' },
  scoreCard: {
    background: '#1e293b', padding: '28px',
    borderRadius: '16px', marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  cardLabel: {
    margin: '0 0 12px', color: '#94a3b8',
    fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px',
  },
  scoreRow: {
    display: 'flex', alignItems: 'center',
    gap: '16px', marginBottom: '20px',
  },
  scoreNumber: { fontSize: '72px', fontWeight: '800', lineHeight: 1 },
  scoreBadge: {
    color: 'white', padding: '6px 16px',
    borderRadius: '20px', fontSize: '14px', fontWeight: 'bold',
  },
  scoreBarBg: {
    background: '#e5e7eb', borderRadius: '8px',
    height: '10px', overflow: 'hidden', marginBottom: '8px',
  },
  scoreBarFill: { height: '100%', borderRadius: '8px', transition: 'width 1.5s ease' },
  scoreRange: {
    display: 'flex', justifyContent: 'space-between',
    color: '#94a3b8', fontSize: '11px',
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '16px', marginBottom: '20px',
  },
  statCard: {
    background: '#1e293b', padding: '20px',
    borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  statLabel: { margin: '0 0 8px', color: '#64748b', fontSize: '13px' },
  statValue: { margin: '0 0 6px', fontSize: '36px', fontWeight: '800' },
  statHint: { margin: 0, fontSize: '12px', color: '#94a3b8' },
  chartCard: {
    background: '#1e293b', padding: '24px',
    borderRadius: '16px', marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center',
  },
  chartLegend: { color: '#64748b', fontSize: '13px', marginTop: '8px' },
  aiCard: {
    background: '#1e293b', padding: '28px',
    borderRadius: '16px', marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  aiTitle: { margin: '0 0 8px', color: '#1e293b', fontSize: '20px' },
  aiSubtext: { color: '#64748b', marginBottom: '20px', fontSize: '14px' },
  aiButton: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '16px', cursor: 'pointer', fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  recommendationsBox: {
    background: '#f8fafc', padding: '24px',
    borderRadius: '12px', marginTop: '16px',
    maxHeight: '500px', overflowY: 'auto',
  },
  recHeading: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
    color: 'white', padding: '10px 16px',
    borderRadius: '8px', margin: '16px 0 10px',
    fontSize: '15px', fontWeight: 'bold',
  },
  recNumbered: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    background: '#eff6ff', border: '1px solid #bfdbfe',
    padding: '12px 16px', borderRadius: '10px',
    margin: '8px 0', color: '#1e40af', fontWeight: '600',
  },
  recNumber: {
    background: '#1e40af', color: 'white',
    width: '24px', height: '24px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 'bold', flexShrink: 0,
  },
  recHighlight: {
    background: '#fefce8', border: '1px solid #fde68a',
    padding: '10px 14px', borderRadius: '8px',
    margin: '6px 0', color: '#92400e', fontSize: '14px',
  },
  recBullet: {
    display: 'flex', gap: '10px',
    padding: '6px 8px', color: '#475569', fontSize: '14px',
    lineHeight: '1.6',
  },
  bulletDot: { color: '#2d6a9f', fontWeight: 'bold', flexShrink: 0 },
  recBold: {
    fontWeight: '700', color: '#1e3a5f',
    fontSize: '15px', margin: '8px 0',
  },
  recDivider: {
    border: 'none', borderTop: '2px solid #e2e8f0', margin: '16px 0',
  },
  recText: {
    color: '#475569', fontSize: '14px',
    lineHeight: '1.7', margin: '4px 0',
  },
  updateButton: {
    marginTop: '12px',
    padding: '10px 24px',
    background: '#1e293b',
    color: '#1e3a5f',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
},
};

export default Dashboard;