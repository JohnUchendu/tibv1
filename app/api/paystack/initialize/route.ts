// app/api/paystack/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initializePayment } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('🔐 Checking session...');
    const session = await getServerSession(authOptions);
    
    console.log('📋 Session data:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userName: session?.user?.name
    });

    if (!session?.user?.email) {
      console.log('❌ Unauthorized: No valid session found');
      return NextResponse.json({ error: 'Unauthorized - Please sign in again' }, { status: 401 });
    }

    const { plan } = await req.json();
    console.log('📝 Payment request received:', { plan, email: session.user.email });

    if (!plan || !['PRO', 'PRO_ANNUAL'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      console.log('❌ User not found in database:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User found:', user.id);

    const amount = plan === 'PRO_ANNUAL' ? 50000 : 5000;
    const reference = `trust-${user.id}-${Date.now()}`;

    console.log('💰 Creating payment with reference:', reference);

    const url = await initializePayment({
      email: session.user.email,
      amount,
      reference,
      metadata: { 
        userId: user.id, 
        plan,
        userEmail: user.email
      },
    });

    console.log('✅ Payment URL generated successfully');
    return NextResponse.json({ url, reference });

  } catch (error: any) {
    console.error('❌ Payment route error:', error);
    return NextResponse.json({ 
      error: error.message || 'Payment initialization failed' 
    }, { status: 500 });
  }
}