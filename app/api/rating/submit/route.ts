// app/api/rating/submit/route.ts (Fixed with unique users)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { ratedId, score, comment, customerName } = await req.json();
    
    console.log('📝 Rating submission:', { ratedId, score, comment, customerName });
    
    if (!ratedId || score < 1 || score > 5) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check if the user being rated exists
    const ratedUser = await prisma.user.findUnique({
      where: { id: ratedId }
    });

    if (!ratedUser) {
      console.log('❌ Rated user not found:', ratedId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate UNIQUE anonymous user for each rating
    const uniqueAnonymousId = `customer-${uuidv4()}`;
    const uniqueAnonymousEmail = `customer-${uuidv4()}@trust.ibiz.name.ng`;
    const displayName = customerName || `Customer${Math.floor(Math.random() * 10000)}`;

    console.log('🆕 Creating unique customer profile...');

    // Create unique customer profile
    const customerUser = await prisma.user.create({
      data: {
        id: uniqueAnonymousId,
        email: uniqueAnonymousEmail,
        name: displayName,
        tier: 'FREE',
      },
    });

    // Check if this specific customer has already rated this trader
    const existingRating = await prisma.rating.findUnique({
      where: {
        raterId_ratedId: {
          raterId: customerUser.id,
          ratedId: ratedId
        }
      }
    });

    if (existingRating) {
      console.log('⚠️ This customer has already rated this trader');
      
      // Update existing rating
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          score,
          comment: comment || null,
          createdAt: new Date()
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Rating updated successfully'
      });
    }

    // Create new rating
    await prisma.rating.create({
      data: {
        raterId: customerUser.id,
        ratedId,
        score,
        comment: comment || null,
      },
    });

    console.log('✅ Rating submitted with unique customer profile');
    return NextResponse.json({ 
      success: true, 
      message: 'Rating submitted successfully'
    });

  } catch (error: any) {
    console.error('❌ Rating submission error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'You have already rated this trader.' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}