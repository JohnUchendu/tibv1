// app/api/rating/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { ratedId: params.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        rater: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ ratings });
  } catch (error: any) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}