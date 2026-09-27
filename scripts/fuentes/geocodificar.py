"""Ubica en el mapa las sedes de las cartillas (decimotercera pasada, 27-sep-2026).

Para la herramienta "¿Dónde me atiendo?" (guardias y sanatorios cerca tuyo)
hace falta la latitud y longitud de cada sede. Las cartillas oficiales traen
la dirección, no las coordenadas. Se buscan con Georef, el servicio oficial de
normalización de direcciones del Estado (apis.datos.gob.ar/georef), que la red
de desarrollo no alcanza y esta Action sí.

Por cada sede se prueba, en orden:
  1. la dirección (calle y altura) en su provincia y localidad;
  2. si no aparece, el centro de la localidad (queda marcado como aproximado).

Imprime una línea por sede: GEO|{"k": clave, "lat", "lon", "m": "d" o "l", "loc"}
La clave es "direccion|localidad|provincia" tal cual la cartilla, para
cruzarla después en el build. No guarda nada en el repo: el resultado se copia
del log a lib/data/cartilla-zonas/coordenadas.json.
"""
import json
import re
import sys
import urllib.request

GEOREF = 'https://apis.datos.gob.ar/georef/api/'
PREPAGAS = ['swiss-medical', 'osde', 'premedic', 'avalian', 'sancor-salud']
# Códigos INDEC de provincia (los usa Georef)
PROV = {
    'Ciudad de Buenos Aires': '02', 'Buenos Aires': '06', 'Catamarca': '10', 'Córdoba': '14', 'Corrientes': '18',
    'Chaco': '22', 'Chubut': '26', 'Entre Ríos': '30', 'Formosa': '34', 'Jujuy': '38', 'La Pampa': '42',
    'La Rioja': '46', 'Mendoza': '50', 'Misiones': '54', 'Neuquén': '58', 'Río Negro': '62', 'Salta': '66',
    'San Juan': '70', 'San Luis': '74', 'Santa Cruz': '78', 'Santa Fe': '82', 'Santiago del Estero': '86',
    'Tucumán': '90', 'Tierra del Fuego': '94',
}
LOTE = 500


