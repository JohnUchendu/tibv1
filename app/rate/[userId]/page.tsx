// app/rate/[userId]/page.tsx (Fixed - no auto logout)
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import LiveCounter from '@/components/LiveCounter';
import { Star } from 'lucide-react';

export default function RatePage({ params }: { params: { userId: string } }) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitRating = async () => {
    if (score === 0) {
      alert('Please select a rating (1-5 stars)');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/rating/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratedId: params.userId,
          score,
          comment
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        // Don't redirect automatically - let user close the window
      } else {
        alert(data.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Rating submission error:', error);
      alert('Error submitting rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Rate This Trader</h1>
          <p className="text-gray-600 mt-2">Help build trust in WhatsApp trading</p>
          <p className="mt-3 text-sm text-green-600">
            <LiveCounter /> ratings given today
          </p>
        </div>

        {!submitted ? (
          <>
            <div className="flex justify-center gap-2 my-8">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setScore(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={48}
                    className={n <= score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Comment (Optional)
              </label>
              <Textarea
                placeholder="How was your trading experience? e.g., 'Fast delivery, genuine products'"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={submitRating} 
              disabled={score === 0 || loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-bold">Thank You!</h2>
            <p className="text-gray-600">Your rating helps build trust in the trading community.</p>
            <Button 
              onClick={() => window.close()} 
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              Close Window
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}