// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: 'Trust <noreply@trust.ibiz.name.ng>',
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const { data, error } = await resend.emails.send({
          from: 'Trust <noreply@trust.ibiz.name.ng>',
          to: email,
          subject: 'Your Trust Login Link',
          html: `<p>Click <a href="${url}">here</a> to sign in. Expires in 10 minutes.</p>`,
        });

        if (error) {
          console.error('Email error:', error);
          throw new Error('Failed to send email');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }: any) {
      console.log('🔐 Session callback called:', { 
        hasSession: !!session, 
        hasUser: !!user, 
        hasToken: !!token 
      });
      
      // Safely add user data to session
      if (session.user) {
        // Use user object if available, otherwise use token
        if (user) {
          session.user.id = user.id;
          session.user.tier = user.tier || 'FREE';
          session.user.joinedAt = user.joinedAt;
        } else if (token) {
          session.user.id = token.sub; // Use token subject as user ID
          session.user.tier = token.tier || 'FREE';
          session.user.joinedAt = token.joinedAt;
        }
      }
      
      console.log('✅ Final session:', session);
      return session;
    },
    async jwt({ token, user, account }: any) {
      console.log('🔑 JWT callback:', { hasToken: !!token, hasUser: !!user });
      
      // Add user info to token on sign in
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
        token.joinedAt = user.joinedAt;
      }
      
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt', // Use JWT strategy instead of database for better reliability
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };