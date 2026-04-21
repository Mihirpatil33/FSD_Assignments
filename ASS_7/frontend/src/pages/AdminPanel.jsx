import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeedbackCard from '../components/FeedbackCard';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const CATEGORIES = ['All', 'Teaching Quality', 'Course Content', 'Faculty Behavior', 'Infrastructure', 'Other'];

  useEffect(() => {
    const load = async () => {
      const [fb, st] = await Promise.all([API.get('/feedback'), API.get('/feedback/stats')]);
      setFeedbacks(fb.data);
      setStats(st.data);
      setLoading(false);
    };
    load().catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await API.delete(`/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      toast.success('Feedback deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = filter === 'All' ? feedbacks : feedbacks.filter((f) => f.category === filter);

  const getRatingColor = (r) => {
    if (r >= 4) return 'var(--green)';
    if (r >= 3) return 'var(--yellow)';
    return 'var(--red)';
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-title">Admin Panel 🛡️</div>
          <div className="page-sub">Monitor and manage all student feedback</div>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Feedback</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: getRatingColor(stats.avgRating) }}>{stats.avgRating}</div>
              <div className="stat-label">Average Rating</div>
            </div>
            {stats.byCategory.map((c) => (
              <div key={c._id} className="stat-card">
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{c.count}</div>
                <div className="stat-label">{c._id}</div>
              </div>
            ))}
          </div>
        )}

        <div className="section-header">
          <div className="section-title">All Feedback ({filtered.length})</div>
          <select className="form-select" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={filter} onChange={(e) => setFilter(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📭</div><p>No feedback found</p></div>
        ) : (
          <div className="feedback-grid">
            {filtered.map((f) => <FeedbackCard key={f._id} feedback={f} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </div>
  );
}
