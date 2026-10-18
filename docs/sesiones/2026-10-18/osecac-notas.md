# OSECAC — notas de investigación (18-oct-2026)

Objetivo: cubrir la búsqueda "cartilla osecac" (2.400/mes en el Planificador de Google Ads; la marca sola tiene 165.000) sin inventar una cartilla.

## Lo que ya existe en el sitio
- Ficha de la obra social con su FAQ en `lib/data/obras-sociales.ts` (OSECAC: código 1-2620-5, razón social "Obra Social de los Empleados de Comercio y Actividades Civiles"; FAQ "¿OSECAC es lo mismo que el SEC o el sindicato de Comercio?").
- No hay página de cartilla de OSECAC.

## Lo verificado en la web oficial (osecac.org.ar, consultada el 18-oct-2026)
- La cartilla de centros de atención pide iniciar sesión: `https://www.osecac.org.ar/Account/Login?ReturnUrl=/Centros`.
- Páginas que la web enlaza (no se verificó si piden login): guardias `https://www.osecac.org.ar/cartillasguardias`, farmacias `https://www.osecac.org.ar/Farmacias`, turnos `https://www.osecac.org.ar/Turnos`, vademécum `https://www.osecac.org.ar/Vademecus`.
- Teléfonos publicados: beneficiarios 0800-666-0400; turnos 0810-999-0101; reclamos 0800-666-0445; emergencias 0810 333 0004.
- App "Mi OSECAC" (Google Play `me.miaid.osecac`; App Store `https://apps.apple.com/ar/app/mi-osecac/id6464329082`); versión web en `https://www.osecac.org.ar/Account/Login`.
- Para solicitar turno hay que tener el DNI del paciente; las órdenes de prácticas y estudios pueden ser requeridas.

## Por verificar antes de escribir
- Abrir en el navegador `cartillasguardias`, `Farmacias` y `Turnos` para ver si son públicas (la lectura automática no lo pudo decir).
- Si la cartilla pública existe en otra URL ("Cartillas" en el menú), cómo se filtra (rubro, provincia, localidad).
- Cualquier dato de prensa o de sitios de terceros sobre un "portal móvil" no está confirmado: no usarlo.

## Idea de página (sin cartilla propia)
Guía "Cartilla OSECAC: cómo consultarla, guardias, farmacias y teléfonos (2026)": qué se puede ver sin login y qué no, los teléfonos oficiales, la app, cómo sacar turno, y el enlace a la ficha. Marcar con claridad que la cartilla completa la mantiene OSECAC y exige ingreso de afiliado. Enlazar desde la ficha de OSECAC y desde la lista de cartillas. Mismo criterio que el resto: fuentes oficiales con fecha.
