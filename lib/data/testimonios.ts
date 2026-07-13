export interface Testimonio {
  id: number
  nombre: string
  ciudad: string
  prepagaSlug: string
  planNombre?: string
  fecha: string
  texto: string
  rating: number
  ahorro?: string
}

export const testimonios: Testimonio[] = [
  // Swiss Medical
  { id: 1,  nombre: 'Martín R.',    ciudad: 'Buenos Aires', prepagaSlug: 'swiss-medical', planNombre: 'SMG20',    fecha: 'Mayo 2026',     rating: 5, texto: 'El SMG20 es lo mejor que contratamos. Sin copago, se atienden en todos los sanatorios propios y la app es excelente. Cambiamos desde OSDE 210 y notamos la diferencia.',                ahorro: '$47.000/mes' },
  { id: 2,  nombre: 'Verónica L.',  ciudad: 'Córdoba',      prepagaSlug: 'swiss-medical', planNombre: 'SMG20',    fecha: 'Abril 2026',    rating: 5, texto: 'La atención en el Sanatorio Los Arcos es muy buena. Nunca tuve problemas con autorizaciones y el módulo de salud mental está muy bien cubierto.',                                             },
  { id: 3,  nombre: 'Diego P.',     ciudad: 'Rosario',      prepagaSlug: 'swiss-medical', planNombre: 'S2',       fecha: 'Marzo 2026',    rating: 4, texto: 'Buen plan de entrada. Para lo que pago cubre muy bien las urgencias y el servicio de guardia es rápido. La app para pedir turnos me ahorra mucho tiempo.',                                    },
  { id: 4,  nombre: 'Florencia K.', ciudad: 'Mendoza',      prepagaSlug: 'swiss-medical', planNombre: 'SMG30',    fecha: 'Febrero 2026',  rating: 5, texto: 'El acceso al Hospital Alemán fue determinante para elegir el SMG30. Tuve una cirugía y todo fluyó perfecto, sin pagar nada extra. Muy recomendable.',                                          },
  { id: 5,  nombre: 'Gustavo M.',   ciudad: 'Buenos Aires', prepagaSlug: 'swiss-medical',                         fecha: 'Enero 2026',    rating: 3, texto: 'La cobertura es excelente pero los aumentos constantes hacen difícil mantenerlo. Pasé del SMG20 al S2 para bajar el costo. El servicio en sí no tiene quejas.',                               },

  // OSDE
  { id: 6,  nombre: 'Lucía M.',     ciudad: 'Buenos Aires', prepagaSlug: 'osde', planNombre: 'Plan 310',  fecha: 'Junio 2026',    rating: 5, texto: 'El Plan 310 tiene la red más grande que encontré. Hospital Italiano, Alemán, médico a domicilio sin cargo. Para una familia de 4 es la opción más completa.',                   ahorro: '$89.000/mes' },
  { id: 7,  nombre: 'Santiago F.',  ciudad: 'La Plata',     prepagaSlug: 'osde', planNombre: 'Plan 210',  fecha: 'Mayo 2026',     rating: 4, texto: 'El 210 cumple para lo básico. La cartilla es gigante y encuentro turno para cualquier especialidad en menos de 48 horas. El copago molesta pero el precio lo justifica.',            },
  { id: 8,  nombre: 'Romina A.',    ciudad: 'Tucumán',      prepagaSlug: 'osde', planNombre: 'OSDE Flux', fecha: 'Abril 2026',    rating: 5, texto: 'Tengo 27 años y el Flux es ideal. Psicología ilimitada, anticonceptivos al 100% y precio razonable. No entiendo por qué no es más conocido fuera de Buenos Aires.',                  },
  { id: 9,  nombre: 'Pablo G.',     ciudad: 'Rosario',      prepagaSlug: 'osde', planNombre: 'Plan 410',  fecha: 'Marzo 2026',    rating: 5, texto: 'Con hijos, el 410 marca la diferencia: ortodoncia sin límite de edad, habitación individual, implantes. Parece caro pero cuando lo usás entendés por qué vale.',                     },
  { id: 10, nombre: 'Natalia C.',   ciudad: 'Mendoza',      prepagaSlug: 'osde',                          fecha: 'Febrero 2026',  rating: 3, texto: 'La cobertura es buena pero los tiempos de espera para algunas especialidades son largos. Hay que insistir para conseguir turnos con los mejores especialistas.',                         },

  // Sancor Salud
  { id: 11, nombre: 'Andrés V.',    ciudad: 'Córdoba',      prepagaSlug: 'sancor-salud', planNombre: 'Plan 1000', fecha: 'Mayo 2026',    rating: 5, texto: 'Sancor Plan 1000 es la mejor relación precio-calidad del mercado. Sin copago, red nacional, y la atención en Córdoba es muy buena. Imposible encontrar algo igual por este precio.', },
  { id: 12, nombre: 'Mariana T.',   ciudad: 'Santa Fe',     prepagaSlug: 'sancor-salud', planNombre: 'Plan 1000', fecha: 'Abril 2026',   rating: 5, texto: 'Llevamos 3 años con Sancor y nunca tuvimos que pelear una autorización. Los médicos en la cartilla son excelentes y la cobertura en el interior es mucho mejor que otras.',      },
  { id: 13, nombre: 'Hernán D.',    ciudad: 'Tucumán',      prepagaSlug: 'sancor-salud', planNombre: 'F800',      fecha: 'Marzo 2026',   rating: 4, texto: 'Para el interior es la mejor opción. El F800 cubre bien las urgencias y los especialistas son accesibles. El único tema es que algunos estudios de alta complejidad tardan.',      },
  { id: 14, nombre: 'Claudia R.',   ciudad: 'Buenos Aires', prepagaSlug: 'sancor-salud', planNombre: 'Plan 1500', fecha: 'Enero 2026',   rating: 4, texto: 'Buena prepaga. El Plan 1500 da seguridad en internaciones y los medicamentos oncológicos están muy bien cubiertos. Para enfermedades complejas es muy sólida.',                  },

  // Medifé
  { id: 15, nombre: 'Carolina S.',  ciudad: 'Buenos Aires', prepagaSlug: 'medife', planNombre: 'Medifé Plus', fecha: 'Mayo 2026',   rating: 5, texto: 'El Sanatorio Finochietto es de primer nivel y el Plus me da acceso completo. El Cam Doctor para consultas online es un diferencial enorme, sobre todo con chicos chicos.',     },
  { id: 16, nombre: 'Roberto M.',   ciudad: 'Rosario',      prepagaSlug: 'medife', planNombre: 'Plata',      fecha: 'Abril 2026',   rating: 4, texto: 'Muy buena relación precio calidad. Los reintegros por atención fuera de cartilla funcionan bien y son rápidos. Para una familia joven es una opción muy competitiva.',        },
  { id: 17, nombre: 'Lorena P.',    ciudad: 'Córdoba',      prepagaSlug: 'medife', planNombre: 'Oro',        fecha: 'Febrero 2026', rating: 5, texto: 'Elegimos el Oro por la ortodoncia para nuestros hijos. Cubre hasta los 21 años sin límite. Nunca tuve problemas y los turnos los sacamos por la app en menos de un día.',       },

  // Omint
  { id: 18, nombre: 'Alejandro B.', ciudad: 'Buenos Aires', prepagaSlug: 'omint', planNombre: 'Global',   fecha: 'Junio 2026',   rating: 5, texto: 'Omint tiene los tres mejores sanatorios del país. Bazterrica, Santa Isabel y Del Sol. Para quien busca calidad premium sin pagar el Plan 510 de OSDE, es la respuesta.',         },
  { id: 19, nombre: 'Silvana N.',   ciudad: 'Buenos Aires', prepagaSlug: 'omint', planNombre: 'Clásico',  fecha: 'Marzo 2026',   rating: 5, texto: 'La atención es muy diferente a las prepagas masivas. Se nota que tienen menos afiliados y más recursos. El médico a domicilio sin cargo es un lujo que no quiero abandonar.',   },
  { id: 20, nombre: 'Tomás W.',     ciudad: 'Buenos Aires', prepagaSlug: 'omint', planNombre: 'Smart',    fecha: 'Enero 2026',   rating: 4, texto: 'El Smart es el plan de entrada de Omint pero ya tiene los tres sanatorios propios. Si podés pagarlo, es muchísimo mejor que cualquier plan equivalente de Swiss o OSDE.',          },

  // Medicus
  { id: 21, nombre: 'Valeria C.',   ciudad: 'Buenos Aires', prepagaSlug: 'medicus', planNombre: 'Celeste', fecha: 'Mayo 2026',    rating: 5, texto: 'El plan Celeste de Medicus cambió nuestra experiencia de salud. El Hospital Alemán y Otamendi sin copago es increíble. Los médicos son de otro nivel.',                           },
  { id: 22, nombre: 'Facundo L.',   ciudad: 'Buenos Aires', prepagaSlug: 'medicus', planNombre: 'Family',  fecha: 'Marzo 2026',   rating: 5, texto: 'Con dos chicos la ortodoncia hasta 18 años y la asistencia al viajero fueron decisivos. Medicus Family es perfecto para familias jóvenes que viajan.',                          },

  // CEMIC
  { id: 23, nombre: 'Marta G.',     ciudad: 'Buenos Aires', prepagaSlug: 'cemic', planNombre: 'Individual', fecha: 'Abril 2026',   rating: 5, texto: 'Siendo diabética necesito mucho el sistema. CEMIC tiene una gestión de crónicos excelente: me llaman para los controles, tienen enfermeras de cabecera. No cambiaría.',         },
  { id: 24, nombre: 'Ezequiel P.',  ciudad: 'Buenos Aires', prepagaSlug: 'cemic', planNombre: 'Básico',     fecha: 'Febrero 2026', rating: 4, texto: 'Para atenderse en CEMIC está perfecto. El sistema integrado hospital-prepaga es una ventaja enorme. La contrapartida es que fuera de CABA la cobertura se complica.',          },

  // Avalian
  { id: 25, nombre: 'Jimena R.',    ciudad: 'Córdoba',      prepagaSlug: 'avalian', planNombre: 'Full',    fecha: 'Mayo 2026',    rating: 5, texto: 'Avalian (antes Galeno) mejoró mucho con el rebrand. El Full sin copago y con Cam Doctor 24hs es imbatible para el precio que tiene. La red en Córdoba es muy buena.',           },
  { id: 26, nombre: 'Rodrigo M.',   ciudad: 'Mendoza',      prepagaSlug: 'avalian', planNombre: 'Plus',    fecha: 'Abril 2026',   rating: 4, texto: 'En Mendoza tienen buena cobertura. El Plus cubre bien todo lo básico y los turnos son rápidos. La telemedicina me salvó varias veces con los chicos.',                          },

  // Prevención Salud
  { id: 27, nombre: 'Ignacio T.',   ciudad: 'Buenos Aires', prepagaSlug: 'prevencion-salud', planNombre: 'Plata', fecha: 'Junio 2026',  rating: 4, texto: 'La Plata de Prevención es ideal si buscás precio accesible con red decente. No tiene los hospitales top pero para consultas y urgencias está muy bien.',                   },
  { id: 28, nombre: 'Daniela K.',   ciudad: 'Salta',        prepagaSlug: 'prevencion-salud', planNombre: 'Bronce',fecha: 'Marzo 2026',  rating: 4, texto: 'En Salta tiene buena cobertura. El Bronce es accesible y cumple. Para el interior del país es de las pocas que tiene cobertura real sin ser OSDE o Swiss.',                 },

  // Premedic
  { id: 29, nombre: 'Tomás A.',     ciudad: 'Buenos Aires', prepagaSlug: 'premedic', planNombre: 'Plan 300', fecha: 'Abril 2026',  rating: 4, texto: 'Para estar cubierto sin gastar mucho es ideal. Premedic Plan 300 cumple para consultas y urgencias. Para estudios complejos hay demoras pero para el precio que pago está bien.', },
  { id: 30, nombre: 'Julieta V.',   ciudad: 'Tucumán',      prepagaSlug: 'premedic', planNombre: 'Plan 200', fecha: 'Febrero 2026',rating: 3, texto: 'La más barata del mercado y se nota. Para jóvenes sanos es suficiente. Cuando tuve algo más serio tuve que esperar mucho para las autorizaciones.',                              },
]

export function getTestimoniosByPrepaga(slug: string): Testimonio[] {
  return testimonios.filter((t) => t.prepagaSlug === slug)
}

export function getAllTestimonios(): Testimonio[] {
  return testimonios
}
