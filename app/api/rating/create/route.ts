// app/api/rating/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contact, type } = await req.json();
    
    if (!contact) {
      return NextResponse.json({ error: 'Contact is required' }, { status: 400 });
    }

    const rater = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });

    if (!rater) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const contactType = type || (contact.includes('@') ? 'email' : 'whatsapp');

    if (contactType === 'email') {
      // Send email with VERIFICATION link
      const verifyUrl = `${process.env.NEXTAUTH_URL}/rate/${rater.id}/verify`;
      
      console.log('📧 Sending verification email to:', contact);
      
      const { data, error } = await resend.emails.send({
        from: 'Trust <rating@mail.ibiz.name.ng>',
        to: contact,
        subject: `Verify & Rate ${rater.name || 'a trader'} on Trust`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10B981;">Rate Your Trading Experience</h2>
            <p>Hello!</p>
            <p><strong>${rater.name || 'A trader'}</strong> is requesting your verified feedback on Trust.</p>
            
            <div style="background: #f0f9ff; border-left: 4px solid #10B981; padding: 16px; margin: 20px 0;">
              <strong>🔒 Identity Verification Required</strong>
              <p style="margin: 8px 0 0 0; color: #666;">
                To prevent fake ratings and build real trust, we require quick identity verification.
              </p>
            </div>

            <a href="${verifyUrl}" style="background-color: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; font-size: 16px;">
              🔒 Verify Identity & Rate
            </a>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              <strong>Why verification?</strong><br>
              • Prevents fake ratings<br>
              • Builds real trust with lenders<br>
              • Takes only 30 seconds<br>
              • Your identity is protected
            </p>
          </div>
        `,
      });

      if (error) {
        console.error('❌ Email sending error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }

      console.log('✅ Verification email sent successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Verification email sent successfully',
        type: 'email'
      });

    } else if (contactType === 'whatsapp') {
      // Generate WhatsApp message with verification link
      const verifyUrl = `${process.env.NEXTAUTH_URL}/rate/${rater.id}/verify`;
      
      const whatsappMessage = `🔒 VERIFICATION REQUIRED

${rater.name || 'A trader'} is requesting your verified feedback on Trust.

To prevent fake ratings and build real trust, please verify your identity first:

${verifyUrl}

Why verification?
• Prevents fake ratings
• Builds real trust with lenders  
• Takes only 30 seconds
• Your identity is protected`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
      
      console.log('💬 WhatsApp verification URL generated');
      return NextResponse.json({ 
        success: true, 
        message: 'WhatsApp verification message ready',
        type: 'whatsapp',
        whatsapp_url: whatsappUrl
      });
    }

    return NextResponse.json({ error: 'Invalid contact type' }, { status: 400 });

  } catch (error: any) {
    console.error('❌ Rating creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}