// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    tier: string;
    joinedAt: Date;
    expiresAt?: Date;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tier: string;
      joinedAt: Date;
      expiresAt?: Date;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    tier: string;
    joinedAt: Date;
    expiresAt?: Date;
  }
}