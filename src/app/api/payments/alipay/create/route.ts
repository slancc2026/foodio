import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAlipaySdk, PAYMENT_PLANS, createOutTradeNo } from '@/lib/alipay';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { plan?: string; price?: number; credits?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { plan, price, credits } = body;

  // Determine if this is a plan purchase or custom top-up
  const isPlan = plan && PAYMENT_PLANS[plan as keyof typeof PAYMENT_PLANS];
  const isCustom = typeof price === 'number' && typeof credits === 'number' && price > 0 && credits > 0;

  if (!isPlan && !isCustom) {
    return NextResponse.json({ error: 'Invalid plan or missing price/credits' }, { status: 400 });
  }

  const planConfig = isPlan
    ? PAYMENT_PLANS[plan as keyof typeof PAYMENT_PLANS]
    : null;
  const amount = isPlan ? planConfig!.price : price!;
  const creditsAmount = isPlan ? planConfig!.credits : credits!;
  const subject = isPlan
    ? `Foodio ${planConfig!.name}`
    : `Foodio 充值 ${creditsAmount}点`;
  const description = isPlan
    ? planConfig!.description
    : `一次性购买${creditsAmount}点AI生成点数`;

  const outTradeNo = createOutTradeNo();

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      amount,
      credits: creditsAmount,
      channel: 'alipay',
      outTradeNo,
      status: 'pending',
    },
  });

  const alipaySdk = getAlipaySdk();

  if (!alipaySdk) {
    return NextResponse.json({
      mock: true,
      outTradeNo,
      message: '支付宝未配置，模拟支付模式',
      plan: planConfig,
    });
  }

  let result;
  try {
    result = await alipaySdk.exec('alipay.trade.precreate', {
      bizContent: {
        outTradeNo,
        totalAmount: amount.toString(),
        subject,
        body: description,
      },
    });
  } catch (e: any) {
    console.error('Alipay precreate error:', e);
    return NextResponse.json({
      error: `支付宝预创建订单失败: ${e.message || e.code || '未知错误'}`,
      details: e.data?.subCode || e.data?.subMsg || '',
    }, { status: 502 });
  }

  return NextResponse.json({
    qrCode: result.qrCode,
    outTradeNo,
    plan: planConfig,
  });
}
