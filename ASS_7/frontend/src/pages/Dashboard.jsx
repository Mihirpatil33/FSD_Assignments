import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import FeedbackCard from '../components/FeedbackCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/feedback')
      .then(({ data }) => setFeedbacks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-title">My Feedback 📋</div>
          <div className="page-sub">Hello, {user?.name}! Here's your feedback history.</div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{feedbacks.length}</div>
            <div className="stat-label">Total Submitted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Avg. Rating Given</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{feedbacks.filter(f => f.rating === 5).length}</div>
            <div className="stat-label">⭐ 5-Star Reviews</div>
          </div>
        </div>

        <div className="section-header">
          <div className="section-title">Your Reviews</div>
          <Link to="/submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            + Submit New
          </Link>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading...</span></div>
        ) : feedbacks.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p>No feedback yet. <Link to="/submit">Submit your first one!</Link></p>
          </div>
        ) : (
          <div className="feedback-grid">
            {feedbacks.map((f) => <FeedbackCard key={f._id} feedback={f} />)}
          </div>
        )}
      </div>
    </div>
  );
}
