"""Farmacias de Avalian por zona — clase "1" del mismo buscador
(avalian.com/xhr/cartilla.php). Solo instituciones: a diferencia de "Servicio
de Guardia" (clase 7, que mezcla médicos particulares), la clase 1 son
comercios habilitados sin nombres de persona.

Uso:
  python farmacias.py descargar <carpeta_raw>
  python farmacias.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/avalian-farmacias.json
"""
import json, os, sys, time, unicodedata, re
from datetime import date
import importlib.util

_spec = importlib.util.spec_from_file_location('scrape', os.path.join(os.path.dirname(__file__), 'scrape.py'))
scrape = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(scrape)

_specg = importlib.util.spec_from_file_location('generar', os.path.join(os.path.dirname(__file__), 'generar.py'))
generar_mod = importlib.util.module_from_spec(_specg)
_specg.loader.exec_module(generar_mod)

CLASE = '1'


def descargar(out):
    os.makedirs(out, exist_ok=True)
    scrape.opener.open('https://avalian.com/cartilla', timeout=60).read()
    objetivos = [(z, '') for z in scrape.ZONAS_GBA]
    no_match = []
    for prov, ciudades in scrape.CIUDADES.items():
        locs = scrape.post({'accion': 'localidades', 'provincia': prov, 'filter': 'prestador'})['msg']['localidades']
        nombres = {scrape.norm(l['nombre']): l['nombre'] for l in locs}
        for c in ciudades:
            if scrape.norm(c) in nombres:
                objetivos.append((prov, nombres[scrape.norm(c)]))
            else:
                no_match.append(f'{prov}:{c}')
        time.sleep(1)
    print('objetivos', len(objetivos), 'sin match', no_match, flush=True)

    for prov, loc in objetivos:
        for cred in scrape.CREDENCIALES:
            f = os.path.join(out, f"{prov}__{scrape.norm(loc).replace(' ', '_') or 'ZONA'}__{cred}__{CLASE}.json")
            if os.path.exists(f):
                continue
            d = scrape.post({'accion': 'cartilla', 'credencial': cred, 'clase': CLASE, 'especialidad': '',
                              'tipo_busqueda': 'localidad', 'cercania_latitud': '', 'cercania_longitud': '',
                              'provincia': prov, 'localidad': loc, 'profesional': ''})
            for espera in (30, 60, 120):
                if isinstance(d.get('msg'), dict) and isinstance(d['msg'].get('cartilla'), list):
                    break
                print('  throttle, espero', espera, prov, loc, cred, flush=True)
                time.sleep(espera)
                d = scrape.post({'accion': 'cartilla', 'credencial': cred, 'clase': CLASE, 'especialidad': '',
                                  'tipo_busqueda': 'localidad', 'cercania_latitud': '', 'cercania_longitud': '',
                                  'provincia': prov, 'localidad': loc, 'profesional': ''})
            if not (isinstance(d.get('msg'), dict) and isinstance(d['msg'].get('cartilla'), list)):
                print('  respuesta rara', prov, loc, cred, str(d)[:200], flush=True)
                time.sleep(1.5)
                continue
            json.dump({'provincia': prov, 'localidad': loc, 'credencial': cred, 'cartilla': d['msg']['cartilla']},
                       open(f, 'w', encoding='utf-8'), ensure_ascii=False)
            print(prov, loc or '-', cred, len(d['msg']['cartilla']), flush=True)
            time.sleep(3)
    print('FIN', flush=True)


def generar(raw, salida):
    import glob
    zonas = {}
    for f in sorted(glob.glob(os.path.join(raw, '*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        prov, loc, plan = d['provincia'], d['localidad'], generar_mod.PLANES[d['credencial']]
        if prov in generar_mod.ZONAS_GBA:
            nombre, slug = generar_mod.ZONAS_GBA[prov]
            provincias = ['Buenos Aires']
        else:
            nombre = generar_mod.titulo(loc)
            slug = 'caba' if prov == 'C' else generar_mod.clave(nombre)
            provincias = [generar_mod.PROVINCIAS[prov]]
        if slug in zonas and zonas[slug]['provincias'] != provincias:
            slug = f'{slug}-{generar_mod.clave(provincias[0])}'
        z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre, 'provincias': provincias, 'centros': {}})
        for row in d['cartilla']:
            nom = generar_mod.nombre_centro(row.get('nombre'))
            if not nom:
                continue
            dire = generar_mod.limpio(row.get('domicilio'))
            ck = generar_mod.clave(f'{nom}-{dire or ""}')
            c = z['centros'].setdefault(ck, {'nombre': nom, 'planes': [], 'notas': [], 'sedes': []})
            if plan not in c['planes']:
                c['planes'].append(plan)
            if not any(generar_mod.clave(s['direccion'] or '') == generar_mod.clave(dire or '') for s in c['sedes']):
                try:
                    lat = float(row['latitud']) if row.get('latitud') else None
                    lon = float(row['longitud']) if row.get('longitud') else None
                except (TypeError, ValueError):
                    lat = lon = None
                c['sedes'].append({'direccion': dire, 'localidad': generar_mod.titulo(row.get('localidad')) or None,
                                    'tel': generar_mod.limpio(row.get('telefono')), 'lat': lat, 'lon': lon, 'turnoDigital': False})
    salida_zonas = []
    for z in zonas.values():
        centros = list(z['centros'].values())
        for c in centros:
            c['planes'] = [p for p in generar_mod.ORDEN_PLANES if p in c['planes']]
        centros.sort(key=lambda c: generar_mod.clave(c['nombre']))
        salida_zonas.append({**z, 'centros': centros})
    out = {'fuente': 'Buscador oficial de cartilla de Avalian (avalian.com/cartilla)',
           'vigencia': [date.today().strftime('%d/%m/%Y')], 'planes': generar_mod.ORDEN_PLANES, 'zonas': salida_zonas}
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'farmacias')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
