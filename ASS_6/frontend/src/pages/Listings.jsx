import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['car', 'bike', 'scooter', 'truck', 'van', 'other'];
const CATEGORY_EMOJI = { car: '🚗', bike: '🏍️', scooter: '🛵', truck: '🚛', van: '🚐', other: '🔧' };
const CONDITIONS = ['excellent', 'good', 'fair', 'needs-repair'];

function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

function ListingCard({ listing }) {
  const img = listing.images?.[0];
  return (
    <Link to={`/listings/${listing._id}`} style={{ textDecoration: 'none' }}>
      <div className="listing-card">
        <div className="listing-card-img">
          {img ? (
            <img src={img} alt={listing.title} />
          ) : (
            <span>{CATEGORY_EMOJI[listing.category] || '🔧'}</span>
          )}
          <span className={`listing-card-badge${listing.status !== 'available' ? ` ${listing.status}` : ''}`}>
            {listing.status === 'available' ? listing.category : listing.status}
          </span>
        </div>
        <div className="listing-card-body">
          <div className="listing-card-category">{listing.category}</div>
          <div className="listing-card-title">{listing.title}</div>
          <div className="listing-card-meta">
            <span>📅 {listing.year}</span>
            <span>⚙️ {listing.transmission}</span>
            <span>⛽ {listing.fuelType}</span>
            {listing.mileage > 0 && <span>🛣️ {listing.mileage.toLocaleString()} km</span>}
          </div>
          <div className="listing-card-price">{formatPrice(listing.price)}</div>
        </div>
        <div className="listing-card-footer">
          <span>📍 {listing.location}</span>
          <span>👁 {listing.views}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  });

  const fetchListings = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: currentPage, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.condition) params.condition = filters.condition;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.location) params.location = filters.location;

      const { data } = await api.get('/listings', { params });
      setListings(data.listings);
      setTotal(data.total);
      setPages(data.pages);
      setPage(currentPage);
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings(1);
  }, [fetchListings]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ search: '', category: '', condition: '', minPrice: '', maxPrice: '', location: '' });
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="page-header">
          <h1>Browse Vehicles</h1>
          <p>{total > 0 ? `${total} vehicles found` : 'Find your dream vehicle'}</p>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Search</label>
            <input
              id="filter-search"
              className="form-control"
              name="search"
              placeholder="Make, model, or keyword..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select id="filter-category" className="form-control" name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Types</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Condition</label>
            <select id="filter-condition" className="form-control" name="condition" value={filters.condition} onChange={handleFilterChange}>
              <option value="">Any Condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Min Price (₹)</label>
            <input className="form-control" name="minPrice" type="number" placeholder="0" value={filters.minPrice} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Price (₹)</label>
            <input className="form-control" name="maxPrice" type="number" placeholder="Any" value={filters.maxPrice} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-control" name="location" placeholder="City" value={filters.location} onChange={handleFilterChange} />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleReset} style={{ alignSelf: 'flex-end' }}>
            Reset
          </button>
        </div>

        {/* ── Results ── */}
        {loading ? (
          <div className="spinner-center"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No listings found</h3>
            <p>Try adjusting your filters or <Link to="/create-listing" style={{ color: 'var(--accent)' }}>be the first to list!</Link></p>
          </div>
        ) : (
          <>
            <div className="grid grid-3">
              {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => fetchListings(page - 1)} disabled={page === 1}>← Prev</button>
                <span style={{ padding: '8px 16px', color: 'var(--text-secondary)' }}>Page {page} of {pages}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => fetchListings(page + 1)} disabled={page === pages}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
