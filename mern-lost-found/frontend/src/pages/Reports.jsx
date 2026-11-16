import { useEffect, useState } from 'react';
import api from '../api/client';

function Bars({ title, data }) {
  const entries = Object.entries(data || {});
  const max = Math.max(1, ...entries.map(([, n]) => n));
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {entries.length === 0 ? (
        <p className="muted">No data</p>
      ) : (
        entries.map(([k, n]) => (
          <div key={k} className="bar-row">
            <span>{k}</span>
            <div className="track">
              <i style={{ width: `${(n / max) * 100}%` }} />
            </div>
            <b>{n}</b>
          </div>
        ))
      )}
    </div>
  );
}

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/reports').then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="wrap muted">Loading reports…</div>;

  return (
    <div className="wrap">
      <h2>Reports</h2>
      <p className="muted">MongoDB aggregation ($group) on category, status, type and claim outcome.</p>
      <div className="two">
        <Bars title="Lost items by category" data={data.lostByCategory} />
        <Bars title="Items by status" data={data.itemsByStatus} />
        <Bars title="Claims by outcome" data={data.claimsByOutcome} />
        <Bars title="Items by type" data={data.itemsByType} />
      </div>
      <style>{`
        .two { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin-top:16px; }
        .bar-row { display:flex; align-items:center; gap:10px; margin:8px 0; font-size:14px; }
        .bar-row span { width:130px; color:var(--muted); flex-shrink:0; font-size:13px; }
        .track { flex:1; background:#f1f5f9; border-radius:6px; height:14px; overflow:hidden; }
        .track i { display:block; height:100%; background:linear-gradient(90deg,var(--blue),#3b82f6); border-radius:6px; }
      `}</style>
    </div>
  );
}
