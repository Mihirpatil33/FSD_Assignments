import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CATEGORIES = ['car', 'bike', 'scooter', 'truck', 'van', 'other'];

export default function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '', category: 'car', make: '', model: '', year: new Date().getFullYear(),
    price: '', mileage: '', condition: 'good', transmission: 'manual',
    fuelType: 'petrol', color: '', description: '', location: user?.location || '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.make || !form.model || !form.price || !form.location) {
      return setError('Please fill in all required fields.');
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append('images', img));

      const { data } = await api.post('/listings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/listings/${data.listing._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 760 }}>
        <div className="page-header">
          <h1>List Your Vehicle</h1>
          <p>Fill in the details below to create your free listing</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic Info */}
          <div className="card card-body">
            <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Basic Information
            </h2>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Listing Title *</label>
                <input id="cl-title" className="form-control" name="title" placeholder="e.g. 2020 Honda City Petrol Manual - Excellent Condition" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select id="cl-category" className="form-control" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Make (Brand) *</label>
                <input id="cl-make" className="form-control" name="make" placeholder="Honda, Maruti, Royal Enfield..." value={form.make} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Model *</label>
                <input id="cl-model" className="form-control" name="model" placeholder="City, Swift, Classic 350..." value={form.model} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Year *</label>
                <input id="cl-year" className="form-control" name="year" type="number" min="1990" max={new Date().getFullYear() + 1} value={form.year} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input id="cl-price" className="form-control" name="price" type="number" min="0" placeholder="500000" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mileage (km)</label>
                <input id="cl-mileage" className="form-control" name="mileage" type="number" min="0" placeholder="35000" value={form.mileage} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Vehicle Specs */}
          <div className="card card-body">
            <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Vehicle Specifications
            </h2>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Condition</label>
                <select id="cl-condition" className="form-control" name="condition" value={form.condition} onChange={handleChange}>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs-repair">Needs Repair</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Transmission</label>
                <select id="cl-transmission" className="form-control" name="transmission" value={form.transmission} onChange={handleChange}>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fuel Type</label>
                <select id="cl-fuel" className="form-control" name="fuelType" value={form.fuelType} onChange={handleChange}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input id="cl-color" className="form-control" name="color" placeholder="Pearl White, Midnight Black..." value={form.color} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Location & Description */}
          <div className="card card-body">
            <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Location & Description
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Location (City) *</label>
                <input id="cl-location" className="form-control" name="location" placeholder="Mumbai, Delhi, Bangalore..." value={form.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea id="cl-description" className="form-control" name="description" placeholder="Describe the vehicle's condition, history, features, reason for selling..." value={form.description} onChange={handleChange} rows={5} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card card-body">
            <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Photos (up to 8)
            </h2>
            <div className="form-group">
              <input
                id="cl-images"
                type="file"
                accept="image/*"
                multiple
                className="form-control"
                onChange={(e) => setImages(Array.from(e.target.files).slice(0, 8))}
                style={{ padding: '10px 14px', cursor: 'pointer' }}
              />
              {images.length > 0 && (
                <p style={{ fontSize: '0.82rem', color: 'var(--accent)', marginTop: 8 }}>
                  ✅ {images.length} photo{images.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          <button
            id="cl-submit"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? 'Creating Listing...' : '🚀 Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
