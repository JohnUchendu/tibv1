// app/(auth)/login/page.tsx (Updated with URGENCY)
'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import LiveCounter from '@/components/LiveCounter';
import Countdown from '@/components/Countdown';
import { Zap, Flame } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-2 border-red-600">
        {/* Urgency Header */}
        <div className="bg-red-600 text-white text-center p-3 rounded-t-lg -mt-8 -mx-8 mb-6 font-bold">
          <Flame className="inline w-5 h-5 mr-1" />
          47 PRO SPOTS LEFT — ENDS IN <Countdown />
          <Flame className="inline w-5 h-5 ml-1" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-red-600">JOIN TRUST</h1>
          <p className="text-gray-600 mt-2 text-lg">Build reputation. Unlock loans. Grow fast.</p>
          <div className="mt-4 text-sm font-bold text-green-600">
            <LiveCounter /> traders rated today
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 text-lg py-6 font-bold"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.38-.66-.6-1.38-.6-2.09s.22-1.43.6-2.09V7.16H2.18C1.43 8.81 1 10.5 1 12.09s.43 3.28 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 6.75c1.61 0 3.06.58 4.21 1.72l3.15-3.15C17.46 2.98 14.97 2 12 2 7.7 2 3.99 4.47 2.18 7.16l3.66 2.84C6.71 8.45 9.14 6.75 12 6.75z" />
            </svg>
            CONTINUE WITH GOOGLE
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-red-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-red-600 font-bold">OR</span>
            </div>
          </div>

        
<form
  onSubmit={async (e) => {
    e.preventDefault();
    await signIn('email', { 
      email, 
      callbackUrl: '/dashboard'
    });
  }}
  className="space-y-4"
>
  <Input
    type="email"
    placeholder="your@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="text-lg py-6"
  />
  <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6 font-bold">
    <Zap className="w-6 h-6 mr-2" />
    SEND MAGIC LINK
  </Button>
</form>

          

          <p className="text-center text-lg font-black text-red-600 mt-8 uppercase">
            Join 1,200+ traders before spots close!
          </p>
        </div>
      </Card>
    </div>
  );
}