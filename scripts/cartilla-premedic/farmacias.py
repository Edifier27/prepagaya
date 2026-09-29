"""Farmacias de Premedic por zona — prestación "90" del mismo buscador
(afiliados.grupopremedic.com.ar/api/proxy). Solo instituciones (comercios).

Uso:
  python farmacias.py descargar <carpeta_raw>
  python farmacias.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/premedic-farmacias.json
"""
import json, os, re, sys, time
from datetime import date
import importlib.util

_spec = importlib.util.spec_from_file_location('premedic', os.path.join(os.path.dirname(__file__), 'premedic.py'))
premedic = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(premedic)

PRESTACION = '90'


def descargar(raw):
    os.makedirs(raw, exist_ok=True)
    for loc in premedic.LOCALIDADES:
        for plan in premedic.PLANES:
            f = os.path.join(raw, f'{loc}_{plan}_{PRESTACION}.json')
            if os.path.exists(f) and os.path.getsize(f) > 0:
                continue
            req = premedic.urllib.request.Request(premedic.API.format(loc=loc, plan=plan, pr=PRESTACION), headers={'User-Agent': 'Mozilla/5.0'})
            with premedic.urllib.request.urlopen(req, timeout=60) as r:
                open(f, 'wb').write(r.read())
            print(loc, plan, flush=True)
            time.sleep(1.5)


def generar(raw, salida):
    zonas = {}
    for loc, (nombre, slug, provincias) in premedic.LOCALIDADES.items():
        z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre, 'provincias': provincias, 'centros': {}})
        for pcod, plan in premedic.PLANES.items():
            f = os.path.join(raw, f'{loc}_{pcod}_{PRESTACION}.json')
            if not os.path.exists(f):
                raise SystemExit(f'falta {f}')
            filas = json.load(open(f, encoding='utf-8'))
            for row in filas:
                nom = premedic.limpio(row.get('prestador'))
                if not nom:
                    continue
                dire = premedic.limpiar_domicilio(row.get('domicilio'))
                ck = premedic.clave(f'{nom}-{dire or ""}')
                c = z['centros'].setdefault(ck, {'nombre': nom, 'planes': [], 'notas': [], 'sedes': []})
                if plan not in c['planes']:
                    c['planes'].append(plan)
                if not any(premedic.clave(s['direccion'] or '') == premedic.clave(dire or '') for s in c['sedes']):
                    lat = lon = None
                    geo = row.get('geo') or ''
                    partes = geo.split(',')
                    if len(partes) >= 2:
                        try:
                            lat, lon = float(partes[0]), float(partes[1])
                        except ValueError:
                            lat = lon = None
                    c['sedes'].append({'direccion': dire, 'localidad': None, 'tel': premedic.limpio(row.get('teléfono')),
                                        'lat': lat, 'lon': lon, 'turnoDigital': False})
    salida_zonas = []
    for z in zonas.values():
        centros = list(z['centros'].values())
        for c in centros:
            c['planes'] = [p for p in premedic.ORDEN_PLANES if p in c['planes']]
        centros.sort(key=lambda c: premedic.clave(c['nombre']))
        salida_zonas.append({**z, 'centros': centros})
    out = {
        'fuente': 'Buscador oficial de cartilla de Premedic (web.grupopremedic.com.ar/cartilla-medica)',
        'vigencia': [date.today().strftime('%d/%m/%Y')],
        'planes': [p for p in premedic.ORDEN_PLANES if any(p in c['planes'] for z in salida_zonas for c in z['centros'])],
        'zonas': salida_zonas,
    }
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'farmacias')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
