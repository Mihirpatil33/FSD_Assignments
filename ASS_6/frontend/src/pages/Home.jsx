import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CATEGORIES = [
  { key: 'all', label: '✨ All', emoji: '' },
  { key: 'car', label: '🚗 Cars', emoji: '🚗' },
  { key: 'bike', label: '🏍️ Bikes', emoji: '🏍️' },
  { key: 'scooter', label: '🛵 Scooters', emoji: '🛵' },
  { key: 'truck', label: '🚛 Trucks', emoji: '🚛' },
  { key: 'van', label: '🚐 Vans', emoji: '🚐' },
];

const FEATURES = [
  { icon: '🔒', title: 'Secure Payments', desc: 'All transactions are encrypted and safe' },
  { icon: '📅', title: 'Easy Booking', desc: 'Schedule test drives in seconds' },
  { icon: '✅', title: 'Verified Sellers', desc: 'Every seller is background-checked' },
  { icon: '💬', title: '24/7 Support', desc: 'Always here to help with your deal' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'all') params.set('category', category);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content fade-in">
            <div className="hero-badge">
              <span>🚀</span> India's Premier Used Vehicle Platform
            </div>
            <h1 className="hero-title">
              Buy & Sell Used Vehicles<br />With Confidence
            </h1>
            <p className="hero-sub">
              Find your perfect ride from thousands of verified listings — cars, bikes,
              scooters, trucks & more. Book a test drive appointment instantly.
            </p>

            {/* Search */}
            <form className="search-box" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">🔍 Search</button>
            </form>

            {/* Category pills */}
            <div className="category-pills" style={{ justifyContent: 'center' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={`category-pill${category === c.key ? ' active' : ''}`}
                  onClick={() => setCategory(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hero-actions">
              <Link to="/listings" className="btn btn-primary btn-lg">Browse Listings</Link>
              <Link to="/create-listing" className="btn btn-secondary btn-lg">Sell Your Vehicle</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { value: '12,400+', label: 'Active Listings' },
              { value: '8,200+', label: 'Happy Sellers' },
              { value: '98%', label: 'Satisfaction Rate' },
              { value: '₹0', label: 'Listing Fee' },
            ].map((s) => (
              <div className="hero-stat" key={s.label}>
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Why Choose AutoDealr?</h2>
            <p className="section-subtitle">Everything you need for a smooth vehicle transaction</p>
          </div>
          <div className="grid grid-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-body" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to your next vehicle</p>
          </div>
          <div className="grid grid-3">
            {[
              { step: '01', title: 'Browse Listings', desc: 'Search through thousands of verified vehicles using our powerful filters.', icon: '🔍' },
              { step: '02', title: 'Book Appointment', desc: 'Schedule a test drive directly with the seller at your preferred time.', icon: '📅' },
              { step: '03', title: 'Close the Deal', desc: 'Meet the seller, inspect the vehicle, and drive home in your new ride.', icon: '🤝' },
            ].map((step) => (
              <div key={step.step} className="card card-body" style={{ padding: 32, position: 'relative', overflow: 'visible' }}>
                <div style={{
                  fontSize: '3rem', fontWeight: 900, color: 'var(--border-accent)',
                  position: 'absolute', top: 16, right: 20, opacity: 0.4
                }}>
                  {step.step}
                </div>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, rgba(99,126,255,0.15) 0%, rgba(167,139,250,0.1) 100%)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Ready to Sell Your Vehicle?</h2>
          <p className="section-subtitle">List for free and reach thousands of buyers today</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/listings" className="btn btn-ghost btn-lg">View All Listings</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
        padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'
      }}>
        <div className="container">
          <p>🚗 <strong style={{ color: 'var(--text-primary)' }}>AutoDealr</strong> — Online Vehicle Marketplace & Appointment Booking</p>
          <p style={{ marginTop: 8 }}>Built with Node.js, Express, MongoDB & React</p>
        </div>
      </footer>
    </div>
  );
}
