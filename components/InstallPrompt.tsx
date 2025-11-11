// components/InstallPrompt.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone, Share2 } from 'lucide-react';

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
    
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);

    console.log('PWA Check:', { isIOSDevice, isInStandaloneMode, userAgent });

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt only if not iOS and not already installed
      if (!isIOSDevice && !isInStandaloneMode) {
        setIsVisible(true);
      }
    };

    // For iOS, show custom instructions
    if (isIOSDevice && !isInStandaloneMode) {
      // Delay showing iOS instructions to ensure page is loaded
      setTimeout(() => setIsVisible(true), 3000);
    }

    // Add event listener for PWA install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response to the install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
          setIsVisible(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.log('Error during install:', error);
      }
    }
  };

  const handleIOSInstall = () => {
    // For iOS, we show instructions since we can't trigger install programmatically
    alert(`To install Trust app:

1. Tap the Share button 📤
2. Scroll down
3. Tap "Add to Home Screen"
4. Tap "Add"

Enjoy the app experience!`);
    setIsVisible(false);
  };

  // Don't show if already in standalone mode, not visible, or not on client
  if (!isClient || isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500 sm:left-auto sm:right-4 sm:max-w-sm">
      <Card className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Smartphone className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-sm">Install Trust App</h3>
              <p className="text-xs opacity-90 mt-1">
                {isIOS 
                  ? 'Add to home screen for better experience' 
                  : 'Install for quick access and offline use'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Button 
              onClick={isIOS ? handleIOSInstall : handleInstall}
              size="sm"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-xs h-8"
            >
              {isIOS ? <Share2 className="w-3 h-3 mr-1" /> : <Download className="w-3 h-3 mr-1" />}
              {isIOS ? 'Add' : 'Install'}
            </Button>
            <Button 
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost" 
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {isIOS && (
          <div className="mt-2 text-xs bg-white/20 p-2 rounded text-center">
            📱 Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
          </div>
        )}
      </Card>
    </div>
  );
}