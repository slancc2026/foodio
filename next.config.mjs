/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/i18n.ts');

const nextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
