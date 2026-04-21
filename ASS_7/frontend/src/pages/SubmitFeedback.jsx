import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const CATEGORIES = ['Teaching Quality', 'Course Content', 'Faculty Behavior', 'Infrastructure', 'Other'];

export default function SubmitFeedback() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: '', teacher: '', rating: 0,
    comment: '', category: 'Teaching Quality', isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) return toast.error('Please select a rating');
    setLoading(true);
    try {
      await API.post('/feedback', form);
      toast.success('Feedback submitted! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="page-header">
          <div className="page-title">Submit Feedback ✍️</div>
          <div className="page-sub">Share your honest thoughts to help improve the institution</div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Subject / Course</label>
              <input className="form-input" placeholder="e.g. Data Structures, Maths III"
                value={form.subject} onChange={(e) => update('subject', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Teacher / Faculty Name</label>
              <input className="form-input" placeholder="e.g. Prof. Ramesh Sharma"
                value={form.teacher} onChange={(e) => update('teacher', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StarRating value={form.rating} onChange={(v) => update('rating', v)} />
                {form.rating > 0 && (
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Comments</label>
              <textarea className="form-textarea" placeholder="Share your experience honestly..."
                value={form.comment} onChange={(e) => update('comment', e.target.value)} required />
            </div>

            <div className="form-group">
              <div className="toggle-row">
                <label className="toggle">
                  <input type="checkbox" checked={form.isAnonymous} onChange={(e) => update('isAnonymous', e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: '0.9rem' }}>Submit anonymously</span>
              </div>
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : '📤 Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
