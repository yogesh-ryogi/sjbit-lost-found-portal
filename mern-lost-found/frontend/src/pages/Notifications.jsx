import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Notifications() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get('/notifications')
      .then((res) => setNotes(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    await api.patch('/notifications/read-all');
    load();
  };

  return (
    <div className="wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>Notifications</h2>
        {notes.some((n) => !n.read) && (
          <button className="btn secondary" onClick={markAll}>
            Mark all as read
          </button>
        )}
      </div>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : notes.length === 0 ? (
        <div className="panel muted">No notifications.</div>
      ) : (
        notes.map((n) => (
          <div key={n._id} className={`panel note ${n.read ? '' : 'un'}`}>
            <span>{n.read ? '🔔' : '🔴'}</span>
            <div>
              <div>{n.message}</div>
              {n.item && (
                <Link className="muted" to={`/items/${n.item._id || n.item}`}>
                  View item →
                </Link>
              )}
            </div>
          </div>
        ))
      )}
      <style>{`
        .note { display:flex; gap:12px; align-items:flex-start; margin-bottom:10px; }
        .note.un { border-left:4px solid var(--blue); }
      `}</style>
    </div>
  );
}
