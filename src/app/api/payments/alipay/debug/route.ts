import { NextResponse } from 'next/server';
import { getAlipaySdk } from '@/lib/alipay';

export async function GET() {
  try {
    const sdk = getAlipaySdk();
    
    if (!sdk) {
      return NextResponse.json({
        status: 'no_sdk',
        message: '支付宝未配置',
        env: {
          ALIPAY_APP_ID: process.env.ALIPAY_APP_ID ? '✅ 已设置' : '❌ 未设置',
          ALIPAY_PRIVATE_KEY: process.env.ALIPAY_PRIVATE_KEY ? `✅ 已设置 (长度: ${process.env.ALIPAY_PRIVATE_KEY.length})` : '❌ 未设置',
          ALIPAY_PUBLIC_KEY: process.env.ALIPAY_PUBLIC_KEY ? `✅ 已设置 (长度: ${process.env.ALIPAY_PUBLIC_KEY.length})` : '❌ 未设置',
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ 已设置' : '❌ 未设置',
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ 未设置',
          DATABASE_URL: process.env.DATABASE_URL ? `✅ 已设置 (开头: ${process.env.DATABASE_URL.substring(0, 20)}...)` : '❌ 未设置',
          DASHSCOPE_API_KEY: process.env.DASHSCOPE_API_KEY ? '✅ 已设置' : '❌ 未设置',
        }
      });
    }

    // 测试支付宝 API 调用
    const outTradeNo = `DEBUG${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const result = await sdk.exec('alipay.trade.precreate', {
      bizContent: {
        outTradeNo,
        totalAmount: '0.01',
        subject: 'Foodio 调试支付',
        body: '1分钱调试订单',
      },
    });

    return NextResponse.json({
      status: 'success',
      sdkInitialized: true,
      qrCode: result.qrCode,
      outTradeNo,
      message: '支付宝 API 调用成功',
      env: {
        ALIPAY_APP_ID: process.env.ALIPAY_APP_ID ? '✅ 已设置' : '❌ 未设置',
        ALIPAY_PRIVATE_KEY: process.env.ALIPAY_PRIVATE_KEY ? `✅ 已设置 (长度: ${process.env.ALIPAY_PRIVATE_KEY.length})` : '❌ 未设置',
      }
    });
  } catch (e: any) {
    return NextResponse.json({
      status: 'error',
      message: e.message || '未知错误',
      code: e.code,
      subCode: e.data?.subCode,
      subMsg: e.data?.subMsg,
      stack: (e.stack || '').split('\n').slice(0, 5).join('\n'),
    }, { status: 500 });
  }
}
