// app/api/subscription/manage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'cancel') {
      // In production, you'd call Paystack subscription API
      // For now, we'll simulate cancellation
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          tier: 'FREE',
          expiresAt: new Date() // Immediate expiration
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Subscription cancelled successfully',
        tier: 'FREE'
      });

    } else if (action === 'reactivate') {
      // Reactivate subscription
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          tier: 'PRO',
          expiresAt
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Subscription reactivated successfully',
        tier: 'PRO'
      });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Subscription management error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}