import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAlipaySdk } from '@/lib/alipay';

export async function GET(request: NextRequest) {
  const outTradeNo = request.nextUrl.searchParams.get('outTradeNo');
  if (!outTradeNo) {
    return NextResponse.json({ error: 'Missing outTradeNo' }, { status: 400 });
  }

  let payment = await prisma.payment.findUnique({ where: { outTradeNo } });
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  // 如果数据库状态还是 pending，去支付宝查询真实状态
  if (payment.status === 'pending') {
    const alipaySdk = getAlipaySdk();
    if (alipaySdk) {
      try {
        const result = await alipaySdk.exec('alipay.trade.query', {
          bizContent: { outTradeNo },
        });

        // 支付宝交易状态: TRADE_SUCCESS 表示支付成功
        if (result.tradeStatus === 'TRADE_SUCCESS') {
          payment = await prisma.payment.update({
            where: { outTradeNo },
            data: {
              status: 'paid',
              tradeNo: result.tradeNo,
              paidAt: new Date(),
            },
          });

          // 支付成功，给用户加积分
          await prisma.user.update({
            where: { id: payment.userId },
            data: { credits: { increment: payment.credits } },
          });
        }
      } catch (e) {
        // 查询失败不要紧，前端继续轮询
        console.error('Alipay query error:', e);
      }
    }
  }

  return NextResponse.json({
    status: payment.status,
    amount: payment.amount,
    credits: payment.credits,
  });
}
