import StarRating from './StarRating';

function getRatingBadge(rating) {
  if (rating >= 4) return 'badge-green';
  if (rating >= 3) return 'badge-yellow';
  return 'badge-red';
}

export default function FeedbackCard({ feedback, onDelete }) {
  const date = new Date(feedback.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="feedback-card">
      <div className="feedback-meta">
        <div>
          <div className="feedback-subject">{feedback.subject}</div>
          <div className="feedback-teacher">👨‍🏫 {feedback.teacher}</div>
          {feedback.student?.name && (
            <div className="feedback-student">👤 {feedback.isAnonymous ? 'Anonymous' : feedback.student.name}</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <StarRating value={feedback.rating} />
          <span className={`badge ${getRatingBadge(feedback.rating)}`}>{feedback.rating}/5</span>
          <span className="feedback-category">{feedback.category}</span>
        </div>
      </div>
      <p className="feedback-comment">"{feedback.comment}"</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="feedback-date">📅 {date}</span>
        {onDelete && (
          <button className="btn btn-danger" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => onDelete(feedback._id)}>
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
}
