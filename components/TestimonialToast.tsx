// components/TestimonialToasts.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  { 
    name: 'Aisha B.', 
    text: 'Got ₦100K loan after 15 ratings! Lenders actually trust me now.', 
    amount: '₦100,000',
    delay: 3000
  },
  { 
    name: 'Chinedu O.', 
    text: 'Customers pay faster when they see my Trust Score of 91!', 
    amount: '₦250,000',
    delay: 8000
  },
  { 
    name: 'Fatima Y.', 
    text: 'From scam victim to verified trader. Carbon approved my loan!', 
    amount: '₦150,000',
    delay: 13000
  },
  { 
    name: 'Emeka N.', 
    text: 'Built trust with 30+ customers. FairMoney gave me ₦500K!', 
    amount: '₦500,000',
    delay: 18000
  },
];

export default function TestimonialToasts() {
  const [currentToast, setCurrentToast] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showToast = (index: number) => {
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        
        // Show next toast after hide animation
        setTimeout(() => {
          setCurrentToast((prev) => (prev + 1) % testimonials.length);
        }, 500);
      }, 5000);
    };

    const timer = setTimeout(() => {
      showToast(currentToast);
    }, testimonials[currentToast]?.delay || 3000);

    return () => clearTimeout(timer);
  }, [currentToast]);

  if (!isVisible) return null;

  const current = testimonials[currentToast];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-10 duration-500">
      <Card className="p-4 shadow-2xl border-2 border-green-500 max-w-sm bg-white/95 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {current.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{current.name}</p>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} size={12} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-1">"{current.text}"</p>
            <p className="text-xs text-green-600 font-bold">Loan Received: {current.amount}</p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-5000 ease-linear"
            style={{ width: '100%' }}
          />
        </div>
      </Card>
    </div>
  );
}