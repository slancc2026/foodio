import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const outTradeNo = request.nextUrl.searchParams.get('outTradeNo');
  if (!outTradeNo) {
    return NextResponse.json({ error: 'Missing outTradeNo' }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { outTradeNo } });
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  return NextResponse.json({
    status: payment.status,
    amount: payment.amount,
    credits: payment.credits,
  });
}
