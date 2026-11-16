import { useEffect, useState } from 'react';
import api from '../api/client';
import Toast from '../components/Toast';

export default function Admin() {
  const [pending, setPending] = useState([]);
  const [all, setAll] = useState([]);
  const [stats, setStats] = useState({});
  const [remarks, setRemarks] = useState({});
  const [toast, setToast] = useState('');

  const load = async () => {
    const [p, a, s] = await Promise.all([
      api.get('/claims/pending'),
      api.get('/claims'),
      api.get('/items/stats/summary'),
    ]);
    setPending(p.data);
    setAll(a.data.filter((c) => c.status !== 'pending'));
    setStats(s.data);
  };

  useEffect(() => {
    load().catch(() => setToast('Failed to load admin data'));
  }, []);

  const decide = async (id, approve) => {
    try {
      await api.patch(`/claims/${id}/decide`, {
        approve,
        remark: remarks[id] || '',
      });
      setToast(approve ? 'Claim approved' : 'Claim rejected');
      load();
    } catch (err) {
      setToast(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="wrap">
      <h2>Admin dashboard</h2>
      <div className="stats-row">
        <div className="panel stat"><strong>{stats.total ?? '–'}</strong><span>Total items</span></div>
        <div className="panel stat"><strong>{stats.open ?? '–'}</strong><span>Open</span></div>
        <div className="panel stat"><strong>{pending.length}</strong><span>Pending claims</span></div>
        <div className="panel stat"><strong>{stats.returned ?? '–'}</strong><span>Returned</span></div>
      </div>

      <h3>Pending claims</h3>
      {pending.length === 0 ? (
        <div className="panel muted">No pending claims.</div>
      ) : (
        pending.map((c) => (
          <div key={c._id} className="panel claim-card">
            <div>
              <h3 style={{ margin: '0 0 6px' }}>{c.item?.title}</h3>
              <p className="muted">
                {c.item?.category} · {c.item?.location} · posted by {c.item?.postedBy?.name || '—'}
              </p>
              <p>
                <b>Claimant:</b> {c.claimant?.name} ({c.claimant?.email})
              </p>
              <p>
                <b>Proof:</b> {c.proof}
              </p>
            </div>
            <div>
              <label className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
                Remark
              </label>
              <input
                className="field"
                placeholder="Reason for decision"
                value={remarks[c._id] || ''}
                onChange={(e) => setRemarks((r) => ({ ...r, [c._id]: e.target.value }))}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn green" onClick={() => decide(c._id, true)}>
                  Approve
                </button>
                <button className="btn red" onClick={() => decide(c._id, false)}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <h3 style={{ marginTop: 28 }}>Decided claims</h3>
      <div className="panel" style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Item</th>
              <th>Claimant</th>
              <th>Status</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {all.map((c) => (
              <tr key={c._id}>
                <td>{c.item?.title}</td>
                <td>{c.claimant?.name}</td>
                <td>
                  <span className={`tag ${c.status === 'rejected' ? 'lost' : ''}`}>{c.status}</span>
                </td>
                <td>{c.remark || '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <style>{`
        .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
        .stat { text-align:center; margin:0; }
        .stat strong { display:block; font-size:28px; color:var(--blue); }
        .stat span { font-size:12px; color:var(--muted); }
        .claim-card { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px; }
        .tbl { width:100%; border-collapse:collapse; font-size:14px; }
        .tbl th, .tbl td { text-align:left; padding:10px; border-bottom:1px solid var(--line); }
        .tbl th { color:var(--muted); font-size:11px; text-transform:uppercase; }
        @media(max-width:700px) {
          .stats-row { grid-template-columns:repeat(2,1fr); }
          .claim-card { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}
