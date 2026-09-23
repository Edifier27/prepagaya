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
      // Consolidación anti-canibalización (sep-2026): posts del blog que competían
      // por la misma búsqueda con una guía, cobertura o comparativa más completa.
      {
        source: "/blog/osde-vs-cemic",
        destination: "/comparativas/osde-vs-cemic",
        permanent: true,
      },
      {
        source: "/blog/sancor-vs-medife",
        destination: "/comparativas/sancor-salud-vs-medife",
        permanent: true,
      },
      {
        source: "/blog/prepagas-vs-obra-social-diferencias",
        destination: "/guias/obra-social-vs-prepaga",
        permanent: true,
      },
      {
        source: "/blog/como-derivar-obra-social",
        destination: "/guias/derivar-obra-social-a-prepaga",
        permanent: true,
      },
      {
        source: "/blog/como-reclamar-a-una-prepaga",
        destination: "/guias/como-reclamar-a-una-prepaga",
        permanent: true,
      },
      {
        source: "/blog/como-pedir-reintegro-prepaga",
        destination: "/guias/reintegros-en-prepagas",
        permanent: true,
      },
      {
        source: "/blog/copago-coseguro-prepaga-diferencia",
        destination: "/guias/copago-en-prepagas-que-es",
        permanent: true,
      },
      {
        source: "/blog/prepagas-que-cubren-tratamientos-fertilidad",
        destination: "/coberturas/fertilidad",
        permanent: true,
      },
      {
        source: "/blog/prepaga-que-cubre-psicologia",
        destination: "/coberturas/psicologia",
        permanent: true,
      },
      {
        source: "/blog/mejor-prepaga-salud-mental-psicologia-2026",
        destination: "/condiciones/salud-mental",
        permanent: true,
      },
      {
        source: "/blog/cobertura-odontologia-prepaga",
        destination: "/coberturas/odontologia",
        permanent: true,
      },
      {
        source: "/blog/mejor-prepaga-odontologia-dental-2026",
        destination: "/coberturas/odontologia",
        permanent: true,
      },
      {
        source: "/blog/prepaga-cubre-anteojos-optica",
        destination: "/coberturas/optica",
        permanent: true,
      },
      {
        source: "/blog/que-es-el-pmo",
        destination: "/pmo",
        permanent: true,
      },
      {
        source: "/blog/ranking-prepagas-argentina-2026",
        destination: "/ranking",
        permanent: true,
      },
      {
        source: "/blog/mejor-prepaga-jovenes-argentina-2026",
        destination: "/para/jovenes",
        permanent: true,
      },
      {
        source: "/blog/aumento-prepaga-2026",
        destination: "/aumentos",
        permanent: true,
      },
      {
        source: "/blog/mayor-aumento-prepagas-2026-que-paso",
        destination: "/aumentos",
        permanent: true,
      },
      {
        source: "/blog/periodos-de-carencia-prepaga",
        destination: "/guias/prepaga-sin-periodo-carencia",
        permanent: true,
      },
      {
        source: "/blog/prepagas-que-mas-aumentaron",
        destination: "/guias/cuota-prepaga-aumento-inflacion",
        permanent: true,
      },
      {
        source: "/guias/prepagas-economicas",
        destination: "/prepagas-economicas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
