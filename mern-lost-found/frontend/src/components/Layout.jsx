import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    api
      .get('/notifications')
      .then((res) => setUnread(res.data.filter((n) => !n.read).length))
      .catch(() => {});
  }, [user]);

  const linkClass = ({ isActive }) => (isActive ? 'nav-btn active' : 'nav-btn');

  return (
    <>
      <header className="top">
        <nav className="nav">
          <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="crest">
              <img
                src="/sjbitbengaluru_logo.jpeg"
                alt="SJBIT"
              />
            </div>
            <div>
              <b>SJB INSTITUTE OF TECHNOLOGY</b>
              <small>CSE · Lost &amp; Found Portal</small>
            </div>
          </div>
          <div className="navlinks">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/browse" className={linkClass}>
              Browse
            </NavLink>
            {user && (
              <>
                <NavLink to="/report" className={linkClass}>
                  Report
                </NavLink>
                <NavLink to="/claims" className={linkClass}>
                  My claims
                </NavLink>
                <NavLink to="/notifications" className={linkClass}>
                  Alerts{unread > 0 ? ` (${unread})` : ''}
                </NavLink>
                {user.role === 'admin' && (
                  <>
                    <NavLink to="/admin" className={linkClass}>
                      Admin
                    </NavLink>
                    <NavLink to="/reports" className={linkClass}>
                      Reports
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
          {user ? (
            <div className="me">
              <span className="muted">{user.name}</span>
              <span className="role">{user.role}</span>
              <button className="btn secondary" onClick={() => { logout(); navigate('/'); }}>
                Log out
              </button>
            </div>
          ) : (
            <button className="btn secondary" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <b>SJB Institute of Technology</b>
            <br />
            <small>Department of Computer Science &amp; Engineering · Bengaluru</small>
          </div>
          <small>Lost &amp; Found Campus Portal</small>
        </div>
      </footer>
      <style>{`
        .top { background:#fff; border-bottom:1px solid var(--line); position:sticky; top:0; z-index:10; }
        .nav { max-width:1120px; margin:auto; padding:12px 20px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
        .brand { display:flex; align-items:center; gap:12px; margin-right:auto; }
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
        .brand b { display:block; font-size:13px; }
        .brand small { color:var(--muted); font-size:11px; }
        .navlinks { display:flex; gap:4px; flex-wrap:wrap; }
        .nav-btn { border:0; background:transparent; padding:8px 12px; color:#40516b; border-radius:8px; font-weight:650; font-size:13px; text-decoration:none; }
        .nav-btn:hover, .nav-btn.active { background:#edf4ff; color:var(--blue); }
        .me { display:flex; align-items:center; gap:10px; font-size:13px; }
        .role { background:#f1f5f9; padding:2px 8px; border-radius:12px; font-size:11px; text-transform:uppercase; }
        .footer { background:var(--navy); color:#fff; padding:22px 20px; margin-top:40px; }
        .footer-inner { max-width:1120px; margin:auto; display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; }
        .footer small { color:#bdcce0; }
      `}</style>
    </>
  );
}
