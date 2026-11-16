import { Link } from 'react-router-dom';

const ICONS = {
  'ID Card': '🪪',
  Electronics: '🔌',
  'Books & Stationery': '📓',
  Accessories: '👜',
  Documents: '📄',
  'Personal items': '🎒',
  Others: '📦',
};

export default function ItemCard({ item }) {
  return (
    <article className="item-card">
      <div className="pic">
        {item.photo ? (
          <img src={item.photo} alt="" />
        ) : (
          <span>{ICONS[item.category] || '📦'}</span>
        )}
      </div>
      <div className="body">
        <div className="top">
          <h3>{item.title}</h3>
          <span className={`tag ${item.type === 'lost' ? 'lost' : ''}`}>{item.type}</span>
        </div>
        <p className="muted">
          {item.category} · {item.location}
        </p>
        <p className="muted" style={{ marginBottom: 12 }}>
          {new Date(item.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
          {' · '}
          <span className={`tag ${item.status === 'open' ? '' : item.status === 'claim_pending' ? 'pend' : 'mut'}`}>
            {item.status?.replace('_', ' ')}
          </span>
        </p>
        <Link to={`/items/${item._id}`} className="btn secondary full" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          View details
        </Link>
      </div>
      <style>{`
        .item-card { background:#fff; border:1px solid var(--line); border-radius:15px; overflow:hidden; transition:.2s; }
        .item-card:hover { transform:translateY(-3px); box-shadow:0 12px 25px #0b244012; }
        .item-card .pic { height:140px; display:grid; place-items:center; font-size:48px; background:linear-gradient(135deg,#e8f1fb,#f8fbff); overflow:hidden; }
        .item-card .pic img { width:100%; height:100%; object-fit:cover; }
        .item-card .body { padding:14px; }
        .item-card .top { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
        .item-card h3 { margin:0; font-size:15px; }
      `}</style>
    </article>
  );
}
