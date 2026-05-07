import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  let body: { outTradeNo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { outTradeNo } = body;
  if (!outTradeNo) {
    return NextResponse.json({ error: 'Missing outTradeNo' }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { outTradeNo } });
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  if (payment.status === 'paid') {
    return NextResponse.json({ message: 'Already paid', status: 'paid' });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { outTradeNo },
      data: {
        status: 'paid',
        tradeNo: `MOCK_${outTradeNo}`,
        paidAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: {
        credits: { increment: payment.credits },
      },
    }),
  ]);

  return NextResponse.json({
    message: 'Payment marked as paid (mock)',
    credits: payment.credits,
    status: 'paid',
  });
}
