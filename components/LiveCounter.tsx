// components/LiveCounter.tsx
'use client';

import { useState, useEffect } from 'react';

export default function LiveCounter() {
  const [count, setCount] = useState(892);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 1;
      setCount((c) => c + increment);
      setIsIncreasing(true);
      setTimeout(() => setIsIncreasing(false), 300);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`font-bold text-green-600 ${isIncreasing ? 'animate-ping' : ''}`}>
      {count.toLocaleString()}
    </span>
  );
}