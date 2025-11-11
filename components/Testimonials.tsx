// components/Testimonials.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  { 
    name: 'Aisha Bello', 
    text: 'Got my first ₦100K loan in 3 days after 15 ratings! Lenders actually trust me now.', 
    stars: 5, 
    avatar: 'AB',
    business: 'WhatsApp Fashion Store',
    loan: '₦100,000'
  },
  { 
    name: 'Chinedu Okeke', 
    text: 'Customers now pay faster when they see my Trust Score of 91. No more "I will pay you tomorrow"!', 
    stars: 5, 
    avatar: 'CO',
    business: 'Phone Accessories',
    loan: '₦250,000'
  },
  { 
    name: 'Fatima Yusuf', 
    text: 'From scam victim to verified trader. Carbon approved my loan application in 24 hours!', 
    stars: 5, 
    avatar: 'FY',
    business: 'Makeup & Beauty',
    loan: '₦150,000'
  },
  { 
    name: 'Emeka Nwosu', 
    text: 'Built trust with 30+ customers. FairMoney gave me ₦500K for inventory expansion!', 
    stars: 5, 
    avatar: 'EN', 
    business: 'Sneaker Reseller',
    loan: '₦500,000'
  },
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const current = testimonials[currentTestimonial];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
          REAL TRADERS, <span className="text-green-600">REAL RESULTS</span>
        </h2>
        <p className="text-center text-xl font-bold text-red-600 mb-12">
          ₦2.3M in loans unlocked THIS WEEK
        </p>

        <div className="relative h-80">
          <Card className={`p-8 absolute inset-0 transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Quote className="w-12 h-12 text-green-600 opacity-20 mb-4" />
            
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                {current.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl">{current.name}</h3>
                  <div className="flex">
                    {[...Array(current.stars)].map((_, i) => (
                      <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{current.business}</p>
                <p className="text-green-600 font-bold">Loan Received: {current.loan}</p>
              </div>
            </div>

            <p className="text-gray-800 text-lg italic leading-relaxed">
              "{current.text}"
            </p>
          </Card>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentTestimonial(index);
                  setIsVisible(true);
                }, 500);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentTestimonial 
                  ? 'bg-green-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}