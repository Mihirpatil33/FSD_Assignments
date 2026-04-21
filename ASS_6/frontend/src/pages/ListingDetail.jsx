import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EMOJI = { car: '🚗', bike: '🏍️', scooter: '🛵', truck: '🚛', van: '🚐', other: '🔧' };
const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
];

function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active image state
  const [activeImg, setActiveImg] = useState(0);

  // Booking form
  const [apptForm, setApptForm] = useState({ date: '', timeSlot: '', message: '' });
  const [apptLoading, setApptLoading] = useState(false);
  const [apptError, setApptError] = useState('');
  const [apptSuccess, setApptSuccess] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`);
        setListing(data.listing);
      } catch (err) {
        setError('Listing not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApptError(''); setApptSuccess('');

    if (!apptForm.date || !apptForm.timeSlot) {
      return setApptError('Please select a date and time slot.');
    }

    // Check date is in the future
    if (new Date(apptForm.date) < new Date(new Date().toDateString())) {
      return setApptError('Please select a future date.');
    }

    setApptLoading(true);
    try {
      await api.post('/appointments', {
        listingId: id,
        date: apptForm.date,
        timeSlot: apptForm.timeSlot,
        message: apptForm.message,
      });
      setApptSuccess('✅ Appointment booked! Check your Dashboard for details.');
      setApptForm({ date: '', timeSlot: '', message: '' });
    } catch (err) {
      setApptError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setApptLoading(false);
    }
  };

  if (loading) return <div className="page"><div className="spinner-center"><div className="spinner" /></div></div>;
  if (error) return <div className="page"><div className="container" style={{ paddingTop: 40 }}><div className="alert alert-error">{error}</div></div></div>;

  const isOwner = user && listing.seller._id === user.id;
  const img = listing.images?.[activeImg] || null;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Link to="/listings" style={{ color: 'var(--accent)' }}>← Back to Browse</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{listing.title}</span>
        </div>

        <div className="detail-layout">
          {/* ── Left: Gallery + Details ── */}
          <div>
            {/* Gallery */}
            <div className="detail-gallery" style={{ marginBottom: 28 }}>
              <div style={{ height: 400, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {img ? (
                  <img className="detail-gallery-main" src={img} alt={listing.title} />
                ) : (
                  <span style={{ fontSize: '5rem' }}>{EMOJI[listing.category] || '🔧'}</span>
                )}
              </div>
              {listing.images?.length > 1 && (
                <div className="detail-gallery-thumbs" style={{ marginTop: 8 }}>
                  {listing.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      className={`detail-gallery-thumb${i === activeImg ? ' active' : ''}`}
                      alt={`img-${i}`}
                      onClick={() => setActiveImg(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="listing-card-category">{listing.category}</span>
                <StatusBadge status={listing.status} />
                {listing.featured && <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)' }}>⭐ Featured</span>}
              </div>
              <h1 className="detail-title">{listing.title}</h1>
              <div className="detail-price">{formatPrice(listing.price)}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>📍 {listing.location}</span>
                <span>👁 {listing.views} views</span>
                <span>📅 Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Specs */}
            <div className="detail-specs">
              {[
                { label: 'Year', value: listing.year },
                { label: 'Make', value: listing.make },
                { label: 'Model', value: listing.model },
                { label: 'Mileage', value: `${listing.mileage?.toLocaleString()} km` },
                { label: 'Condition', value: listing.condition?.replace('-', ' ') },
                { label: 'Transmission', value: listing.transmission },
                { label: 'Fuel Type', value: listing.fuelType },
                { label: 'Color', value: listing.color || 'N/A' },
              ].map((spec) => (
                <div key={spec.label} className="spec-item">
                  <div className="spec-label">{spec.label}</div>
                  <div className="spec-value" style={{ textTransform: 'capitalize' }}>{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {listing.description && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: 20, border: '1px solid var(--border)', marginTop: 20 }}>
                <h3 style={{ marginBottom: 12, fontWeight: 700 }}>Description</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div style={{ marginTop: 20, padding: 16, background: 'rgba(99,126,255,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-accent)' }}>
                <p style={{ fontWeight: 600, marginBottom: 12 }}>⚙️ You own this listing</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to="/dashboard" className="btn btn-secondary btn-sm">View in Dashboard</Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Seller Card + Book Appointment ── */}
          <div>
            {/* Seller Info */}
            <div className="seller-card" style={{ marginBottom: 20 }}>
              <h3>SELLER INFORMATION</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>
                  {listing.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{listing.seller?.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Member since {new Date(listing.seller?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
              {listing.seller?.phone && (
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: '0.875rem' }}>
                  📞 {listing.seller.phone}
                </div>
              )}
              {listing.seller?.location && (
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12, fontSize: '0.875rem' }}>
                  📍 {listing.seller.location}
                </div>
              )}
            </div>

            {/* Book Appointment */}
            {!isOwner && listing.status === 'available' && (
              <div className="seller-card">
                <h3>BOOK TEST DRIVE</h3>

                {apptSuccess && <div className="alert alert-success">{apptSuccess}</div>}
                {apptError && <div className="alert alert-error">{apptError}</div>}

                {!user ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.9rem' }}>
                      Login to book an appointment
                    </p>
                    <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Login to Book
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Preferred Date</label>
                      <input
                        id="appt-date"
                        type="date"
                        className="form-control"
                        min={today}
                        value={apptForm.date}
                        onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time Slot</label>
                      <select
                        id="appt-time"
                        className="form-control"
                        value={apptForm.timeSlot}
                        onChange={(e) => setApptForm({ ...apptForm, timeSlot: e.target.value })}
                        required
                      >
                        <option value="">Select a time...</option>
                        {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message (optional)</label>
                      <textarea
                        id="appt-message"
                        className="form-control"
                        placeholder="Any questions for the seller?"
                        value={apptForm.message}
                        onChange={(e) => setApptForm({ ...apptForm, message: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <button
                      id="appt-submit"
                      type="submit"
                      className="btn btn-primary"
                      disabled={apptLoading}
                      style={{ width: '100%' }}
                    >
                      {apptLoading ? 'Booking...' : '📅 Book Test Drive'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {listing.status !== 'available' && (
              <div className="seller-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🔒</span>
                <p style={{ color: 'var(--text-muted)', marginTop: 10 }}>
                  This vehicle is no longer available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
