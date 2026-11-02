"""Cartilla de Sancor Salud por especialidad (kinesiología y psicología) — SOLO
centros e instituciones; de los profesionales particulares, solo la cantidad.

Pedido de Darío (2-nov-2026), mismo criterio que la cartilla por especialidad de
Swiss Medical (28-sep-2026): nunca datos de médicos particulares.

Fuente: el mismo buscador (busquedas.sancorsalud.com.ar). Los centros salen de
la categoría "CENTROS MÉDICOS" con esa especialidad (2-nov-2026: KINESIOLOGÍA Y
FISIATRÍA 573, PSICOLOGÍA 438). Los profesionales de la categoría
"PROFESIONALES" se cuentan con agregaciones del propio buscador (por localidad
y por plan), sin bajar nombres.

Uso:
  python especialidades.py descargar <carpeta_raw>
  python especialidades.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/sancor-salud-especialidades.json
"""
import json, os, re, sys
from datetime import date
import importlib.util

_dir = os.path.dirname(__file__)
_spec = importlib.util.spec_from_file_location('rubros', os.path.join(_dir, 'rubros.py'))
rubros = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(rubros)
sancor = rubros.sancor

# especialidad en el buscador → nombre en la web
ESPECIALIDADES = {'KINESIOLOGÍA Y FISIATRÍA': 'Kinesiología y Fisiatría', 'PSICOLOGÍA': 'Psicología'}
INDICE = 'prestadores_gestor_prod_cartilla_web'
# Centro con nombre de médico puntual ("Consultorio Dra. Pérez"): no se lista como centro
ES_PARTICULAR = re.compile(r'\b(dra?|lic|licenciad[oa])\.?\s', re.I)


def consulta(categoria, esp):
    return {'bool': {'must': [{'term': {'categorias.categoria.keyword': categoria}},
                              {'term': {'categorias.especialidades.especialidad.keyword': esp}}]}}


