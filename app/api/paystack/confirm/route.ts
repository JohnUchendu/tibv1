// app/api/paystack/confirm/route.ts
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

    const { plan } = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tier = plan === 'PRO_ANNUAL' ? 'PRO_ANNUAL' : 'PRO';
    const months = plan === 'PRO_ANNUAL' ? 12 : 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    // Update user tier
    await prisma.user.update({
      where: { id: user.id },
      data: { tier, expiresAt },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Account upgraded successfully!',
      tier,
      expiresAt 
    });

  } catch (error: any) {
    console.error('Manual upgrade error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}