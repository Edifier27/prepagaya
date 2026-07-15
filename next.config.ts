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
      // Alias de la herramienta (naming del silo SEO local)
      {
        source: "/cotizador",
        destination: "/comparador",
        permanent: true,
      },
      // Migración /prepagas-en/[ciudad] → hubs provinciales del silo.
      // Solo las ciudades cuya provincia ya tiene hub; el resto migra al
      // expandir provincias (no redirigir a un 404).
      {
        source: "/prepagas-en/cordoba",
        destination: "/prepagas/cordoba",
        permanent: true,
      },
      {
        source: "/prepagas-en/salta",
        destination: "/prepagas/salta",
        permanent: true,
      },
      {
        source: "/prepagas-en/neuquen",
        destination: "/prepagas/neuquen",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
