import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Recycle, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function AuthForm({ mode }) {
  const reg = mode === 'register';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const nav = useNavigate();

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const endpoint = reg ? '/auth/register' : '/auth/login';
      const data = await api(endpoint, { method: 'POST', body: f });
      signIn(data);
      nav(data.user?.role === 'admin' ? '/admin' : '/assistant');
    } catch (x) {
      setErr(x.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Recycle size={26} strokeWidth={2.4} />
          </div>
          <h2>{reg ? 'Create Citizen Account' : 'Welcome to EcoTrack'}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            {reg
              ? 'Join municipal operations to report waste and track cleanups.'
              : 'Sign in to access AI issue reporting and complaint tracking.'}
          </p>
        </div>

        {err && (
          <div className="err" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {reg && (
            <div className="input-group">
              <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  placeholder="e.g. Jane Doe"
                  value={f.name}
                  onChange={set('name')}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                placeholder="citizen@neighborhood.org"
                value={f.email}
                onChange={set('email')}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
              Password
            </label>
            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={f.password}
                onChange={set('password')}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            <span>{loading ? 'Please wait...' : reg ? 'Create Account' : 'Sign In to Dashboard'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Switch Link between Login & Register */}
        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
          {reg ? (
            <span>
              Already registered?{' '}
              <Link to="/login" style={{ fontWeight: 700 }}>
                Sign in here
              </Link>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <Link to="/register" style={{ fontWeight: 700 }}>
                Create one now
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
