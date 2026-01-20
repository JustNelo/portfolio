import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hvmqsickdyzihpecwfgz.supabase.co',
      },
    ],
  },
};

export default nextConfig;
