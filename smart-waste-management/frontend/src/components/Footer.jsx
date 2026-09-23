import { Recycle, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--forest-dark)' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Recycle size={18} />
            </div>
            <strong style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}>EcoTrack AI</strong>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0 }}>
            Smart civic waste management powered by automated AI triage and real-time municipal routing. Keeping neighborhoods cleaner and healthier.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
            <strong style={{ color: 'var(--ink)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Navigation</strong>
            <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
            <Link to="/assistant" style={{ color: 'var(--muted)' }}>Report Issue</Link>
            <Link to="/complaints" style={{ color: 'var(--muted)' }}>My Complaints</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
            <strong style={{ color: 'var(--ink)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>System Operations</strong>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--forest-dark)', fontWeight: 600 }}>
              <span className="live-dot" style={{ width: '6px', height: '6px' }}></span> AI Triage Engine: Online
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)' }}>
              <ShieldCheck size={14} color="var(--primary)" /> RPA Dispatch: Active
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)' }}>
              <Sparkles size={14} color="var(--warning)" /> Instant Prioritization
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} EcoTrack Municipal Waste Platform. Built for cleaner communities.</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          Rinse recyclables to prevent contamination <Recycle size={14} color="var(--primary)" />
        </span>
      </div>
    </footer>
  );
}
