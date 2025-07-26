import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ emoji: '', stars: 0, comment: '', submitted: false });

  function handleFeedbackEmoji(emoji) {
    setFeedback(f => ({ ...f, emoji }));
  }
  function handleFeedbackStars(stars) {
    setFeedback(f => ({ ...f, stars }));
  }
  function handleFeedbackComment(e) {
    setFeedback(f => ({ ...f, comment: e.target.value }));
  }
  function handleFeedbackSubmit(e) {
    e.preventDefault();
    setFeedback(f => ({ ...f, submitted: true }));
    // Optionally send feedback to backend here
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 2px 18px #0a234211', padding: '2.5rem 2.2rem', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 18, color: '#2193b0' }}>We value your feedback!</h2>
        {feedback.submitted ? (
          <div style={{ color: '#388e3c', fontWeight: 600, fontSize: '1.1rem', marginBottom: 24 }}>Thank you for your feedback! 🙏</div>
        ) : (
          <form onSubmit={handleFeedbackSubmit}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontWeight: 600, marginRight: 8 }}>How do you feel?</span>
              {["😃", "🙂", "😐", "🙁", "😡"].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleFeedbackEmoji(emoji)}
                  style={{
                    fontSize: '1.7rem',
                    margin: '0 4px',
                    background: feedback.emoji === emoji ? '#e3f2fd' : 'transparent',
                    border: feedback.emoji === emoji ? '2px solid #2193b0' : '2px solid transparent',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background 0.2s, border 0.2s',
                  }}
                  aria-label={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontWeight: 600, marginRight: 8 }}>Rate your experience:</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleFeedbackStars(star)}
                  style={{
                    fontSize: '1.5rem',
                    color: feedback.stars >= star ? '#FFD700' : '#b0bec5',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: 2,
                    transition: 'color 0.2s',
                  }}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 18 }}>
              <textarea
                value={feedback.comment}
                onChange={handleFeedbackComment}
                placeholder="Additional comments (optional)"
                rows={3}
                style={{ width: '100%', borderRadius: 10, border: '1.5px solid #90caf9', padding: '0.7rem 1rem', fontSize: '1rem', background: '#e3f2fd', color: '#0a2342', resize: 'vertical' }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '0.7rem 2.2rem',
                fontWeight: 700,
                fontSize: '1.08rem',
                cursor: 'pointer',
                boxShadow: '0 1px 4px #2193b022',
              }}
              disabled={!feedback.emoji && !feedback.stars && !feedback.comment}
            >
              Submit Feedback
            </button>
          </form>
        )}
        <button
          onClick={() => navigate('/profile')}
          style={{
            marginTop: 24,
            background: 'none',
            color: '#2193b0',
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ← Back to Profile
        </button>
      </div>
    </div>
  );
} 
