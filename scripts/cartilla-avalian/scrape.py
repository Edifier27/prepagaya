"""Scrapea la cartilla pública de Avalian (avalian.com/cartilla → xhr/cartilla.php).

Solo instituciones: clase 8 (Servicio de Internación) y 7 (Servicio de Guardia),
para cada credencial (nivel de cartilla) y cada zona/ciudad de CIUDADES.
Uso: python scrape.py <carpeta_salida>
"""
import json, os, sys, time, unicodedata, re
import urllib.request, urllib.parse, http.cookiejar

URL = 'https://avalian.com/xhr/cartilla.php'
CREDENCIALES = ['CERCA', 'INTEGRAL', 'SUPERIOR', 'SELECTA', 'CLASICA']
CLASES = {'8': 'internacion', '7': 'guardia'}
ZONAS_GBA = ['GBA_N', 'GBA_O', 'GBA_SE', 'GBA_SO']

# Capitales de provincia y ciudades grandes (geografía pública). Se matchean
# contra el listado de localidades que devuelve el propio buscador de Avalian.
CIUDADES = {
    'C': ['CAPITAL FEDERAL'],
    'B': ['LA PLATA', 'MAR DEL PLATA', 'BAHIA BLANCA', 'TANDIL', 'OLAVARRIA', 'JUNIN', 'PERGAMINO', 'AZUL',
          'NECOCHEA', 'SAN NICOLAS DE LOS ARROYOS', 'ZARATE', 'CAMPANA', 'LUJAN', 'CHIVILCOY', 'MERCEDES', 'TRES ARROYOS'],
    'X': ['CORDOBA', 'RIO CUARTO', 'VILLA MARIA', 'SAN FRANCISCO', 'VILLA CARLOS PAZ', 'ALTA GRACIA',
          'RIO TERCERO', 'BELL VILLE', 'JESUS MARIA'],
    'S': ['ROSARIO', 'SANTA FE', 'RAFAELA', 'VENADO TUERTO', 'RECONQUISTA', 'VILLA GOBERNADOR GALVEZ',
          'SAN LORENZO', 'ESPERANZA'],
    'M': ['MENDOZA', 'GODOY CRUZ', 'GUAYMALLEN', 'LAS HERAS', 'MAIPU', 'LUJAN', 'SAN RAFAEL', 'LIBERTADOR GENERAL SAN MARTIN'],
    'T': ['SAN MIGUEL DE TUCUMAN', 'YERBA BUENA', 'BANDA DEL RIO SALI', 'CONCEPCION', 'TAFI VIEJO'],
    'A': ['SALTA', 'SAN RAMON DE LA NUEVA ORAN', 'TARTAGAL'],
    'Y': ['SAN SALVADOR DE JUJUY', 'PALPALA', 'SAN PEDRO'],
    'E': ['PARANA', 'CONCORDIA', 'GUALEGUAYCHU', 'CONCEPCION DEL URUGUAY'],
    'N': ['POSADAS (EXTENSION)', 'OBERA', 'ELDORADO'],
    'W': ['CORRIENTES', 'GOYA'],
    'H': ['RESISTENCIA', 'BARRANQUERAS', 'PRESIDENCIA ROQUE SAENZ PEÑA'],
    'P': ['FORMOSA'],
    'Q': ['NEUQUEN', 'CUTRAL CO', 'PLOTTIER', 'ZAPALA'],
    'R': ['GENERAL ROCA', 'CIPOLLETTI', 'SAN CARLOS DE BARILOCHE', 'VIEDMA'],
    'U': ['COMODORO RIVADAVIA', 'TRELEW', 'RAWSON', 'PUERTO MADRYN', 'ESQUEL'],
    'Z': ['RIO GALLEGOS', 'CALETA OLIVIA'],
    'V': ['RIO GRANDE', 'USHUAIA'],
    'L': ['SANTA ROSA', 'GENERAL PICO'],
    'D': ['SAN LUIS', 'VILLA MERCEDES'],
    'J': ['SAN JUAN', 'RIVADAVIA', 'CHIMBAS', 'SANTA LUCIA', 'RAWSON'],
    'F': ['LA RIOJA', 'CHILECITO'],
    'K': ['S. F. DEL VALLE DE CATAMARCA'],
    'G': ['SANTIAGO DEL ESTERO', 'LA BANDA', 'TERMAS DE RIO HONDO'],
}

jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.addheaders = [('X-Requested-With', 'XMLHttpRequest'), ('Referer', 'https://avalian.com/cartilla'),
                     ('User-Agent', 'Mozilla/5.0')]


def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'\s+', ' ', s.upper()).strip()


def post(data):
    for intento in range(4):
        try:
            with opener.open(URL, urllib.parse.urlencode(data).encode(), timeout=90) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:
            print('  reintento', intento, e, flush=True)
            time.sleep(10 * (intento + 1))
    raise RuntimeError(f'fallo {data}')


def main(out):
    os.makedirs(out, exist_ok=True)
    opener.open('https://avalian.com/cartilla', timeout=60).read()
    objetivos = [(z, '') for z in ZONAS_GBA]
    no_match = []
    for prov, ciudades in CIUDADES.items():
        locs = post({'accion': 'localidades', 'provincia': prov, 'filter': 'prestador'})['msg']['localidades']
        nombres = {norm(l['nombre']): l['nombre'] for l in locs}
        for c in ciudades:
            if norm(c) in nombres:
                objetivos.append((prov, nombres[norm(c)]))
            else:
                no_match.append(f'{prov}:{c}')
        time.sleep(1)
    print('objetivos', len(objetivos), 'sin match', no_match, flush=True)
    json.dump({'objetivos': objetivos, 'sin_match': no_match}, open(os.path.join(out, '_objetivos.json'), 'w', encoding='utf-8'), ensure_ascii=False)

    for prov, loc in objetivos:
        for cred in CREDENCIALES:
            for clase in CLASES:
                f = os.path.join(out, f"{prov}__{norm(loc).replace(' ', '_') or 'ZONA'}__{cred}__{clase}.json")
                if os.path.exists(f):
                    continue
                d = post({'accion': 'cartilla', 'credencial': cred, 'clase': clase, 'especialidad': '',
                          'tipo_busqueda': 'localidad', 'cercania_latitud': '', 'cercania_longitud': '',
                          'provincia': prov, 'localidad': loc, 'profesional': ''})
                # 429 "Too Many Attempts" llega con success y msg.cartilla = {error...}:
                # esperar y reintentar en vez de guardarlo como si fuera una respuesta.
                for espera in (30, 60, 120):
                    if isinstance(d.get('msg'), dict) and isinstance(d['msg'].get('cartilla'), list):
                        break
                    print('  throttle, espero', espera, prov, loc, cred, clase, flush=True)
                    time.sleep(espera)
                    d = post({'accion': 'cartilla', 'credencial': cred, 'clase': clase, 'especialidad': '',
                              'tipo_busqueda': 'localidad', 'cercania_latitud': '', 'cercania_longitud': '',
                              'provincia': prov, 'localidad': loc, 'profesional': ''})
                if not (isinstance(d.get('msg'), dict) and isinstance(d['msg'].get('cartilla'), list)):
                    print('  respuesta rara', prov, loc, cred, clase, str(d)[:200], flush=True)
                    time.sleep(1.5)
                    continue
                json.dump({'provincia': prov, 'localidad': loc, 'credencial': cred, 'clase': CLASES[clase],
                           'cartilla': d['msg']['cartilla']}, open(f, 'w', encoding='utf-8'), ensure_ascii=False)
                print(prov, loc or '-', cred, clase, len(d['msg']['cartilla']), flush=True)
                time.sleep(3)
    print('FIN', flush=True)


if __name__ == '__main__':
    main(sys.argv[1])