def descargar(raw):
    os.makedirs(raw, exist_ok=True)
    try:
        planes = sancor.post('planes_web', {'size': 500})
    except Exception:
        planes = rubros.planes_conocidos()
    json.dump(planes, open(os.path.join(raw, 'planes.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    for esp in ESPECIALIDADES:
        d = sancor.post(INDICE, {'size': 5000, 'query': consulta('CENTROS MÉDICOS', esp)})
        assert d['hits']['total'] == len(d['hits']['hits']), 'resultado truncado, subir size'
        json.dump(d, open(os.path.join(raw, f'centros__{sancor.clave(esp)}.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        # Profesionales: solo cantidades por localidad (y por plan), sin documentos
        a = sancor.post(INDICE, {'size': 0, 'query': consulta('PROFESIONALES', esp), 'aggs': {'loc': {
            'terms': {'field': 'domicilios.locprov_keyword', 'size': 5000},
            'aggs': {'plan': {'terms': {'field': 'planes.codigo_plan_contratado', 'size': 200}}}},
            # CABA y cada zona del GBA juntan varias localidades: el conteo por "provincia" (cada zona del GBA
            # es una provincia aparte en este buscador) cuenta cada profesional una sola vez por zona
            'prov': {'terms': {'field': 'domicilios.provincia_keyword', 'size': 100},
                     'aggs': {'plan': {'terms': {'field': 'planes.codigo_plan_contratado', 'size': 200}}}}}})
        json.dump(a, open(os.path.join(raw, f'profesionales__{sancor.clave(esp)}.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        print(esp, 'centros', d['hits']['total'], 'profesionales', a['hits']['total'], 'localidades', len(a['aggregations']['loc']['buckets']), flush=True)


def generar(raw, salida):
    nombres = {h['_source']['codigo']: h['_source']['descripcion'].replace('SANCOR ', '').strip()
               for h in json.load(open(os.path.join(raw, 'planes.json'), encoding='utf-8'))['hits']['hits']}
    ids = [nombres[c] for c in sancor.PLANES]
    zonas = {}

    def zona(dom):
        nombre_z, slug, provincias = sancor.zona_de(dom)
        if not slug:
            return None
        if slug in zonas and zonas[slug]['provincias'] != provincias:
            slug = f'{slug}-{sancor.clave(provincias[0])}'
        return zonas.setdefault(slug, {'slug': slug, 'nombre': nombre_z, 'provincias': provincias, 'especialidades': {}})

    for esp, nombre_esp in ESPECIALIDADES.items():
        # Centros (instituciones)
        for h in json.load(open(os.path.join(raw, f'centros__{sancor.clave(esp)}.json'), encoding='utf-8'))['hits']['hits']:
            src = h['_source']
            planes = [nombres[p['codigo_plan_contratado']] for p in src.get('planes') or [] if p['codigo_plan_contratado'] in sancor.PLANES]
            nom = sancor.nombre_centro(src['prestador'])
            if not planes or not nom or ES_PARTICULAR.search(nom + ' '):
                continue
            for dom in src.get('domicilios') or []:
                z = zona(dom)
                if z is None:
                    continue
                e = z['especialidades'].setdefault(nombre_esp, {'centros': {}, 'profesionales': 0, 'profesionalesPorPlan': {}})
                c = e['centros'].setdefault(sancor.clave(nom), {'nombre': nom, 'planes': [], 'notas': [], 'sedes': []})
                for p in planes:
                    if p not in c['planes']:
                        c['planes'].append(p)
                calle = ' '.join(x for x in [sancor.titulo(dom.get('calle')), str(dom.get('nro') or '').strip()] if x and x != '0') or None
                if not any(sancor.clave(s['direccion'] or '') == sancor.clave(calle or '') for s in c['sedes']):
                    loc = dom.get('location') or [None, None]
                    c['sedes'].append({'direccion': calle, 'localidad': None if z['slug'] == 'caba' else sancor.titulo(dom.get('localidad')) or None,
                                       'tel': sancor.telefono(dom), 'lat': loc[1] or None, 'lon': loc[0] or None, 'turnoDigital': False})
        # Profesionales: cantidad por zona y por plan. En el interior la zona es la localidad (cada
        # profesional cuenta una vez por localidad); CABA y las zonas del GBA juntan varias localidades,
        # así que ahí se usa el conteo por provincia del buscador (un documento = un profesional, una vez por zona)
        a = json.load(open(os.path.join(raw, f'profesionales__{sancor.clave(esp)}.json'), encoding='utf-8'))
        agrupadas = lambda prov: prov.startswith('CIUDAD AUTONOMA') or prov in sancor.ZONAS_GBA
        for b in a['aggregations']['prov']['buckets']:
            if not agrupadas(b['key']):
                continue
            z = zona({'provincia': b['key'], 'localidad': ''})
            e = z['especialidades'].setdefault(nombre_esp, {'centros': {}, 'profesionales': 0, 'profesionalesPorPlan': {}})
            e['profesionales'] = b['doc_count']
            for pb in b['plan']['buckets']:
                if pb['key'] in sancor.PLANES:
                    e['profesionalesPorPlan'][nombres[pb['key']]] = pb['doc_count']
        for b in a['aggregations']['loc']['buckets']:
            loca, _, prov = b['key'].partition('#')
            if agrupadas(prov):
                continue
            z = zona({'provincia': prov, 'localidad': loca})
            if z is None:
                continue
            e = z['especialidades'].setdefault(nombre_esp, {'centros': {}, 'profesionales': 0, 'profesionalesPorPlan': {}})
            e['profesionales'] += b['doc_count']
            for pb in b['plan']['buckets']:
                if pb['key'] in sancor.PLANES:
                    p = nombres[pb['key']]
                    e['profesionalesPorPlan'][p] = e['profesionalesPorPlan'].get(p, 0) + pb['doc_count']

    salida_zonas = []
    for z in zonas.values():
        esps = {}
        for nombre_esp, e in z['especialidades'].items():
            centros = list(e['centros'].values())
            for c in centros:
                c['planes'] = [p for p in ids if p in c['planes']]
            centros.sort(key=lambda c: sancor.clave(c['nombre']))
            esps[nombre_esp] = {'centros': centros, 'profesionales': e['profesionales'], 'profesionalesPorPlan': e['profesionalesPorPlan']}
        salida_zonas.append({'slug': z['slug'], 'nombre': z['nombre'], 'provincias': z['provincias'], 'especialidades': esps})
    out = {'fuente': 'Buscador oficial de cartilla de Sancor Salud (sancorsalud.com.ar/cartilla-nosoyasociado)',
           'vigencia': [date.today().strftime('%d/%m/%Y')], 'planes': ids,
           'especialidades': list(ESPECIALIDADES.values()), 'zonas': salida_zonas}
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(e['centros']) for z in salida_zonas for e in z['especialidades'].values()), 'centros')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
