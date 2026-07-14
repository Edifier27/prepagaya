import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /calculadora-costo duplicaba la intención de /calculadora — consolidado (SEO)
      {
        source: "/calculadora-costo",
        destination: "/calculadora",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
