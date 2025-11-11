// components/Countdown.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Countdown() {
  const [time, setTime] = useState({ hours: 2, minutes: 47, seconds: 0 }); // More urgent: 2h 47m

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        if (t.seconds > 0) return { ...t, seconds: t.seconds - 1 };
        if (t.minutes > 0) return { ...t, minutes: t.minutes - 1, seconds: 59 };
        if (t.hours > 0) return { hours: t.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 47, seconds: 0 }; // reset
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
  const urgencyClass = totalSeconds < 3600 ? 'text-red-600 animate-pulse' : 'text-orange-600';

  return (
    <span className={`font-bold ${urgencyClass}`}>
      {String(time.hours).padStart(2, '0')}h {String(time.minutes).padStart(2, '0')}m {String(time.seconds).padStart(2, '0')}s
    </span>
  );
}