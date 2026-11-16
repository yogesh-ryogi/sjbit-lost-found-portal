import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [proof, setProof] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setToast('Item not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const claim = async () => {
    if (!proof.trim()) return setToast('Enter proof of ownership');
    try {
      await api.post('/claims', { itemId: id, proof });
      setToast('Claim submitted');
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
      setProof('');
    } catch (err) {
      setToast(err.response?.data?.message || 'Claim failed');
    }
  };

  if (loading) return <div className="wrap muted">Loading…</div>;
  if (!item) return <div className="wrap">Item not found. <Link to="/browse">Back</Link></div>;

  const isOwner = user && String(item.postedBy?._id || item.postedBy) === String(user.id || user._id);
  const canClaim =
    user &&
    !isOwner &&
    item.type === 'found' &&
    item.status !== 'returned' &&
    user.role !== 'admin';

  return (
    <div className="wrap">
      <Link to="/browse" className="muted">← Back to browse</Link>
      <div className="detail">
        <div className="panel">
          <div className="pic">
            {item.photo ? <img src={item.photo} alt="" /> : <span style={{ fontSize: 72 }}>📦</span>}
          </div>
          <h2>{item.title}</h2>
          <div style={{ marginBottom: 12 }}>
            <span className={`tag ${item.type === 'lost' ? 'lost' : ''}`}>{item.type}</span>{' '}
            <span className="tag mut">{item.status?.replace('_', ' ')}</span>
          </div>
          <p>{item.description}</p>
          <table className="meta-table">
            <tbody>
              <tr><th>Category</th><td>{item.category}</td></tr>
              <tr><th>Location</th><td>{item.location}</td></tr>
              <tr><th>Date</th><td>{new Date(item.date).toLocaleDateString()}</td></tr>
              <tr><th>Posted by</th><td>{item.postedBy?.name || '—'}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className="panel">
            {isOwner && <p className="note">You posted this item.</p>}
            {item.type === 'lost' && !isOwner && (
              <p className="note">This is a lost report. If you found it, post it as Found.</p>
            )}
            {item.status === 'returned' && <p className="note">Item has been returned.</p>}
            {canClaim && (
              <>
                <h3 style={{ marginTop: 0 }}>Claim this item</h3>
                <textarea
                  className="field"
                  rows={3}
                  placeholder="Describe unique marks or contents as proof"
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                />
                <button className="btn" style={{ marginTop: 10 }} onClick={claim}>
                  Submit claim
                </button>
              </>
            )}
            {!user && item.type === 'found' && item.status !== 'returned' && (
              <p className="note">
                <Link to="/login">Sign in</Link> to claim this item.
              </p>
            )}
          </div>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <style>{`
        .detail { display:grid; grid-template-columns:1.2fr .8fr; gap:18px; margin-top:16px; }
        .pic { height:220px; border-radius:12px; background:#eef4fb; display:grid; place-items:center; overflow:hidden; margin-bottom:14px; }
        .pic img { width:100%; height:100%; object-fit:cover; }
        .meta-table { width:100%; border-collapse:collapse; font-size:14px; }
        .meta-table th { text-align:left; color:var(--muted); font-weight:600; padding:8px 0; width:110px; }
        .meta-table td { padding:8px 0; }
        .note { background:#dbeafe; color:#1d4ed8; padding:12px; border-radius:10px; margin:0; }
        @media(max-width:700px) { .detail { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
