import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState('bad'); // bad | fixing | good
  const [score, setScore] = useState(520);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
    runLoop();
  }, []);

  const runLoop = () => {
    setPhase('bad');
    setScore(520);

    // After 2.5s start fixing
    setTimeout(() => {
      setPhase('fixing');
      let s = 520;
      const iv = setInterval(() => {
        s += 5;
        setScore(s);
        if (s >= 780) {
          clearInterval(iv);
          setPhase('good');
          // Reset after 3s
          setTimeout(() => runLoop(), 3500);
        }
      }, 30);
    }, 2500);
  };

  const features = [
    { icon: '📊', title: 'Credit Analysis', desc: 'Deep analysis of your CIBIL score and financial behaviour', color: '#6366f1' },
    { icon: '🤖', title: 'AI Recommendations', desc: 'Personalised advice from Gemini AI tailored to you', color: '#8b5cf6' },
    { icon: '📈', title: 'Progress Tracking', desc: 'Track your score improvement journey over time', color: '#06b6d4' },
    { icon: '⚡', title: 'Instant Insights', desc: 'Know exactly why your score is low and how to fix it', color: '#f59e0b' },
  ];

  const cardBg = phase === 'good'
    ? 'linear-gradient(135deg, #064e3b, #065f46, #047857)'
    : phase === 'fixing'
    ? 'linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)'
    : 'linear-gradient(135deg, #1c1c1c, #2d2d2d, #3d1515)';

  const cardGlow = phase === 'good'
    ? '0 0 60px rgba(34,197,94,0.5), 0 0 120px rgba(34,197,94,0.2)'
    : phase === 'fixing'
    ? '0 0 40px rgba(99,102,241,0.4)'
    : '0 4px 20px rgba(0,0,0,0.5)';

  const scoreColor = phase === 'good' ? '#86efac' : phase === 'fixing' ? '#a5b4fc' : '#fca5a5';

  return (
    <div style={styles.container}>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={styles.navbar}>
          <span style={styles.navLogo}>💳 Credit Assistant</span>
        </div>

        <div style={{
          ...styles.heroContent,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s ease',
        }}>

          <div style={styles.pill}>
            <span style={styles.pillDot} />
            CIBIL Score Tracker
          </div>

          <h1 style={styles.heroTitle}>
            Take Control of Your<br />
            <span style={styles.heroGrad}>Financial Future</span>
          </h1>

          <p style={styles.heroSub}>
            AI-powered credit score analysis built for India.
            Know your score, fix it fast.
          </p>

          {/* THE CARD ANIMATION */}
          <div style={styles.cardScene}>

            {/* Credit Card */}
            <div style={{
              ...styles.creditCard,
              background: cardBg,
              boxShadow: cardGlow,
              transform: phase === 'bad' ? 'rotate(-2deg) scale(1)' : phase === 'fixing' ? 'rotate(0deg) scale(1.02)' : 'rotate(0deg) scale(1.05)',
              transition: 'all 1s ease',
            }}>
              {/* Card chip */}
              <div style={styles.chip}>
                <div style={styles.chipLine1} />
                <div style={styles.chipLine2} />
              </div>

              {/* Card number */}
              <div style={styles.cardNumber}>
                {phase === 'bad' ? '•••• •••• •••• ••••' : '4521 •••• •••• 7890'}
              </div>

              {/* Score on card */}
              <div style={styles.cardBottom}>
                <div>
                  <p style={styles.cardScoreLabel}>CIBIL SCORE</p>
                  <p style={{ ...styles.cardScoreNum, color: scoreColor }}>
                    {score}
                  </p>
                </div>
                <div style={styles.cardStatus}>
                  {phase === 'bad' && <span style={styles.statusBad}>⚠ POOR</span>}
                  {phase === 'fixing' && <span style={styles.statusFixing}>⏳ IMPROVING</span>}
                  {phase === 'good' && <span style={styles.statusGood}>✦ EXCELLENT</span>}
                </div>
              </div>

              {/* Crack overlay — only when bad */}
              {phase === 'bad' && (
                <svg style={styles.crackSvg} viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 160 0 L 140 70 L 180 80 L 150 220" stroke="rgba(239,68,68,0.6)" strokeWidth="2" fill="none" />
                  <path d="M 220 0 L 240 60 L 200 90 L 230 160 L 210 220" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" fill="none" />
                  <path d="M 140 70 L 100 100" stroke="rgba(239,68,68,0.3)" strokeWidth="1" fill="none" />
                  <path d="M 180 80 L 240 60" stroke="rgba(239,68,68,0.3)" strokeWidth="1" fill="none" />
                </svg>
              )}

              {/* Glow particles when good */}
              {phase === 'good' && (
                <div style={styles.particles}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                      ...styles.particle,
                      top: `${10 + i * 15}%`,
                      left: `${10 + i * 14}%`,
                      animationDelay: `${i * 0.3}s`,
                    }} />
                  ))}
                </div>
              )}

              {/* Card logo */}
              <div style={styles.cardLogo}>💳</div>
            </div>

            {/* Side message */}
            <div style={styles.sideMessage}>
              {phase === 'bad' && (
                <div style={styles.msgBox('red')}>
                  <p style={styles.msgTitle}>🔴 Score Too Low</p>
                  <p style={styles.msgLine}> Loan applications rejected</p>
                  <p style={styles.msgLine}> High interest rates</p>
                  <p style={styles.msgLine}> Limited credit access</p>
                  <div style={styles.msgDivider} />
                  <p style={styles.msgHint}>Credit Assistant can fix this →</p>
                </div>
              )}
              {phase === 'fixing' && (
                <div style={styles.msgBox('blue')}>
                  <p style={styles.msgTitle}>AI Analysing</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '12px 0' }}>
                    {['Credit history', 'Issues found', 'Building plan'].map((label, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          height: '6px', borderRadius: '4px',
                          flex: 1,
                          background: 'rgba(255,255,255,0.1)',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            width: i === 0 ? '100%' : i === 1 ? '100%' : `${((score - 520) / 260) * 100}%`,
                            background: i === 2
                              ? 'linear-gradient(90deg, #6366f1, #a5b4fc)'
                              : 'linear-gradient(90deg, #22c55e, #86efac)',
                            borderRadius: '4px',
                            transition: 'width 0.1s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', minWidth: '90px', textAlign: 'right' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.msgDivider} />
                  <p style={styles.msgHint}>{score} / 900</p>
                </div>
              )}
              {phase === 'good' && (
                <div style={styles.msgBox('green')}>
                  <p style={styles.msgTitle}> ✅ Score Improved!</p>
                  <p style={styles.msgLine}> Loan eligible now</p>
                  <p style={styles.msgLine}> Best interest rates</p>
                  <p style={styles.msgLine}> +260 points in 6 months</p>
                  <div style={styles.msgDivider} />
                  <p style={styles.msgHint}>520 → 780 with AI guidance</p>
                </div>
              )}
            </div>

          </div>

          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => navigate('/register')}>
              🚀 Get Started Free
            </button>
            <button style={styles.btnOutline} onClick={() => navigate('/register')}>
              Login →
            </button>
          </div>

        </div>
      </div>

      {/* FEATURES */}
      <div style={styles.featSection}>
        <p style={styles.featEyebrow}>WHAT WE OFFER</p>
        <h2 style={styles.featTitle}>Everything to Improve Your Credit</h2>
        <div style={styles.featGrid}>
          {features.map((f, i) => (
            <div key={i} style={{ ...styles.featCard, borderLeft: `4px solid ${f.color}` }}>
              <div style={{ ...styles.featIconWrap, background: `${f.color}18` }}>
                <span style={styles.featIcon}>{f.icon}</span>
              </div>
              <h3 style={{ ...styles.featCardTitle, color: f.color }}>{f.title}</h3>
              <p style={styles.featCardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={styles.howSection}>
        <p style={styles.howEyebrow}>SIMPLE PROCESS</p>
        <h2 style={styles.howTitle}>How It Works</h2>
        <div style={styles.howGrid}>
          {[
            { n: '01', icon: '📝', title: 'Register', desc: 'Create your free account in seconds' },
            { n: '02', icon: '💰', title: 'Enter Details', desc: 'Input your credit and financial data' },
            { n: '03', icon: '🔍', title: 'AI Analysis', desc: 'Gemini AI analyses your credit health' },
            { n: '04', icon: '📈', title: 'Improve', desc: 'Follow the roadmap and track progress' },
          ].map((s, i) => (
            <div key={i} style={styles.howCard}>
              <div style={styles.howNum}>{s.n}</div>
              <div style={styles.howIconWrap}>{s.icon}</div>
              <h4 style={styles.howCardTitle}>{s.title}</h4>
              <p style={styles.howCardDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Improve Your Score?</h2>
        <p style={styles.ctaSub}>Start your credit improvement journey today — it's completely free.</p>
        <button style={styles.ctaBtn} onClick={() => navigate('/register')}>
          Get Started Free →
        </button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    background: '#0f172a',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  hero: {
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px 60px',
  },
  blob1: {
    position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
    top: '-150px', right: '-100px',
  },
  blob2: {
    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
    bottom: '-100px', left: '-100px',
  },
  navbar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    padding: '28px 40px', display: 'flex', justifyContent: 'center', zIndex: 10,
  },
  navLogo: { fontSize: '28px', fontWeight: '800', color: 'white', letterSpacing: '1px' },
  heroContent: {
    position: 'relative', zIndex: 2,
    textAlign: 'center', maxWidth: '900px', paddingTop: '90px',
  },
  pill: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
    color: '#a5b4fc', padding: '8px 20px', borderRadius: '20px',
    fontSize: '15px', fontWeight: '600', marginBottom: '28px',
  },
  pillDot: {
    width: '10px', height: '10px', borderRadius: '50%',
    background: '#22c55e', boxShadow: '0 0 8px #22c55e',
  },
  heroTitle: {
    fontSize: '56px', fontWeight: '800', color: 'white',
    margin: '0 0 20px', lineHeight: 1.15,
  },
  heroGrad: {
    background: 'linear-gradient(135deg, #818cf8, #c084fc, #67e8f9)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: '20px', color: 'rgba(255,255,255,0.65)',
    margin: '0 auto 36px', maxWidth: '500px', lineHeight: 1.7,
  },

  /* Card Scene */
  cardScene: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '32px', marginBottom: '40px', flexWrap: 'wrap',
  },
  creditCard: {
    width: '360px', height: '220px',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
    flexShrink: 0,
  },
  chip: {
    width: '44px', height: '34px',
    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
    borderRadius: '6px',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  chipLine1: {
    position: 'absolute', top: '50%', left: 0, right: 0,
    height: '1px', background: 'rgba(0,0,0,0.2)',
  },
  chipLine2: {
    position: 'absolute', top: 0, bottom: 0, left: '50%',
    width: '1px', background: 'rgba(0,0,0,0.2)',
  },
  cardNumber: {
    fontSize: '16px', color: 'rgba(255,255,255,0.7)',
    letterSpacing: '3px', marginBottom: '20px',
    fontFamily: 'monospace',
  },
  cardBottom: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  cardScoreLabel: {
    margin: '0 0 2px', fontSize: '10px',
    color: 'rgba(255,255,255,0.5)', letterSpacing: '2px',
  },
  cardScoreNum: {
    margin: 0, fontSize: '36px', fontWeight: '900',
    transition: 'color 0.3s ease',
  },
  cardStatus: { textAlign: 'right' },
  statusBad: {
    background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
    color: '#fca5a5', padding: '6px 12px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '700', letterSpacing: '1px',
  },
  statusFixing: {
    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
    color: '#a5b4fc', padding: '6px 12px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '700', letterSpacing: '1px',
  },
  statusGood: {
    background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)',
    color: '#86efac', padding: '6px 12px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '700', letterSpacing: '1px',
  },
  crackSvg: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none',
  },
  particles: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute', width: '6px', height: '6px',
    borderRadius: '50%', background: '#86efac',
    boxShadow: '0 0 8px #22c55e',
    animation: 'pulse 1.5s infinite',
  },
  cardLogo: {
    position: 'absolute', top: '20px', right: '20px',
    fontSize: '28px', opacity: 0.8,
  },

  /* Side Message */
  sideMessage: { width: '240px' },
  msgBox: (color) => ({
    background: color === 'red' ? 'rgba(239,68,68,0.08)' : color === 'green' ? 'rgba(34,197,94,0.08)' : 'rgba(99,102,241,0.08)',
    border: `1px solid ${color === 'red' ? 'rgba(239,68,68,0.25)' : color === 'green' ? 'rgba(34,197,94,0.25)' : 'rgba(99,102,241,0.25)'}`,
    borderRadius: '16px', padding: '20px', textAlign: 'left',
  }),
  msgTitle: {
    color: 'white', fontWeight: '800', fontSize: '16px', margin: '0 0 12px',
  },
  msgLine: {
    color: 'rgba(255,255,255,0.7)', fontSize: '14px',
    margin: '0 0 6px', lineHeight: 1.5,
  },
  msgDivider: {
    height: '1px', background: 'rgba(255,255,255,0.1)',
    margin: '12px 0',
  },
  msgHint: {
    color: 'rgba(255,255,255,0.5)', fontSize: '13px',
    margin: 0, fontStyle: 'italic',
  },

  btnRow: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    padding: '16px 40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '18px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
  },
  btnOutline: {
    padding: '16px 36px', background: 'transparent', color: 'white',
    border: '2px solid rgba(255,255,255,0.25)', borderRadius: '12px',
    fontSize: '18px', fontWeight: '700', cursor: 'pointer',
  },

  /* Features */
  featSection: {
    padding: '90px 40px',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    textAlign: 'center',
  },
  featEyebrow: { color: '#818cf8', fontWeight: '700', fontSize: '16px', letterSpacing: '4px', margin: '0 0 16px' },
  featTitle: { fontSize: '38px', fontWeight: '800', color: 'white', margin: '0 0 52px' },
  featGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px', maxWidth: '860px', margin: '0 auto',
  },
  featCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    padding: '32px', borderRadius: '16px', textAlign: 'left',
  },
  featIconWrap: {
    width: '56px', height: '56px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
  },
  featIcon: { fontSize: '28px' },
  featCardTitle: { margin: '0 0 10px', fontSize: '20px', fontWeight: '700' },
  featCardDesc: { margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: '16px', lineHeight: 1.65 },

  /* How */
  howSection: {
    padding: '90px 40px',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
    textAlign: 'center',
  },
  howEyebrow: { color: '#a5b4fc', fontWeight: '700', fontSize: '16px', letterSpacing: '4px', margin: '0 0 16px' },
  howTitle: { fontSize: '38px', fontWeight: '800', color: 'white', margin: '0 0 52px' },
  howGrid: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' },
  howCard: {
    width: '190px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px 20px', textAlign: 'center',
  },
  howNum: { fontSize: '13px', fontWeight: '700', color: '#a5b4fc', letterSpacing: '2px', marginBottom: '14px' },
  howIconWrap: { fontSize: '40px', marginBottom: '18px' },
  howCardTitle: { margin: '0 0 10px', color: 'white', fontSize: '18px', fontWeight: '700' },
  howCardDesc: { margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.5 },

  /* CTA */
  ctaSection: {
    padding: '90px 40px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
    textAlign: 'center',
  },
  ctaTitle: { fontSize: '40px', fontWeight: '800', color: 'white', margin: '0 0 16px' },
  ctaSub: { color: 'rgba(255,255,255,0.85)', fontSize: '18px', margin: '0 0 36px', lineHeight: 1.6 },
  ctaBtn: {
    padding: '18px 52px', background: 'white', color: '#6366f1',
    border: 'none', borderRadius: '12px', fontSize: '19px',
    fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
};

export default Landing;