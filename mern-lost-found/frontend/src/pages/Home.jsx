import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    returned: 0,
  });

  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          api.get('/items'),
          api.get('/items/stats/summary'),
        ]);

        setItems(itemsRes.data.slice(0, 3));
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const search = () => {
    navigate(`/browse?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="wrap">

      {/* HERO SECTION */}
      <div className="hero">

        <div className="hero-copy">
          <div className="eyebrow">
            SJBIT · CSE Department
          </div>

          <h1>
            Lost something
            <br />
            on campus?
          </h1>

          <p>
            Report, find and return belongings across SJBIT.
            A secure portal for the CSE community.
          </p>

          <div className="actions">
            <Link to="/report" className="btn">
              ＋ Report item
            </Link>

            <Link to="/browse" className="btn secondary">
              Browse items
            </Link>
          </div>
        </div>

        {/* CAMPUS IMAGE */}
        <div
          className="hero-art"
          style={{
            backgroundImage: "url('/images.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </div>

      </div>

      {/* STATISTICS SECTION */}
      <div className="stats">

        <div className="stat">
          <strong>{String(stats.total ?? 0).padStart(2, '0')}</strong>
          <small>Total reports</small>
        </div>

        <div className="stat">
          <strong>{String(stats.lost ?? 0).padStart(2, '0')}</strong>
          <small>Lost</small>
        </div>

        <div className="stat">
          <strong>{String(stats.found ?? 0).padStart(2, '0')}</strong>
          <small>Found</small>
        </div>

        <div className="stat">
          <strong>{String(stats.returned ?? 0).padStart(2, '0')}</strong>
          <small>Returned</small>
        </div>

      </div>

      {/* RECENT ITEMS */}
      <div className="section-head">

        <div>
          <h2>Recent items</h2>
          <p className="muted">
            Latest reports from campus
          </p>
        </div>

        <Link to="/browse" className="muted">
          View all →
        </Link>

      </div>

      {/* SEARCH SECTION */}
      <div className="search-row">

        <input
          className="field"
          type="search"
          placeholder="Search item name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') search();
          }}
        />

        <button className="btn" onClick={search}>
          Search
        </button>

      </div>

      {/* ITEM CARDS */}
      <div className="grid-3">

        {loading ? (
          <p>Loading recent items...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))
        ) : (
          <p className="muted">
            No recent items available.
          </p>
        )}

      </div>

      {/* CSS */}
      <style>{`
        .hero {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          min-height: 340px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 22px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .hero-copy {
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow {
          font-size: 12px;
          font-weight: 800;
          color: var(--blue);
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .hero h1 {
          font-size: clamp(32px, 4.5vw, 48px);
          line-height: 1.05;
          letter-spacing: -.04em;
          margin: 12px 0;
        }

        .hero p {
          color: var(--muted);
          max-width: 400px;
          margin: 0 0 20px;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .actions a {
          text-decoration: none;
          display: inline-block;
        }

        .hero-art {
          background: linear-gradient(120deg, #092b54, #155eef 70%, #78b7ec);
          display: grid;
          place-items: center;
          position: relative;
          min-height: 260px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        .stat {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px;
          text-align: center;
        }

        .stat strong {
          display: block;
          font-size: 26px;
          color: var(--blue);
        }

        .stat small {
          color: var(--muted);
          font-size: 12px;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 14px;
        }

        .section-head h2 {
          margin: 0;
          font-size: 22px;
        }

        .search-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .search-row .field {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 800px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .hero-copy {
            padding: 32px 24px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .search-row {
            flex-direction: column;
          }

          .search-row .btn {
            width: 100%;
          }

          .section-head {
            align-items: center;
          }
        }
      `}</style>

    </div>
  );
}