// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackWebhook } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    console.log('🔔 Webhook received:', { signature: !!signature });

    if (!signature || !verifyPaystackWebhook(body, signature)) {
      console.log('❌ Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    const { event, data } = JSON.parse(body);
    console.log('📦 Webhook event:', event);

    if (event === 'charge.success') {
      const { metadata, reference } = data;
      const { userId, plan } = metadata;

      console.log('💰 Payment successful:', { userId, plan, reference });

      if (!userId || !plan) {
        console.log('❌ Missing metadata in webhook');
        return new NextResponse('Missing metadata', { status: 400 });
      }

      // Update user's tier and set expiration
      const tier = plan === 'PRO_ANNUAL' ? 'PRO_ANNUAL' : 'PRO';
      const months = plan === 'PRO_ANNUAL' ? 12 : 1;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);

      console.log('🔄 Updating user tier:', { userId, tier, expiresAt });

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { tier, expiresAt },
      });

      console.log('✅ User updated successfully:', updatedUser.email);

      // Send confirmation email
      if (updatedUser.email) {
        await resend.emails.send({
          from: 'Trust Pro <pro@mail.ibiz.name.ng>',
          to: updatedUser.email,
          subject: 'Welcome to Trust Pro! 🚀',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981;">Welcome to Trust Pro!</h2>
              <p>Congratulations ${updatedUser.name || ''}! Your Pro account is now active.</p>
              <p><strong>Plan:</strong> ${tier}</p>
              <p><strong>Expires:</strong> ${expiresAt.toDateString()}</p>
              <p>You now have access to premium features including:</p>
              <ul>
                <li>Higher visibility to lenders</li>
                <li>Premium trust badge</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
              </ul>
              <p>Start building your reputation today!</p>
            </div>
          `,
        });
        console.log('✅ Confirmation email sent');
      }

      return new NextResponse('OK', { status: 200 });
    }

    console.log('ℹ️ Ignoring webhook event:', event);
    return new NextResponse('Ignored', { status: 200 });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';