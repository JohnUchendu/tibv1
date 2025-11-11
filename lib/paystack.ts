// lib/paystack.ts
import crypto from 'crypto';

export const initializePayment = async ({
  email,
  amount,
  reference,
  metadata,
}: {
  email: string;
  amount: number;
  reference: string;
  metadata: any;
}) => {
  try {
    console.log('🔗 Initializing Paystack payment...', { 
      email, 
      amount, 
      reference,
      metadata 
    });

    // Check if Paystack secret key is available
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables');
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`,
        metadata,
      }),
    });

    const data = await response.json();
    console.log('📦 Paystack API response:', data);

    if (!data.status) {
      throw new Error(data.message || 'Paystack initialization failed');
    }

    if (!data.data?.authorization_url) {
      throw new Error('No authorization URL received from Paystack');
    }

    console.log('✅ Payment initialized successfully:', data.data.authorization_url);
    return data.data.authorization_url;

  } catch (error: any) {
    console.error('❌ Paystack initialization error:', error);
    throw new Error(`Payment initialization failed: ${error.message}`);
  }
};

export const verifyPaystackWebhook = (payload: string, signature: string) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(payload)
    .digest('hex');
  return hash === signature;
};
