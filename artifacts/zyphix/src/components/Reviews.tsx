import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useReviews } from '@/context/ReviewsContext';

const G = '#0DA366';

export function Reviews({ productId }: { productId: string }) {
  const { forProduct, summary, add } = useReviews();
  const reviews = forProduct(productId);
  const { avg, count } = summary(productId);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    add({ productId, author: author.trim().slice(0, 40), rating, text: text.trim().slice(0, 500) });
    setAuthor(''); setText(''); setRating(5); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2200);
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16, marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', fontSize: 16 }}>
          Ratings & Reviews
        </div>
        {count > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(13,163,102,0.08)', color: G, padding: '5px 10px', borderRadius: 8, fontSize: 13, fontWeight: 800 }}>
            <Star size={13} fill={G} stroke={G} /> {avg.toFixed(1)} · {count}
          </div>
        )}
      </div>

      {reviews.length === 0 && (
        <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 12 }}>No reviews yet. Be the first to review this product.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {reviews.slice(0, 6).map(r => (
          <div key={r.id} style={{ padding: '10px 0', borderBottom: '1px dashed #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: G, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                {r.author.slice(0, 1).toUpperCase()}
              </div>
              <div style={{ fontWeight: 800, color: '#111827', fontSize: 13 }}>{r.author}</div>
              <div style={{ marginLeft: 'auto', display: 'inline-flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={12} fill={n <= r.rating ? G : 'none'} stroke={n <= r.rating ? G : '#D1D5DB'} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: 6, color: '#374151', fontSize: 13, lineHeight: 1.5 }}>{r.text}</div>
            <div style={{ marginTop: 4, color: '#9CA3AF', fontSize: 11 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} style={{ borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
        <div style={{ fontWeight: 800, color: '#111827', fontSize: 13, marginBottom: 8 }}>Write a review</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name" maxLength={40}
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, outline: 'none' }} />
          <div style={{ display: 'inline-flex', gap: 2, alignItems: 'center', padding: '0 8px', border: '1px solid #E5E7EB', borderRadius: 10 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button type="button" key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }} aria-label={`${n} star`}>
                <Star size={16} fill={n <= rating ? G : 'none'} stroke={n <= rating ? G : '#D1D5DB'} />
              </button>
            ))}
          </div>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your experience..." maxLength={500} rows={3}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ fontSize: 11, color: submitted ? G : '#9CA3AF', fontWeight: 700 }}>
            {submitted ? '✓ Review posted!' : `${text.length}/500`}
          </div>
          <button type="submit" disabled={!author.trim() || !text.trim()}
            style={{ padding: '10px 18px', background: (!author.trim() || !text.trim()) ? '#9CA3AF' : G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: (!author.trim() || !text.trim()) ? 'not-allowed' : 'pointer' }}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
