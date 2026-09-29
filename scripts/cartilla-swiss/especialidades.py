"""Cartilla de Swiss Medical por especialidad — SOLO centros e instituciones.

Pedido de Darío (28-sep-2026): por especialidad (pediatría, traumatología,
dermatología...) y fertilidad, mostrar los centros médicos de cada zona y
cuántos profesionales de esa especialidad hay, SIN datos de médicos
particulares (de los profesionales solo se cuenta la cantidad).

Fuente: el mismo buscador público que usa swiss.py
(busquedaPrestadoresSinCalif, tipo 1 = especialidades).

Confirmado en el buscador oficial (28-sep-2026): "Esterilidad" es el único
nombre de especialidad relacionado a fertilidad (probado "fertil", "reprod" y
"esteril" en el combo de especialidad del sitio — solo esta última trae
resultado). Se usa tal cual para la sección de fertilización asistida.

Uso:
  python especialidades.py descargar <carpeta_raw>
  python especialidades.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/swiss-medical-especialidades.json
"""
import json, os, re, sys, time
from datetime import date
import importlib.util

_spec = importlib.util.spec_from_file_location('swiss', os.path.join(os.path.dirname(__file__), 'swiss.py'))
swiss = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(swiss)

ESPECIALIDADES = [
    'Pediatría', 'Traumatología y Ortopedia', 'Ginecología', 'Cardiología',
    'Dermatología', 'Oftalmología', 'Esterilidad',
]
TOPE = 600  # el buscador devuelve hasta 600 resultados por consulta
# Consultorio con nombre de médico puntual (ej. "Consultorio Dr. Kreutzer"): va
# como profesional, no como institución — ver generar().
ES_CONSULTORIO_PARTICULAR = re.compile(r'consultorio.*\bdra?\.?\b', re.I)


def descargar(carpeta):
    os.makedirs(carpeta, exist_ok=True)
    for carti in swiss.CARTILLAS:
        for esp in ESPECIALIDADES:
            destino = os.path.join(carpeta, f'{carti}__{esp}.json')
            if os.path.exists(destino):
                continue
            r = swiss.pedir('1', carti, esp)
            docs = r['docs']
            if r['numFound'] > TOPE:
                docs = []
                for prov in swiss.PROVINCIAS:
                    rp = swiss.pedir('1', carti, esp, prov)
                    docs.extend(rp['docs'])
                    time.sleep(1)
            json.dump(docs, open(destino, 'w', encoding='utf-8'), ensure_ascii=False)
            print(carti, esp, len(docs), flush=True)
            time.sleep(1)


# Prestad_Tipo_Deno trae "Institución", "Prestador" (médico particular) o
# "Equipo" (equipo médico, no institución). Solo se guardan datos de
# instituciones; de "Prestador"/"Equipo" se cuenta la cantidad (por "prestad",
# el id del prestador en la fuente) y nunca se guarda el nombre — regla de
# Darío, 28-sep-2026.
def generar(raw, salida):
    zonas = {}
    for carti, plan in swiss.CARTILLAS.items():
        for esp in ESPECIALIDADES:
            docs = json.load(open(os.path.join(raw, f'{carti}__{esp}.json'), encoding='utf-8'))
            for doc in docs:
                nombre_z, slug, provincias = swiss.zona_de(doc)
                if not slug:
                    continue
                if slug in zonas and zonas[slug]['provincias'] != provincias:
                    slug = f'{slug}-{swiss.clave(provincias[0])}'
                z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre_z, 'provincias': provincias, 'especialidades': {}})
                e = z['especialidades'].setdefault(esp, {'centros': {}, 'profesionales': set(), 'profesionalesPorPlan': {}})
                nom = swiss.nombre_centro(doc.get('ape_razon'))
                # "Institución" según Swiss, pero el nombre es un consultorio con
                # nombre de médico puntual (ej. "Consultorio Pediátrico Urquiza -
                # Dr. Aprigliano y Equipo"): va como profesional, no como centro.
                # Los hospitales/clínicas "Dr. Apellido" (nombre propio de la
                # institución, ej. "Hospital Dr. Illia") sí quedan: ya están
                # publicados así en la cartilla de internación/guardia.
                es_consultorio_particular = ES_CONSULTORIO_PARTICULAR.search(nom)
                if doc.get('Prestad_Tipo_Deno') != 'Institución' or es_consultorio_particular:
                    pid = doc.get('prestad')
                    if pid:
                        e['profesionales'].add(pid)
                        e['profesionalesPorPlan'].setdefault(plan, set()).add(pid)
                    continue
                c = e['centros'].setdefault(swiss.clave(nom), {'nombre': nom, 'planes': [], 'notas': [], 'sedes': []})
                if plan not in c['planes']:
                    c['planes'].append(plan)
                if doc.get('Centro_Propio') and 'Centro propio de Swiss Medical' not in c['notas']:
                    c['notas'].append('Centro propio de Swiss Medical')
                calle = ' '.join(x for x in [swiss.titulo(doc.get('calle')), (doc.get('numero') or '').strip()] if x) or None
                if not any(swiss.clave(s['direccion'] or '') == swiss.clave(calle or '') for s in c['sedes']):
                    caba = (doc.get('deno_prov') or '').strip().upper() == 'CAPITAL FEDERAL'
                    loca = swiss.titulo(doc.get('deno_barr') if caba else doc.get('deno_loca') or '') or None
                    tel = re.sub(r'\s+', ' ', (doc.get('tele') or '').strip()) or None
                    lat, lon = doc.get('coordenada_1_coordinate'), doc.get('coordenada_0_coordinate')
                    c['sedes'].append({
                        'direccion': calle, 'localidad': loca, 'tel': tel,
                        'lat': lat if isinstance(lat, (int, float)) else None,
                        'lon': lon if isinstance(lon, (int, float)) else None,
                        'turnoDigital': doc.get('turno_digital') == '1',
                    })

    salida_zonas = []
    for z in zonas.values():
        especialidades_z = {}
        for esp, e in z['especialidades'].items():
            centros = list(e['centros'].values())
            for c in centros:
                c['planes'] = [p for p in swiss.ORDEN_PLANES if p in c['planes']]
            centros.sort(key=lambda c: (not any('propio' in n.lower() for n in c['notas']), swiss.clave(c['nombre'])))
            especialidades_z[esp] = {
                'centros': centros,
                'profesionales': len(e['profesionales']),
                'profesionalesPorPlan': {p: len(ids) for p, ids in e['profesionalesPorPlan'].items()},
            }
        salida_zonas.append({'slug': z['slug'], 'nombre': z['nombre'], 'provincias': z['provincias'], 'especialidades': especialidades_z})

    out = {
        'fuente': 'Buscador oficial de cartilla de Swiss Medical (swissmedical.com.ar/prepagaclientes/cartilla)',
        'vigencia': [date.today().strftime('%d/%m/%Y')],
        'planes': swiss.ORDEN_PLANES,
        'especialidades': ESPECIALIDADES,
        'zonas': salida_zonas,
    }
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    total_centros = sum(len(e['centros']) for z in salida_zonas for e in z['especialidades'].values())
    print(len(salida_zonas), 'zonas', total_centros, 'centros (con repetición por especialidad)')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