def post(endpoint, cuerpo):
    datos = json.dumps(cuerpo).encode()
    req = urllib.request.Request(GEOREF + endpoint, data=datos, headers={'Content-Type': 'application/json', 'User-Agent': 'prepagaya-fuentes/1.0'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode())


def limpiar_loc(s):
    if not s:
        return None
    s = re.sub(r'\s+y alrededores$', '', s.strip(), flags=re.I)
    s = re.sub(r'\s+capital$', '', s, flags=re.I)
    s = re.sub(r'^(gba|capital federal|ciudad de buenos aires|caba)\b.*$', '', s, flags=re.I).strip()
    return s or None


def partir(direccion):
    """'Av Cnel Diaz 2423 Palermo' -> ('Av Cnel Diaz 2423', ['Palermo'])"""
    d = re.sub(r'\s+', ' ', direccion or '').strip()
    m = re.match(r'^(.+?\s)(\d{1,5})(?=\b|$)(.*)$', d)
    if not m:
        return d, []
    resto = [p.strip() for p in re.split(r',', m.group(3)) if p.strip()]
    return (m.group(1) + m.group(2)).strip(), resto


def sedes():
    vistas = {}
    for p in PREPAGAS:
        with open(f'lib/data/cartilla-zonas/{p}.json', encoding='utf-8') as f:
            data = json.load(f)
        for z in data['zonas']:
            provs = z.get('provincias') or []
            for c in z['centros']:
                for s in c['sedes']:
                    if not s.get('direccion'):
                        continue
                    clave = f"{s['direccion']}|{s.get('localidad') or ''}|{provs[0] if provs else ''}"
                    if clave in vistas:
                        continue
                    calle, resto = partir(s['direccion'])
                    pistas = []
                    for h in [s.get('localidad'), *reversed(resto), *resto, z['nombre']]:
                        h = limpiar_loc(h)
                        if h and h not in pistas:
                            pistas.append(h)
                    vistas[clave] = {'calle': calle, 'pistas': pistas, 'provs': [PROV[x] for x in provs if x in PROV]}
    return vistas


def resolver(intentos):
    """intentos: lista de (clave, consulta). Devuelve {clave: resultado} con el primero que ubica."""
    res = {}
    for i in range(0, len(intentos), LOTE):
        lote = intentos[i:i + LOTE]
        try:
            r = post('direcciones', {'direcciones': [q for _, q in lote]})
        except Exception as e:  # noqa: BLE001
            print(f'!! lote {i}: {e}')
            continue
        for (clave, _), rr in zip(lote, r.get('resultados', [])):
            if clave in res:
                continue
            for d in rr.get('direcciones') or []:
                u = d.get('ubicacion') or {}
                if u.get('lat') is not None and u.get('lon') is not None:
                    loc = (d.get('localidad_censal') or {}).get('nombre') or (d.get('departamento') or {}).get('nombre')
                    res[clave] = {'lat': round(u['lat'], 5), 'lon': round(u['lon'], 5), 'm': 'd', 'loc': loc}
                    break
    return res


def distancia_km(a, b):
    import math
    r = math.pi / 180
    h = math.sin((b[0] - a[0]) * r / 2) ** 2 + math.cos(a[0] * r) * math.cos(b[0] * r) * math.sin((b[1] - a[1]) * r / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(h))


NOMBRE_PROV = {v: k for k, v in PROV.items()}
NOMBRE_PROV['02'] = 'Ciudad Autónoma de Buenos Aires'


def nominatim(params):
    import time
    import urllib.parse
    time.sleep(1.1)
    url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({**params, 'format': 'jsonv2', 'limit': 3, 'countrycodes': 'ar'})
    req = urllib.request.Request(url, headers={'User-Agent': 'prepagaya.com.ar/1.0 (https://www.prepagaya.com.ar; carga unica de cartillas)'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def osm(todas, res):
    pendientes = [(c, s) for c, s in todas.items() if (c not in res or res[c]['m'] == 'l') and s['provs']]
    print(f'OSM: {len(pendientes)} para buscar')
    ok = 0
    for n, (clave, s) in enumerate(pendientes):
        centro = (res[clave]['lat'], res[clave]['lon']) if clave in res else None
        prov = NOMBRE_PROV.get(s['provs'][0], '')
        ciudad = s['pistas'][0] if s['pistas'] else ''
        intentos = [{'street': s['calle'], 'city': ciudad, 'state': prov}] if ciudad else []
        intentos.append({'q': ', '.join(x for x in (s['calle'], ciudad, prov, 'Argentina') if x)})
        for q in intentos:
            try:
                r = nominatim(q)
            except Exception as e:  # noqa: BLE001
                print(f'!! osm {clave}: {e}')
                break
            elegido = None
            for x in r:
                lat, lon = float(x['lat']), float(x['lon'])
                if centro and distancia_km(centro, (lat, lon)) > 15:
                    continue
                casa = x.get('addresstype') in ('building', 'house', 'amenity') or x.get('type') in ('house', 'hospital', 'clinic', 'doctors') or x.get('category') in ('building', 'amenity')
                calle = x.get('category') == 'highway' or x.get('addresstype') == 'road'
                if casa or (calle and centro):
                    elegido = {'lat': round(lat, 5), 'lon': round(lon, 5), 'm': 'o' if casa else 'c', 'loc': ciudad}
                    break
            if elegido:
                res[clave] = elegido
                ok += 1
                break
        if n % 100 == 0:
            print(f'OSM {n}/{len(pendientes)}: {ok} ubicadas', flush=True)
    print(f'OSM: {ok} mejoradas')


def main():
    todas = sedes()
    print(f'Sedes únicas: {len(todas)}')
    # Prueba chica para ver la forma de la respuesta
    try:
        print('PRUEBA', json.dumps(post('direcciones', {'direcciones': [{'direccion': 'Av Pueyrredon 1461', 'provincia': '02', 'max': 1}]}), ensure_ascii=False)[:1500])
    except Exception as e:  # noqa: BLE001
        print(f'!! prueba: {e}')

    # Ronda 1: dirección con cada pista de localidad (CABA: solo provincia)
    intentos = []
    for clave, s in todas.items():
        for prov in s['provs'] or [None]:
            base = {'direccion': s['calle'], 'max': 1}
            if prov:
                base['provincia'] = prov
            if prov == '02' or not s['pistas']:
                intentos.append((clave, base))
                continue
            for h in s['pistas']:
                intentos.append((clave, {**base, 'localidad_censal': h}))
                intentos.append((clave, {**base, 'departamento': h}))
    print(f'Intentos de dirección: {len(intentos)}')
    res = resolver(intentos)
    print(f'Ubicadas por dirección: {len(res)}')

    # Ronda 2: centro de la localidad para las que faltan
    faltan = [(c, s) for c, s in todas.items() if c not in res]
    consultas = []
    for clave, s in faltan:
        for prov in s['provs'] or [None]:
            for h in s['pistas'] or []:
                q = {'nombre': h, 'max': 1}
                if prov:
                    q['provincia'] = prov
                consultas.append((clave, q))
    for i in range(0, len(consultas), LOTE):
        lote = consultas[i:i + LOTE]
        try:
            r = post('localidades', {'localidades': [q for _, q in lote]})
        except Exception as e:  # noqa: BLE001
            print(f'!! localidades {i}: {e}')
            continue
        for (clave, _), rr in zip(lote, r.get('resultados', [])):
            if clave in res:
                continue
            for l in rr.get('localidades') or []:
                u = l.get('centroide') or {}
                if u.get('lat') is not None:
                    res[clave] = {'lat': round(u['lat'], 5), 'lon': round(u['lon'], 5), 'm': 'l', 'loc': l.get('nombre')}
                    break
    print(f'Ubicadas en total: {len(res)} de {len(todas)}')

    # Ronda 3 (14.a pasada): la dirección en toda la provincia, quedándose con
    # el resultado más cercano al centro de la localidad (hasta 12 km).
    aprox = [(c, s) for c, s in todas.items() if c in res and res[c]['m'] == 'l' and s['provs']]
    consultas = [(c, {'direccion': s['calle'], 'provincia': s['provs'][0], 'max': 10}) for c, s in aprox]
    mejoradas = 0
    for i in range(0, len(consultas), LOTE):
        lote = consultas[i:i + LOTE]
        try:
            r = post('direcciones', {'direcciones': [q for _, q in lote]})
        except Exception as e:  # noqa: BLE001
            print(f'!! provincia {i}: {e}')
            continue
        for (clave, _), rr in zip(lote, r.get('resultados', [])):
            centro = (res[clave]['lat'], res[clave]['lon'])
            mejor = None
            for d in rr.get('direcciones') or []:
                u = d.get('ubicacion') or {}
                if u.get('lat') is None:
                    continue
                km = distancia_km(centro, (u['lat'], u['lon']))
                if km <= 12 and (mejor is None or km < mejor[0]):
                    mejor = (km, u, (d.get('localidad_censal') or {}).get('nombre'))
            if mejor:
                res[clave] = {'lat': round(mejor[1]['lat'], 5), 'lon': round(mejor[1]['lon'], 5), 'm': 'd', 'loc': mejor[2]}
                mejoradas += 1
    print(f'Ronda 3 (provincia, cerca de la localidad): {mejoradas} mejoradas')

    # Ronda 4: OpenStreetMap (Nominatim) para las que siguen aproximadas o sin
    # ubicar, una consulta por segundo (política de uso de Nominatim).
    osm(todas, res)
    for clave in todas:
        if clave in res:
            print('GEO|' + json.dumps({'k': clave, **res[clave]}, ensure_ascii=False))
        else:
            print('SIN|' + clave)


if __name__ == '__main__':
    sys.exit(main())
