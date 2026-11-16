import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/claims/mine')
      .then((res) => setClaims(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="wrap">
      <h2>My claims</h2>
      <div className="panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : claims.length === 0 ? (
          <p className="muted">You have not made any claims yet.</p>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Item</th>
                <th>Proof</th>
                <th>Status</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c._id}>
                  <td>
                    <Link to={`/items/${c.item?._id}`}>{c.item?.title || '—'}</Link>
                  </td>
                  <td>{c.proof}</td>
                  <td>
                    <span
                      className={`tag ${
                        c.status === 'pending' ? 'pend' : c.status === 'rejected' ? 'lost' : ''
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>{c.remark || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        .tbl { width:100%; border-collapse:collapse; font-size:14px; }
        .tbl th, .tbl td { text-align:left; padding:10px 12px; border-bottom:1px solid var(--line); vertical-align:top; }
        .tbl th { color:var(--muted); font-size:11px; text-transform:uppercase; }
      `}</style>
    </div>
  );
}
