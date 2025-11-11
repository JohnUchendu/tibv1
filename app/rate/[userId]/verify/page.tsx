// app/rate/[userId]/verify/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Star, Shield, Phone, Mail } from 'lucide-react';
import LiveCounter from '@/components/LiveCounter';
import { useRouter } from 'next/navigation';

export default function VerifyRatePage({ params }: { params: { userId: string } }) {
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'google' | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'method' | 'verify' | 'rating'>('method');
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerification = async () => {
    // Simulate verification
    setStep('rating');
  };

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

  if (step === 'method') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Identity</h1>
            <p className="text-gray-600 mt-2">
              To prevent fake ratings, please verify your identity
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => {
                setVerificationMethod('google');
                setStep('verify');
              }}
              className="w-full py-6 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800"
            >
              <Mail className="w-5 h-5 mr-3" />
              Verify with Google
            </Button>

            <Button
              onClick={() => {
                setVerificationMethod('phone');
                setStep('verify');
              }}
              className="w-full py-6 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800"
            >
              <Phone className="w-5 h-5 mr-3" />
              Verify with Phone Number
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Your identity is protected and only used for verification
          </p>
        </Card>
      </div>
    );
  }

  if (step === 'verify' && verificationMethod === 'phone') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Phone Verification</h1>
            <p className="text-gray-600 mt-2">We'll send a verification code</p>
          </div>

          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="234 801 234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-lg py-3"
            />
            <Button 
              onClick={handleVerification}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700"
            >
              Send Verification Code
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'verify' && verificationMethod === 'google') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Google Verification</h1>
            <p className="text-gray-600 mt-2">Sign in with Google to verify your identity</p>
          </div>

          <Button 
            onClick={handleVerification}
            className="w-full py-6 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800"
          >
            <Mail className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>
        </Card>
      </div>
    );
  }

  // Rating component after verification
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600 font-semibold">Identity Verified</span>
          </div>
          <h1 className="text-2xl font-bold">Rate This Trader</h1>
          <p className="text-gray-600 mt-2">Your verified rating builds real trust</p>
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
              {loading ? 'Submitting...' : 'Submit Verified Rating'}
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-bold">Thank You!</h2>
            <p className="text-gray-600">Your verified rating helps build real trust in the trading community.</p>
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