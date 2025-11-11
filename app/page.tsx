// app/page.tsx (Updated with MAX URGENCY)
'use client';

import Countdown from '@/components/Countdown';
import LiveCounter from '@/components/LiveCounter';
import Testimonials from '@/components/Testimonials';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Zap, Flame, AlertTriangle, Clock, Users, Lock } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50 overflow-x-hidden">
      {/* URGENCY BANNER - PULSING */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 text-center font-bold text-sm md:text-lg animate-pulse shadow-lg">
        <Flame className="inline w-5 h-5 mr-1 animate-bounce" />
        <span className="uppercase tracking-wider">
          EARLY BIRD ENDS IN <Countdown /> → ₦5K BECOMES ₦10K FOREVER | <span className="text-yellow-300">ONLY 47 SPOTS LEFT!</span>
        </span>
        <Flame className="inline w-5 h-5 ml-1 animate-bounce" />
      </div>

      {/* Hero - SCREAMING URGENCY */}
      <section className="px-4 py-12 md:py-20 text-center relative">
        <div className="absolute top-0 left-0 right-0 flex justify-center -mt-6">
          <Badge className="bg-red-600 text-white animate-bounce text-lg px-6 py-2">
            <Zap className="w-5 h-5 mr-1" /> LIVE: 47 SPOTS CLOSING FAST
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
              BUILD TRUST
            </span>
            <br />
            <span className="text-green-600">UNLOCK ₦₦₦</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
            WhatsApp traders: <span className="text-red-600 font-bold">NO MORE SCAMS.</span> Get rated. Show lenders. Get loans.
          </p>

          {/* Live Stats */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10 text-lg font-bold">
            <div className="flex items-center gap-2 text-green-600">
              <Users className="w-6 h-6 animate-pulse" />
              <LiveCounter /> rated <span className="hidden sm:inline">TODAY</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <Clock className="w-6 h-6 animate-spin" />
              <span className="text-2xl">47</span> Pro spots left
            </div>
          </div>

          {/* CTA Buttons - HIGH CONTRAST */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xl px-10 py-6 shadow-xl transform hover:scale-105 transition-all">
              <Link href="/login">
                <Lock className="w-6 h-6 mr-2" />
                GET RATED FREE (2 SEC)
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl px-10 py-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <Link href="/dashboard">
                <Zap className="w-6 h-6 mr-2" />
                GRAB PRO BEFORE ₦10K
              </Link>
            </Button>
          </div>

          <p className="text-sm text-gray-600 uppercase tracking-wider">
            <AlertTriangle className="inline w-4 h-4 text-red-600 mr-1" />
            First 50 Pro users get <span className="font-bold text-green-600">FREE lender call</span>
          </p>
        </div>
      </section>

      // Add this section to your app/page.tsx after the hero
<section className="py-16 px-4 bg-white">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
      The Trader Who Unlocked <span className="text-green-600">₦500,000</span>
    </h2>
    
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-6 bg-orange-50 rounded-2xl border-2 border-orange-200">
          <div className="text-2xl">😔</div>
          <div>
            <h3 className="font-bold text-lg mb-2">The Struggle</h3>
            <p className="text-gray-700">
              "I sold genuine phones on WhatsApp for 2 years, but lenders saw me as 'just another online trader'. 
              No trust, no loans, no growth."
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <div className="text-2xl">🚀</div>
          <div>
            <h3 className="font-bold text-lg mb-2">The Discovery</h3>
            <p className="text-gray-700">
              "I joined Trust, sent rating requests to 20 customers. Within a week, 
              my Trust Score hit 89. Lenders could finally see I was legitimate."
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-green-50 rounded-2xl border-2 border-green-200">
          <div className="text-2xl">💰</div>
          <div>
            <h3 className="font-bold text-lg mb-2">The Breakthrough</h3>
            <p className="text-gray-700">
              "FairMoney approved ₦500,000 in 48 hours! I bought more inventory, 
              sales doubled. Trust changed everything."
              </p>
            </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-2xl font-black mb-4">Your Story Starts Here</h3>
        <p className="text-lg mb-6">
          Join 1,200+ traders who turned ratings into real loans
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Average Trust Score Increase:</span>
            <span className="font-bold">+42 points</span>
          </div>
          <div className="flex justify-between">
            <span>Average Loan Amount:</span>
            <span className="font-bold">₦187,000</span>
          </div>
          <div className="flex justify-between">
            <span>Approval Time:</span>
            <span className="font-bold">2.3 days</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Social Proof - URGENT */}
      <section className="bg-gradient-to-b from-gray-100 to-white py-16 px-4 border-t-4 border-red-600">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            LENDERS ARE WATCHING <span className="text-red-600">RIGHT NOW</span>
          </h2>
          <p className="text-center text-xl font-bold text-green-600 mb-12">
            ₦2.3M in loans unlocked THIS WEEK
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {['PiggyVest', 'Carbon', 'FairMoney', 'Kuda'].map((name) => (
              <div key={name} className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-600 animate-pulse">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl h-16 flex items-center justify-center font-bold text-gray-500">
                  {name}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Badge className="text-lg px-6 py-2 bg-orange-600">
              API Waitlist: <span className="font-bold">1,200+</span> lenders
            </Badge>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* FINAL CTA - SCARCITY MAX */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-700">
        <Card className="max-w-3xl mx-auto p-10 bg-white/95 backdrop-blur shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-red-600">
              <Flame className="inline w-10 h-10 animate-bounce" />
              LAST CHANCE: 47 SPOTS
              <Flame className="inline w-10 h-10 animate-bounce" />
            </h2>
            <p className="text-2xl font-bold mb-4">₦5,000/mo → ₦10,000 in <Countdown /></p>
            <p className="text-xl mb-8 text-gray-700">
              First 50 get <span className="text-green-600 font-bold">FREE 1:1 lender intro call</span>
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl px-16 py-8 shadow-2xl transform hover:scale-110 transition-all font-bold">
              <Link href="/login">
                <Zap className="w-8 h-8 mr-3" />
                CLAIM MY PRO SPOT NOW
              </Link>
            </Button>
            <p className="mt-6 text-sm uppercase tracking-wider text-gray-600">
              <Lock className="inline w-4 h-4 mr-1" />
              Secure Paystack • Cancel Anytime • 100% Naija
            </p>
          </div>
        </Card>
      </section>

      {/* Floating Urgency */}
      <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-2xl animate-bounce z-50">
        <Zap className="w-6 h-6" />
      </div>
    </div>
  );
}