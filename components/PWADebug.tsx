// components/PWADebug.tsx - Remove after debugging
'use client';

import { useEffect, useState } from 'react';

export default function PWADebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      isIOS: /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()),
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      hasBeforeInstallPrompt: 'beforeinstallprompt' in window,
      isSecure: window.location.protocol === 'https:',
    };
    
    setDebugInfo(info);
    console.log('PWA Debug Info:', info);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 text-xs z-50 max-w-xs">
      <h4 className="font-bold">PWA Debug</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}