"""Farmacias de Sancor Salud por zona — categoría "FARMACIAS" del mismo
buscador (busquedas.sancorsalud.com.ar). Solo instituciones: la categoría
completa son comercios habilitados, sin médicos particulares mezclados.

A diferencia de sancor.py (sanatorios/guardias), acá NO se toma "la dirección
principal": cada documento de farmacia ya es una sucursal puntual (nombre +
dirección específicos, ej. "Farmacity Cabildo" vs "Farmacity Elcano"), así que
tomar solo la más repetida perdería sucursales reales.

Uso:
  python farmacias.py descargar <carpeta_raw>
  python farmacias.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/sancor-salud-farmacias.json
"""
import json, os, sys
from datetime import date
import importlib.util

_spec = importlib.util.spec_from_file_location('sancor', os.path.join(os.path.dirname(__file__), 'sancor.py'))
sancor = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sancor)


def descargar(raw):
    os.makedirs(raw, exist_ok=True)
    d = sancor.post('prestadores_gestor_prod_cartilla_web', {'size': 8000, 'query': {'term': {'categorias.categoria.keyword': 'FARMACIAS'}}})
    assert d['hits']['total'] == len(d['hits']['hits']), 'resultado truncado, subir size'
    json.dump(d, open(os.path.join(raw, 'farmacias.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('FARMACIAS', d['hits']['total'], flush=True)
    d2 = sancor.post('planes_web', {'size': 500})
    json.dump(d2, open(os.path.join(raw, 'planes.json'), 'w', encoding='utf-8'), ensure_ascii=False)


def generar(raw, salida):
    nombres = {h['_source']['codigo']: h['_source']['descripcion'].replace('SANCOR ', '').strip()
               for h in json.load(open(os.path.join(raw, 'planes.json'), encoding='utf-8'))['hits']['hits']}
    ids = [nombres[c] for c in sancor.PLANES]
    zonas = {}
    for h in json.load(open(os.path.join(raw, 'farmacias.json'), encoding='utf-8'))['hits']['hits']:
        src = h['_source']
        planes = [nombres[p['codigo_plan_contratado']] for p in src.get('planes') or [] if p['codigo_plan_contratado'] in sancor.PLANES]
        if not planes:
            continue
        nom = sancor.nombre_centro(src['prestador'])
        for dom in src.get('domicilios') or []:
            nombre_z, slug, provincias = sancor.zona_de(dom)
            if not slug:
                continue
            if slug in zonas and zonas[slug]['provincias'] != provincias:
                slug = f'{slug}-{sancor.clave(provincias[0])}'
            z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre_z, 'provincias': provincias, 'centros': {}})
            calle = ' '.join(x for x in [sancor.titulo(dom.get('calle')), str(dom.get('nro') or '').strip()] if x and x != '0') or None
            ck = sancor.clave(f'{nom}-{calle or ""}')
            c = z['centros'].setdefault(ck, {'nombre': nom, 'planes': [], 'notas': [], 'sedes': []})
            for p in planes:
                if p not in c['planes']:
                    c['planes'].append(p)
            if not any(sancor.clave(s['direccion'] or '') == sancor.clave(calle or '') for s in c['sedes']):
                loc = dom.get('location') or [None, None]
                # (0, 0) es el placeholder de "sin geocodificar" del buscador, no una
                # ubicación real (caería en el golfo de Guinea).
                lat = loc[1] if loc[1] else None
                lon = loc[0] if loc[0] else None
                loca = None if slug == 'caba' else sancor.titulo(dom.get('localidad')) or None
                c['sedes'].append({'direccion': calle, 'localidad': loca, 'tel': sancor.telefono(dom),
                                    'lat': lat, 'lon': lon, 'turnoDigital': False})
    salida_zonas = []
    for z in zonas.values():
        centros = list(z['centros'].values())
        for c in centros:
            c['planes'] = [p for p in ids if p in c['planes']]
        centros.sort(key=lambda c: sancor.clave(c['nombre']))
        salida_zonas.append({**z, 'centros': centros})
    out = {'fuente': 'Buscador oficial de cartilla de Sancor Salud (sancorsalud.com.ar/cartilla-nosoyasociado)',
           'vigencia': [date.today().strftime('%d/%m/%Y')], 'planes': ids, 'zonas': salida_zonas}
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'farmacias')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
