// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link may have expired.',
    Default: 'An error occurred during authentication.',
    OAuthCallback: 'Authentication failed. Please try again.',
    EmailSignin: 'Failed to send verification email.',
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Button asChild className="w-full">
            <Link href="/login">
              Back to Login
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}