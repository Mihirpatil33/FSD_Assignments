import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EMOJI = { car: '🚗', bike: '🏍️', scooter: '🛵', truck: '🚛', van: '🚐', other: '🔧' };

function formatPrice(p) { return '₹' + Number(p).toLocaleString('en-IN'); }

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

function MyListings({ listings, onDelete, onStatusChange }) {
  if (!listings.length) return (
    <div className="empty-state">
      <div className="icon">📋</div>
      <h3>No listings yet</h3>
      <p>Start selling your vehicle today!</p>
      <Link to="/create-listing" className="btn btn-primary" style={{ marginTop: 16 }}>Create Listing</Link>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {listings.map((l) => (
        <div key={l._id} className="appt-item">
          <div style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {l.images?.[0] ? (
              <img src={l.images[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1.5rem' }}>{EMOJI[l.category]}</span>
            )}
          </div>
          <div className="appt-item-info">
            <div className="appt-item-title">
              <Link to={`/listings/${l._id}`} style={{ color: 'var(--text-primary)' }}>{l.title}</Link>
            </div>
            <div className="appt-item-meta">
              <span>{l.year} · {l.make} {l.model}</span>
              <span>{formatPrice(l.price)}</span>
              <span>📍 {l.location}</span>
              <span>👁 {l.views} views</span>
            </div>
          </div>
          <div className="appt-item-actions">
            <StatusBadge status={l.status} />
            {l.status === 'available' && (
              <button className="btn btn-sm btn-ghost" onClick={() => onStatusChange(l._id, 'sold')}>Mark Sold</button>
            )}
            {l.status === 'sold' && (
              <button className="btn btn-sm btn-ghost" onClick={() => onStatusChange(l._id, 'available')}>Relist</button>
            )}
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(l._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentsList({ appointments, isSeller = false, onAction }) {
  if (!appointments.length) return (
    <div className="empty-state">
      <div className="icon">📅</div>
      <h3>No appointments</h3>
      <p>{isSeller ? 'No one has booked a test drive yet.' : 'Browse listings and book a test drive!'}</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {appointments.map((a) => (
        <div key={a._id} className="appt-item">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
              <div className="appt-item-title">
                <Link to={`/listings/${a.listing?._id}`} style={{ color: 'var(--text-primary)' }}>
                  {a.listing?.title || 'Listing removed'}
                </Link>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="appt-item-meta">
              <span>📅 {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>⏰ {a.timeSlot}</span>
              {isSeller ? <span>👤 Buyer: {a.buyer?.name}</span> : <span>👤 Seller: {a.seller?.name}</span>}
              {a.listing?.location && <span>📍 {a.listing.location}</span>}
            </div>
            {a.message && (
              <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                "{a.message}"
              </div>
            )}
            {a.sellerNote && a.sellerNote !== '' && (
              <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--success)' }}>
                Seller note: {a.sellerNote}
              </div>
            )}
          </div>
          <div className="appt-item-actions">
            {isSeller && a.status === 'pending' && (
              <>
                <button className="btn btn-sm btn-success" onClick={() => onAction(a._id, 'confirmed', 'Looking forward to meeting you!')}>Confirm</button>
                <button className="btn btn-sm btn-danger" onClick={() => onAction(a._id, 'cancelled')}>Cancel</button>
              </>
            )}
            {!isSeller && a.status === 'pending' && (
              <button className="btn btn-sm btn-danger" onClick={() => onAction(a._id, 'cancelled')}>Cancel</button>
            )}
            {a.status === 'confirmed' && isSeller && (
              <button className="btn btn-sm btn-primary" onClick={() => onAction(a._id, 'completed')}>Mark Done</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('listings');
  const [myListings, setMyListings] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [sellerAppointments, setSellerAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) { navigate('/login'); return null; }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [listRes, apptRes, sellerRes] = await Promise.all([
          api.get('/listings/my'),
          api.get('/appointments/my'),
          api.get('/appointments/seller'),
        ]);
        setMyListings(listRes.data.listings);
        setMyAppointments(apptRes.data.appointments);
        setSellerAppointments(sellerRes.data.appointments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/listings/${id}`);
      setMyListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/listings/${id}`, { status });
      setMyListings((prev) => prev.map((l) => (l._id === id ? { ...l, status: data.listing.status } : l)));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleApptAction = async (id, status, sellerNote = '') => {
    try {
      const { data } = await api.put(`/appointments/${id}`, { status, sellerNote });
      const updated = data.appointment;

      setMyAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, ...updated } : a)));
      setSellerAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, ...updated } : a)));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const pendingSeller = sellerAppointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: 32 }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.8rem' }}>
              Hello, {user.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your listings and appointments</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/create-listing" className="btn btn-primary btn-sm">+ New Listing</Link>
          </div>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-card-value">{myListings.length}</div>
              <div className="stat-card-label">My Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{myAppointments.length}</div>
              <div className="stat-card-label">My Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value" style={{ color: pendingSeller > 0 ? 'var(--warning)' : 'var(--accent)' }}>
                {pendingSeller}
              </div>
              <div className="stat-card-label">Pending Requests</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn${tab === 'listings' ? ' active' : ''}`} onClick={() => setTab('listings')}>
            My Listings ({myListings.length})
          </button>
          <button className={`tab-btn${tab === 'booked' ? ' active' : ''}`} onClick={() => setTab('booked')}>
            My Bookings ({myAppointments.length})
          </button>
          <button className={`tab-btn${tab === 'incoming' ? ' active' : ''}`} onClick={() => setTab('incoming')}>
            Incoming {pendingSeller > 0 && <span style={{ background: 'var(--warning)', color: '#000', borderRadius: '99px', padding: '1px 7px', fontSize: '0.7rem', marginLeft: 4, fontWeight: 700 }}>{pendingSeller}</span>}
          </button>
        </div>

        {loading ? (
          <div className="spinner-center"><div className="spinner" /></div>
        ) : (
          <>
            {tab === 'listings' && (
              <MyListings listings={myListings} onDelete={handleDelete} onStatusChange={handleStatusChange} />
            )}
            {tab === 'booked' && (
              <AppointmentsList appointments={myAppointments} isSeller={false} onAction={handleApptAction} />
            )}
            {tab === 'incoming' && (
              <AppointmentsList appointments={sellerAppointments} isSeller={true} onAction={handleApptAction} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
