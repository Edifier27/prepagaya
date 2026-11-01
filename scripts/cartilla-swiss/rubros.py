"""Ópticas y vacunatorios de Swiss Medical por zona — SOLO comercios e instituciones.

Pedido de Darío (2-nov-2026): sumar ópticas y vacunatorios a la cartilla online.

Fuente: el mismo buscador público que usa swiss.py (busquedaPrestadoresSinCalif,
tipo 1). Nombres exactos confirmados contra el buscador oficial (2-nov-2026):
"Ópticas" (798 resultados en SMG20) y "Vacunatorios" (118); "Vacunación",
"Vacunas" o "Vacunatorio" en singular no traen nada. Todos los resultados vienen
como "Institución", igual se filtra por las dudas (nunca médicos particulares).

Uso:
  python rubros.py descargar <carpeta_raw>
  python rubros.py generar <carpeta_raw> ../../lib/data/cartilla-zonas
    → swiss-medical-opticas.json y swiss-medical-vacunatorios.json
"""
import json, os, re, sys, time
from datetime import date
import importlib.util

_spec = importlib.util.spec_from_file_location('swiss', os.path.join(os.path.dirname(__file__), 'swiss.py'))
swiss = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(swiss)

RUBROS = {'opticas': 'Ópticas', 'vacunatorios': 'Vacunatorios'}
TOPE = 600  # el buscador devuelve hasta 600 resultados por consulta


def descargar(carpeta):
    os.makedirs(carpeta, exist_ok=True)
    for carti in swiss.CARTILLAS:
        for rubro, esp in RUBROS.items():
            destino = os.path.join(carpeta, f'{carti}__{rubro}.json')
            if os.path.exists(destino):
                continue
            r = swiss.pedir('1', carti, esp)
            docs = r['docs']
            if r['numFound'] > len(docs) or r['numFound'] >= TOPE:
                docs = []
                for prov in swiss.PROVINCIAS:
                    rp = swiss.pedir('1', carti, esp, prov)
                    if rp['numFound'] > len(rp['docs']):
                        print('  OJO: sigue truncado', carti, esp, prov, rp['numFound'], len(rp['docs']), flush=True)
                    docs.extend(rp['docs'])
                    time.sleep(1)
            json.dump({'numFound': r['numFound'], 'docs': docs}, open(destino, 'w', encoding='utf-8'), ensure_ascii=False)
            print(carti, esp, r['numFound'], len(docs), flush=True)
            time.sleep(1)


def numero(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def generar(raw, carpeta_salida):
    for rubro, esp in RUBROS.items():
        zonas = {}
        for carti, plan in swiss.CARTILLAS.items():
            d = json.load(open(os.path.join(raw, f'{carti}__{rubro}.json'), encoding='utf-8'))
            for doc in d['docs']:
                if doc.get('Prestad_Tipo_Deno') != 'Institución':
                    continue  # solo instituciones y comercios, nunca profesionales particulares
                nombre_z, slug, provincias = swiss.zona_de(doc)
                if not slug:
                    continue
                if slug in zonas and zonas[slug]['provincias'] != provincias:
                    slug = f'{slug}-{swiss.clave(provincias[0])}'
                z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre_z, 'provincias': provincias, 'centros': {}})
                nom = swiss.nombre_centro(doc.get('ape_razon'))
                if not nom:
                    continue
                calle = ' '.join(x for x in [swiss.titulo(doc.get('calle')), (doc.get('numero') or '').strip()] if x) or None
                c = z['centros'].setdefault(swiss.clave(f'{nom}-{calle or ""}'), {'nombre': nom, 'planes': [], 'notas': [], 'sedes': []})
                if plan not in c['planes']:
                    c['planes'].append(plan)
                if doc.get('Centro_Propio') and 'Centro propio de Swiss Medical' not in c['notas']:
                    c['notas'].append('Centro propio de Swiss Medical')
                if not any(swiss.clave(s['direccion'] or '') == swiss.clave(calle or '') for s in c['sedes']):
                    caba = (doc.get('deno_prov') or '').strip().upper() == 'CAPITAL FEDERAL'
                    loca = swiss.titulo(doc.get('deno_barr') if caba else doc.get('deno_loca') or '') or None
                    tel = re.sub(r'\s+', ' ', (doc.get('tele') or '').strip()) or None
                    c['sedes'].append({'direccion': calle, 'localidad': loca, 'tel': tel,
                                       'lat': numero(doc.get('coordenada_1_coordinate')),
                                       'lon': numero(doc.get('coordenada_0_coordinate')),
                                       'turnoDigital': doc.get('turno_digital') == '1'})
        salida_zonas = []
        for z in zonas.values():
            centros = list(z['centros'].values())
            for c in centros:
                c['planes'] = [p for p in swiss.ORDEN_PLANES if p in c['planes']]
            centros.sort(key=lambda c: (not c['notas'], swiss.clave(c['nombre'])))
            salida_zonas.append({**z, 'centros': centros})
        out = {'fuente': 'Buscador oficial de cartilla de Swiss Medical (swissmedical.com.ar/prepagaclientes/cartilla)',
               'vigencia': [date.today().strftime('%d/%m/%Y')], 'planes': swiss.ORDEN_PLANES, 'zonas': salida_zonas}
        salida = os.path.join(carpeta_salida, f'swiss-medical-{rubro}.json')
        json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(rubro, len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'centros')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
