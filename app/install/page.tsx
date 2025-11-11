// app/install/page.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Share2, Chrome,  } from 'lucide-react';
import Link from 'next/link';

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Install Trust App
          </h1>
          <p className="text-xl text-gray-600">
            Get the full app experience on your phone
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* iPhone Instructions */}
          <Card className="p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold">iOS</span>
              </div>
              <h2 className="text-2xl font-bold">iPhone Users</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">1</div>
                <p>Open <strong>Safari</strong> browser</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">2</div>
                <p>Go to <strong>trust.ibiz.name.ng</strong></p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">3</div>
                <div>
                  <p>Tap the <strong>Share button</strong> <Share2 className="w-4 h-4 inline" /></p>
                  <p className="text-sm text-gray-600">(Box with arrow pointing up)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">4</div>
                <p>Scroll down → Tap <strong>"Add to Home Screen"</strong></p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">5</div>
                <p>Tap <strong>"Add"</strong> → Done! 🎉</p>
              </div>
            </div>
          </Card>

          {/* Android Instructions */}
          <Card className="p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <h2 className="text-2xl font-bold">Android Users</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">1</div>
                <p>Open <strong>Chrome</strong> browser</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">2</div>
                <p>Go to <strong>trust.ibiz.name.ng</strong></p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">3</div>
                <div>
                  <p>Tap the <strong>Menu button</strong> (3 dots)</p>
                  <p className="text-sm text-gray-600">Top right corner</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">4</div>
                <p>Tap <strong>"Add to Home Screen"</strong></p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">5</div>
                <p>Tap <strong>"Add"</strong> → Done! 🎉</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Why Install the App?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <Smartphone className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">App Experience</p>
              <p className="opacity-90">Full-screen, no browser bars</p>
            </div>
            <div>
              <Download className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Quick Access</p>
              <p className="opacity-90">One tap from home screen</p>
            </div>
            <div>
              <Chrome className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Works Offline</p>
              <p className="opacity-90">Basic features without internet</p>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-blue-600">
            <Link href="/">
              ← Back to Trust
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}