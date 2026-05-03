import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const PLANS = {
  free: {
    name: 'free',
    credits: 2,
    price: 0,
    images: 2,
    videos: 0,
  },
  basic: {
    name: 'basic',
    credits: 30, // 20 images + 10 videos
    price: 99,
    images: 20,
    videos: 10,
  },
  pro: {
    name: 'pro',
    credits: 140, // 100 images + 40 videos
    price: 299,
    images: 100,
    videos: 40,
  },
} as const;

export type PlanType = keyof typeof PLANS;
