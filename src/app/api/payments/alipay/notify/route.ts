import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAlipaySdk } from '@/lib/alipay';

export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    const text = await request.text();
    body = Object.fromEntries(new URLSearchParams(text));
  } catch {
    return new NextResponse('failure', { status: 400 });
  }

  const outTradeNo = body.out_trade_no;
  const tradeNo = body.trade_no;
  const tradeStatus = body.trade_status;

  if (!outTradeNo) {
    return new NextResponse('failure', { status: 400 });
  }

  // Try to verify signature with alipay-sdk if available
  const alipaySdk = getAlipaySdk();
  if (alipaySdk) {
    try {
      const verified = alipaySdk.checkNotifySign(body);
      if (!verified) {
        return new NextResponse('failure', { status: 400 });
      }
    } catch {
      // Signature verification failed
      return new NextResponse('failure', { status: 400 });
    }
  }

  // Handle trade status
  if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
    const payment = await prisma.payment.findUnique({ where: { outTradeNo } });
    if (!payment) {
      return new NextResponse('failure', { status: 404 });
    }

    if (payment.status === 'paid') {
      return new NextResponse('success');
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { outTradeNo },
        data: {
          status: 'paid',
          tradeNo: tradeNo || null,
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

    return new NextResponse('success');
  }

  return new NextResponse('success');
}
