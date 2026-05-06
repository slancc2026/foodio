import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, credits } = await request.json();

  if (!userId || typeof credits !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: credits } },
  });

  return NextResponse.json({ credits: user.credits });
}
