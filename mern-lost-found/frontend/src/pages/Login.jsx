import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('in');
  const [form, setForm] = useState({ name: '', email: '', usn: '', password: '' });
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    navigate('/');
    return null;
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'in') {
        await login(form.email, form.password);
      } else {
        await register({
          name: form.name,
          email: form.email,
          usn: form.usn,
          password: form.password,
        });
      }
      navigate('/');
    } catch (err) {
      setToast(err.response?.data?.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: 420 }}>
      <div className="panel">
        <div className="brand-row">
          <div className="crest">
            <img src="/sjbitbengaluru_logo.jpeg" alt="SJBIT" />
          </div>
          <div>
            <strong>SJB Institute of Technology</strong>
            <div className="muted">CSE · Lost &amp; Found</div>
          </div>
        </div>
        <h2 style={{ margin: '12px 0 4px' }}>{mode === 'in' ? 'Sign in' : 'Create account'}</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Use your college email
        </p>
        <div className="tabs">
          <button type="button" className={mode === 'in' ? 'on' : ''} onClick={() => setMode('in')}>
            Sign in
          </button>
          <button type="button" className={mode === 'up' ? 'on' : ''} onClick={() => setMode('up')}>
            Register
          </button>
        </div>
        <form onSubmit={submit}>
          {mode === 'up' && (
            <>
              <label className="lbl">Full name</label>
              <input className="field" required value={form.name} onChange={(e) => set('name', e.target.value)} />
              <label className="lbl">USN</label>
              <input className="field" placeholder="1JB22CS000" value={form.usn} onChange={(e) => set('usn', e.target.value)} />
            </>
          )}
          <label className="lbl">College email</label>
          <input
            className="field"
            type="email"
            required
            placeholder="name@sjbit.edu"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <label className="lbl">Password</label>
          <input
            className="field"
            type="password"
            required
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
          />
          <button className="btn full" style={{ marginTop: 14 }} disabled={busy}>
            {busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Register'}
          </button>
        </form>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <style>{`
        .brand-row { display:flex; gap:12px; align-items:center; padding-bottom:14px; border-bottom:1px solid var(--line); }
        .crest {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #fff;
          display: grid;
          place-items: center;
          border: 1px solid #d8e5fa;
          overflow: hidden;
          flex-shrink: 0;
        }
        .crest img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .tabs { display:flex; gap:6px; margin:14px 0 10px; }
        .tabs button { border:0; background:transparent; padding:8px 14px; border-radius:8px; font-weight:650; color:var(--muted); }
        .tabs button.on { background:#edf4ff; color:var(--blue); }
        .lbl { display:block; font-size:12px; font-weight:700; color:#41516b; margin:12px 0 6px; }
      `}</style>
    </div>
  );
}
