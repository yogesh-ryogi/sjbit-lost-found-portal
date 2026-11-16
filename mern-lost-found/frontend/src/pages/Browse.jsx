import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ItemCard from '../components/ItemCard';

const CATS = ['ID Card', 'Electronics', 'Books & Stationery', 'Accessories', 'Documents', 'Personal items', 'Others'];

export default function Browse() {
  const [params] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get('q') || '');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (type) p.set('type', type);
    if (category) p.set('category', category);
    if (status) p.set('status', status);
    api
      .get(`/items?${p}`)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrap">
      <div className="eyebrow">Campus listings</div>
      <h2 style={{ margin: '4px 0 16px' }}>Browse Lost &amp; Found</h2>

      <div className="filters panel" style={{ marginBottom: 18 }}>
        <input className="field" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Lost &amp; found</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          <option value="open">Open</option>
          <option value="claim_pending">Claim pending</option>
          <option value="returned">Returned</option>
        </select>
        <button className="btn" onClick={load}>
          Apply
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="panel muted" style={{ textAlign: 'center' }}>
          No items match your filters.
        </div>
      ) : (
        <div className="grid-3">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}

      <style>{`
        .eyebrow { font-size:12px; font-weight:800; color:var(--blue); letter-spacing:.1em; text-transform:uppercase; }
        .filters { display:grid; grid-template-columns:2fr 1fr 1fr 1fr auto; gap:10px; padding:14px; }
        @media(max-width:700px) { .filters { grid-template-columns:1fr 1fr; } }
      `}</style>
    </div>
  );
}
