import { AlipaySdk } from 'alipay-sdk';

let alipayInstance: AlipaySdk | null = null;

export function getAlipaySdk(): AlipaySdk | null {
  if (alipayInstance) return alipayInstance;

  const appId = process.env.ALIPAY_APP_ID;
  const privateKey = process.env.ALIPAY_PRIVATE_KEY;
  const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;

  if (!appId || !privateKey || !alipayPublicKey) {
    return null;
  }

  alipayInstance = new AlipaySdk({
    appId,
    privateKey,
    alipayPublicKey,
    gateway: 'https://openapi.alipay.com/gateway.do',
  });

  return alipayInstance;
}

export const PAYMENT_PLANS = {
  basic: {
    price: 99,
    credits: 20,
    name: '基础版',
    description: '20张AI图片 + 不限文案生成',
  },
  pro: {
    price: 299,
    credits: 100,
    name: '专业版',
    description: '100张AI图片 + 40个AI视频 + 不限文案',
  },
};

export function createOutTradeNo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FM${timestamp}${random}`;
}
