// app/dashboard/page.tsx (Fixed with all features)
'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import Countdown from '@/components/Countdown';
import LiveCounter from '@/components/LiveCounter';
import Testimonials from '@/components/Testimonials';
import { Badge } from '@/components/ui/badge';
import { Flame, Zap, Star, Crown, Shield, TrendingUp, Users, Clock } from 'lucide-react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState('send');


  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

const manageSubscription = async (action: 'cancel' | 'reactivate') => {
  try {
    const res = await fetch('/api/subscription/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();
    
    if (res.ok) {
      alert(`✅ ${data.message}`);
      window.location.reload();
    } else {
      alert(data.error || 'Action failed');
    }
  } catch (error) {
    console.error('Subscription action error:', error);
    alert('Network error. Please try again.');
  }
};


  // Fetch ratings on component mount
  useEffect(() => {
    const fetchRatings = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/rating/user/${session.user.id}`);
          const data = await res.json();
          if (res.ok) {
            setRatings(data.ratings || []);
          }
        } catch (error) {
          console.error('Error fetching ratings:', error);
        }
      }
    };
    
    fetchRatings();
  }, [session?.user?.id]);

  // Enhanced trust score calculation
  const calculateTrustScore = (user: any) => {
    if (!user) return 50;
    
    let score = 50; // Base score
    
    // Profile completeness
    if (user.name) score += 10;
    if (user.image) score += 5;
    if (user.emailVerified) score += 15;
    
    // Account tier
    if (user.tier === 'PRO') score += 10;
    if (user.tier === 'PRO_ANNUAL') score += 15;
    
    // Ratings impact
    const ratingsCount = ratings.length;
    if (ratingsCount > 0) score += Math.min(ratingsCount * 2, 20);
    
    // Average rating impact
    if (ratingsCount > 0) {
      const avgRating = ratings.reduce((sum: number, r: any) => sum + r.score, 0) / ratingsCount;
      score += (avgRating - 3) * 5; // Bonus for ratings above 3
    }
    
    return Math.min(Math.max(score, 0), 100);
  };

  // Handle rating requests
  const handleSendRating = async (type: 'email' | 'whatsapp') => {
    if (!email.trim()) {
      alert('Please enter an email or WhatsApp number');
      return;
    }

    setLoading(true);
    
    try {
      console.log('📤 Sending rating request...', { type, contact: email });
      
      const res = await fetch('/api/rating/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contact: email.trim(),
          type: type
        }),
      });

      const data = await res.json();
      console.log('📨 Rating API response:', data);

      if (res.ok && data.success) {
        if (type === 'whatsapp' && data.whatsapp_url) {
          window.open(data.whatsapp_url, '_blank');
          alert('WhatsApp opened! Please send the message to your customer.');
        } else {
          alert(`✅ Rating request sent via ${type}! Your customer will need to verify their identity.`);
        }
        setEmail('');
      } else {
        console.error('❌ Rating API error:', data);
        alert(data.error || `Failed to send ${type} request`);
      }
    } catch (error) {
      console.error('❌ Network error sending rating:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle upgrades
  const upgrade = async (plan: 'PRO' | 'PRO_ANNUAL') => {
    try {
      console.log('🔄 Starting upgrade for plan:', plan);
      
      // For testing: Use manual confirmation instead of Paystack
      if (process.env.NODE_ENV === 'development') {
        const confirmRes = await fetch('/api/paystack/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        });
        
        const confirmData = await confirmRes.json();
        
        if (confirmRes.ok) {
          alert(`🎉 ${confirmData.message} All Pro features are now active!`);
          window.location.reload();
          return;
        }
      }
      
      // Production: Use actual Paystack
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      
      const data = await res.json();
      console.log('💳 Payment API response:', data);

      if (res.ok && data.url) {
        console.log('🔗 Redirecting to Paystack...');
        window.location.href = data.url;
      } else {
        console.error('❌ Payment failed:', data);
        alert(data.error || `Payment failed with status ${res.status}`);
      }
    } catch (error) {
      console.error('❌ Upgrade network error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Calculate rating stats
  const ratingStats = {
    total: ratings.length,
    average: ratings.length > 0 
      ? (ratings.reduce((sum: number, r: any) => sum + r.score, 0) / ratings.length).toFixed(1)
      : '0.0',
    distribution: [1,2,3,4,5].map(star => 
      ratings.filter((r: any) => r.score === star).length
    )
  };

  const isPro = session?.user?.tier && session.user.tier !== 'FREE';

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* URGENCY BANNER - ENHANCED */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white p-4 rounded-2xl shadow-2xl font-bold text-center animate-pulse border-4 border-yellow-400">
          <div className="flex items-center justify-center gap-4 text-sm md:text-lg">
            <Flame className="w-6 h-6 animate-bounce" />
            <span className="uppercase tracking-wider">
              🚨 FINAL WARNING: <Countdown /> LEFT AT ₦5K → THEN ₦10K FOREVER
            </span>
            <Badge className="bg-yellow-400 text-black animate-pulse px-3 py-1">
              {47 - (ratings.length || 0)} SPOTS!
            </Badge>
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* HEADER - ENHANCED */}
        <Card className="p-6 bg-white border-4 border-green-600 shadow-2xl relative overflow-hidden">
          {/* Pro Badge */}
          {isPro && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
              <Crown className="w-4 h-4 inline mr-1" />
              PRO MEMBER
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {session?.user?.name || 'Trader'}!
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold">Trust Score:</span>
                  <Badge className="text-xl px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600">
                    {calculateTrustScore(session?.user)}/100
                  </Badge>
                </div>
                
                {isPro && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Pro Active
                  </Badge>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{ratingStats.total} ratings</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{ratingStats.average} avg</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center bg-red-50 p-3 rounded-xl border-2 border-red-200">
                <p className="text-xs uppercase text-red-600 font-bold">Spots Left</p>
                <p className="text-4xl font-black text-red-600 animate-pulse">{47 - ratings.length}</p>
                <p className="text-xs text-red-500">Before price increase!</p>
              </div>
              <Button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 hover:bg-red-700 shadow-lg"
              >
                Log Out
              </Button>
            </div>
          </div>
        </Card>

        {/* RATING SYSTEM - TABBED INTERFACE */}
        <Card className="p-6 border-4 border-orange-500 shadow-2xl">
          <div className="flex border-b-2 border-orange-200 mb-6">
            <button
              className={`flex-1 py-3 font-bold text-lg ${
                activeTab === 'send' 
                  ? 'text-orange-600 border-b-4 border-orange-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('send')}
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Send Rating Request
            </button>
            <button
              className={`flex-1 py-3 font-bold text-lg ${
                activeTab === 'ratings' 
                  ? 'text-blue-600 border-b-4 border-blue-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('ratings')}
            >
              <Star className="w-5 h-5 inline mr-2" />
              Your Ratings ({ratings.length})
            </button>
          </div>

          {activeTab === 'send' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-blue-800">Identity Verification Required</h3>
                    <p className="text-sm text-blue-600">
                      Customers must verify with Google Auth or Phone to prevent fake ratings
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">Customer Contact</Label>
                  <Input
                    type="text"
                    placeholder="email@example.com OR 2348012345678"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg py-3 border-2 focus:border-orange-500"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    📧 Email sends magic link • 💬 WhatsApp opens pre-filled message
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleSendRating('email')} 
                    disabled={loading} 
                    className="text-lg py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                  >
                    {loading ? '🔄 Sending...' : '📧 Send Email Link'}
                  </Button>
                  <Button 
                    onClick={() => handleSendRating('whatsapp')} 
                    disabled={loading} 
                    className="text-lg py-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg"
                  >
                    {loading ? '🔄 Sending...' : '💬 Send WhatsApp'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-6">
              {/* Rating Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="text-2xl font-black text-green-600">{ratingStats.total}</div>
                  <div className="text-sm text-green-700">Total Ratings</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <div className="text-2xl font-black text-yellow-600">{ratingStats.average}</div>
                  <div className="text-sm text-yellow-700">Average Score</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="text-2xl font-black text-blue-600">
                    {calculateTrustScore(session?.user)}/100
                  </div>
                  <div className="text-sm text-blue-700">Trust Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="text-2xl font-black text-purple-600">
                    {isPro ? 'PRO' : 'FREE'}
                  </div>
                  <div className="text-sm text-purple-700">Plan</div>
                </div>
              </div>



              {/* Ratings List */}
              {ratings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No Ratings Yet</h3>
                  <p className="text-gray-500 mb-4">Send your first rating request to build trust!</p>
                  <Button 
                    onClick={() => setActiveTab('send')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Send Rating Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {ratings.map((rating: any) => (
                    <div key={rating.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all">
                      <div className="flex-shrink-0">
                        <div className="text-2xl bg-yellow-50 rounded-full p-3">
                          {"⭐".repeat(rating.score)}
                          <span className="text-sm text-gray-500 ml-2">{rating.score}/5</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {rating.rater?.name?.charAt(0) || 'A'}
                          </div>
                          {/* <div>
                            <p className="font-semibold text-gray-900">
                              {rating.rater?.name ? `${rating.rater.name.charAt(0)}***` : 'Anonymous User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {rating.rater?.email ? `${rating.rater.email.split('@')[0].substring(0, 3)}***@${rating.rater.email.split('@')[1]}` : 'Verified User'}
                            </p>
                          </div> */}
                          <div>
  <p className="font-semibold text-gray-900">
    {rating.rater?.name?.includes('Customer') 
      ? `Customer ${rating.rater.name.replace('Customer', '')}`
      : rating.rater?.name || 'Verified Customer'
    }
  </p>
  <p className="text-xs text-gray-500">
    {rating.rater?.email ? `${rating.rater.email.split('@')[0].substring(0, 3)}***@${rating.rater.email.split('@')[1]}` : 'Verified User'}
  </p>
</div>
                        </div>
                        {rating.comment && (
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-orange-500">
                            "{rating.comment}"
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(rating.createdAt).toLocaleDateString()} at {new Date(rating.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* UPGRADE SECTION - ENHANCED URGENCY */}
        <Card className="p-8 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
          
          {/* Urgency Badge */}
          <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm animate-pulse shadow-lg">
            🔥 LAST CHANCE OFFER
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-2 text-white drop-shadow-lg">
              {isPro ? '🎉 WELCOME TO TRUST PRO!' : 'LENDERS ARE WATCHING YOU 👀'}
            </h2>
            <p className="text-center text-yellow-200 text-lg mb-8 font-semibold">
              {isPro 
                ? 'You have access to exclusive features that boost your credibility'
                : 'Upgrade now before the price increases forever in'
              }
              {!isPro && <Countdown />}
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Free Plan */}
              <div className={`bg-white/20 backdrop-blur-lg rounded-2xl p-6 border-2 ${
                isPro ? 'border-gray-400' : 'border-white/50'
              } transition-all duration-300`}>
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  {isPro ? '✅' : '🔒'} FREE PLAN
                </h3>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <span className={isPro ? 'text-gray-300' : 'text-green-300'}>✓</span>
                    <span className={isPro ? 'text-gray-300' : ''}>Basic rating requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={isPro ? 'text-gray-300' : 'text-green-300'}>✓</span>
                    <span className={isPro ? 'text-gray-300' : ''}>Standard trust score</span>
                  </li>
                  <li className="flex items-center gap-2 text-red-200">
                    <span>✗</span>
                    <span>Limited lender visibility</span>
                  </li>
                  <li className="flex items-center gap-2 text-red-200">
                    <span>✗</span>
                    <span>No priority support</span>
                  </li>
                  <li className="flex items-center gap-2 text-red-200">
                    <span>✗</span>
                    <span>Basic analytics only</span>
                  </li>
                </ul>
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <p className="text-3xl font-black">₦0<span className="text-lg">/mo</span></p>
                  <p className="text-sm text-yellow-200">Always free</p>
                </div>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-yellow-400/30 backdrop-blur-lg rounded-2xl p-6 border-4 border-yellow-400 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    <Crown className="w-6 h-6" />
                    PRO PLAN
                  </h3>
                 {/* // Add this button in the Pro section */}
{isPro && (
  <Button 
    onClick={() => setShowSubscriptionModal(true)}
    className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white font-bold"
  >
    Manage Subscription
  </Button>
)}
{showSubscriptionModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-md p-6">
      <h3 className="text-xl font-bold mb-4">Manage Subscription</h3>
      <p className="text-gray-600 mb-6">
        Your Pro subscription renews automatically. You can cancel anytime.
      </p>
      <div className="space-y-3">
        <Button 
          onClick={() => manageSubscription('cancel')}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Cancel Subscription
        </Button>
        <Button 
          onClick={() => setShowSubscriptionModal(false)}
          className="w-full bg-gray-600 hover:bg-gray-700"
        >
          Keep Subscription
        </Button>
      </div>
    </Card>
  </div>
)}
                </div>
                
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span className="font-semibold">Unlimited rating requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span className="font-semibold">Premium trust badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span className="font-semibold">Top visibility to lenders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span className="font-semibold">3x higher loan approval</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Recurring subscription</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                
                <div className="text-center p-4 bg-black/20 rounded-xl mb-4">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <p className="text-sm line-through opacity-75">₦10,000</p>
                    <p className="text-4xl font-black">₦5,000<span className="text-lg">/mo</span></p>
                  </div>
                  <p className="text-sm font-bold text-yellow-300 animate-pulse">
                    🎉 50% OFF - LIMITED TIME!
                  </p>
                </div>
                
                {isPro ? (
                  <div className="text-center p-4 bg-green-600 rounded-xl">
                    <p className="font-bold text-lg">🎉 PRO FEATURES ACTIVE!</p>
                    {session?.user?.expiresAt && (
                      <p className="text-sm mt-1">
                        Renews: {new Date(session.user.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                    <Button 
                      className="w-full mt-3 bg-white text-green-600 hover:bg-gray-100 font-bold"
                      onClick={() => alert('Visit account settings to manage subscription')}
                    >
                      Manage Subscription
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => upgrade('PRO')} 
                    className="w-full bg-white text-orange-600 hover:bg-gray-100 text-lg py-6 font-bold shadow-2xl transform hover:scale-105 transition-all"
                  >
                    🚀 UPGRADE TO PRO - <Countdown />
                  </Button>
                )}
              </div>
              
            </div>
            
            {/* Social Proof */}
            <div className="text-center border-t border-orange-400 pt-6">
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-yellow-200"><LiveCounter /> traders upgraded today</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-yellow-200">₦2.3M loans unlocked this week</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-yellow-200">Cancel anytime • 30-day guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Testimonials />
      </div>
    </div>
  );
}