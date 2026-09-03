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
      {
        source: "/prepagas-en/mendoza",
        destination: "/prepagas/mendoza",
        permanent: true,
      },
      {
        source: "/prepagas-en/tucuman",
        destination: "/prepagas/tucuman",
        permanent: true,
      },
      {
        source: "/prepagas-en/santa-fe",
        destination: "/prepagas/santa-fe",
        permanent: true,
      },
      {
        source: "/prepagas-en/rosario",
        destination: "/prepagas/santa-fe/rosario",
        permanent: true,
      },
      {
        source: "/prepagas-en/buenos-aires",
        destination: "/prepagas/buenos-aires",
        permanent: true,
      },
      {
        source: "/prepagas-en/la-plata",
        destination: "/prepagas/buenos-aires/la-plata",
        permanent: true,
      },
      {
        source: "/prepagas-en/mar-del-plata",
        destination: "/prepagas/buenos-aires/mar-del-plata",
        permanent: true,
      },
      {
        source: "/prepagas-en/posadas",
        destination: "/prepagas/misiones/posadas",
        permanent: true,
      },
      {
        source: "/prepagas-en/entre-rios",
        destination: "/prepagas/entre-rios",
        permanent: true,
      },
      {
        source: "/prepagas-en/chaco",
        destination: "/prepagas/chaco",
        permanent: true,
      },
      {
        source: "/prepagas-en/corrientes",
        destination: "/prepagas/corrientes",
        permanent: true,
      },
      {
        source: "/prepagas-en/misiones",
        destination: "/prepagas/misiones",
        permanent: true,
      },
      // Consolidación "mejor prepaga para X": /para/[perfil] queda como
      // página canónica única. /guias y /blog tenían versiones casi
      // idénticas compitiendo por la misma búsqueda (canibalización).
      {
        source: "/blog/cuanto-cuesta-prepaga-familia",
        destination: "/para/familias",
        permanent: true,
      },
      {
        source: "/guias/mejor-prepaga-para-familias",
        destination: "/para/familias",
        permanent: true,
      },
      {
        source: "/blog/mejor-prepaga-para-embarazadas",
        destination: "/para/embarazadas",
        permanent: true,
      },
      {
        source: "/blog/mejor-prepaga-maternidad-embarazo-2026",
        destination: "/para/embarazadas",
        permanent: true,
      },
      {
        source: "/guias/prepaga-para-embarazadas",
        destination: "/para/embarazadas",
        permanent: true,
      },
      {
        source: "/blog/obra-social-monotributistas",
        destination: "/para/monotributistas",
        permanent: true,
      },
      {
        source: "/blog/prepaga-para-monotributistas-argentina-2026",
        destination: "/para/monotributistas",
        permanent: true,
      },
      {
        source: "/blog/prepaga-para-trabajadores-remotos",
        destination: "/para/monotributistas",
        permanent: true,
      },
      {
        source: "/guias/prepagas-para-monotributistas",
        destination: "/para/monotributistas",
        permanent: true,
      },
      {
        source: "/guias/prepaga-para-freelancers-autonomos",
        destination: "/para/monotributistas",
        permanent: true,
      },
      {
        source: "/blog/prepaga-para-jubilados-pami-complementaria",
        destination: "/para/adultos-mayores",
        permanent: true,
      },
      {
        source: "/blog/prepaga-para-adultos-mayores",
        destination: "/para/adultos-mayores",
        permanent: true,
      },
      {
        source: "/guias/prepaga-para-mayores-60",
        destination: "/para/adultos-mayores",
        permanent: true,
      },
      {
        source: "/guias/prepaga-o-pami-jubilados",
        destination: "/para/adultos-mayores",
        permanent: true,
      },
      {
        source: "/blog/mejor-prepaga-jovenes-2026",
        destination: "/para/jovenes",
        permanent: true,
      },
      {
        source: "/blog/prepagas-para-empresas-beneficios-empleados",
        destination: "/para/empresas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
