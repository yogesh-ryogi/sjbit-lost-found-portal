import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Toast from '../components/Toast';

const CATS = ['ID Card', 'Electronics', 'Books & Stationery', 'Accessories', 'Documents', 'Personal items', 'Others'];
const LOCS = ['Library', 'CSE Block', 'Main Block', 'Canteen', 'Parking Area', 'Sports Ground', 'CSE Lab 1', 'CSE Lab 2', 'Seminar Hall'];

export default function Report() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: '',
    location: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setToast('Select an image');
    if (file.size > 2.5 * 1024 * 1024) return setToast('Max 2.5 MB');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location) {
      return setToast('Fill all required fields');
    }
    setSaving(true);
    try {
      const { data } = await api.post('/items', { ...form, photo });
      setToast('Item posted');
      navigate(`/items/${data._id}`);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <div className="eyebrow">Help reunite belongings</div>
      <h2 style={{ margin: '4px 0 16px' }}>Report an item</h2>
      <form className="panel form" onSubmit={submit}>
        <label>
          Type *
          <select className="field" value={form.type} onChange={(e) => set('type', e.target.value)}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>
        <label>
          Title *
          <input className="field" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Blue water bottle" />
        </label>
        <label>
          Category *
          <select className="field" value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Select</option>
            {CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Location *
          <select className="field" value={form.location} onChange={(e) => set('location', e.target.value)}>
            <option value="">Select</option>
            {LOCS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label>
          Date *
          <input className="field" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </label>
        <label className="full">
          Description *
          <textarea className="field" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Colour, brand, unique marks…" />
        </label>
        <label className="full">
          Photo (optional)
          <input className="field" type="file" accept="image/*" onChange={onFile} />
        </label>
        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
        <button className="btn full" type="submit" disabled={saving}>
          {saving ? 'Posting…' : 'Submit report →'}
        </button>
      </form>
      <Toast message={toast} onClose={() => setToast('')} />
      <style>{`
        .eyebrow { font-size:12px; font-weight:800; color:var(--blue); letter-spacing:.1em; text-transform:uppercase; }
        .form { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .form label { display:block; font-size:12px; font-weight:700; color:#41516b; }
        .form label .field { margin-top:6px; }
        .form .full { grid-column:1/-1; }
        .preview { grid-column:1/-1; max-width:220px; border-radius:10px; overflow:hidden; border:1px solid var(--line); }
        .preview img { width:100%; display:block; max-height:160px; object-fit:cover; }
        @media(max-width:560px) { .form { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
