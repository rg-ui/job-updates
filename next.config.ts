import type { NextConfig } from "next";

const csp = [
  `default-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.vercel-analytics.com`,
  `font-src 'self' https://fonts.gstatic.com data:`,
  `img-src 'self' data:`,
  `connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://vitals.vercel-insights.com`,
  `frame-src 'none'`,
  `form-action 'self'`,
  `base-uri 'self'`,
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
