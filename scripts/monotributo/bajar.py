"""Obras sociales que aceptan monotributistas y aporte de obra social por categoría.

- SSSalud: "Agentes del Seguro que aceptan Monotributistas"
  (sssalud.gob.ar/?page=listRnosc&tipo=3): código RNAS, nombre, sede,
  teléfono y si está habilitada para opciones.
- ARCA: cuadro de categorías del monotributo, con el aporte al Sistema
  Nacional del Seguro de Salud (obra social) de cada categoría.

Guarda lib/data/monotributo.json. Si una fuente falla o trae menos de lo
esperado, conserva lo que había. La red de los entornos de desarrollo no
llega a esos sitios; esta Action sí.
"""
import datetime
import html
import json
import os
import re
import sys
import urllib.request
from html.parser import HTMLParser

SALIDA = 'lib/data/monotributo.json'
FUENTE_OS = 'https://www.sssalud.gob.ar/?page=listRnosc&tipo=3'
FUENTES_ARCA = [
    'https://www.arca.gob.ar/monotributo/categorias.asp',
    'https://www.afip.gob.ar/monotributo/categorias.asp',
]
MINIMO_OS = 20


class Tablas(HTMLParser):
    """Junta las tablas como listas de filas de celdas (texto)."""

    def __init__(self):
        super().__init__()
        self.tablas, self._t, self._f, self._c = [], None, None, None
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'table':
            self._t = []
        elif tag == 'tr' and self._t is not None:
            self._f = []
        elif tag in ('td', 'th') and self._f is not None:
            self._c = []
        elif tag == 'br' and self._c is not None:
            self._c.append(' | ')
        elif tag == 'a':
            h = dict(attrs).get('href')
            if h:
                self.links.append(h)

    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self._c is not None and self._f is not None:
            self._f.append(re.sub(r'\s+', ' ', html.unescape(''.join(self._c))).strip())
            self._c = None
        elif tag == 'tr' and self._f is not None and self._t is not None:
            if self._f:
                self._t.append(self._f)
            self._f = None
        elif tag == 'table' and self._t is not None:
            self.tablas.append(self._t)
            self._t = None

    def handle_data(self, data):
        if self._c is not None:
            self._c.append(data)


def bajar(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; prepagaya-datos/1.0)', 'Accept-Language': 'es-AR,es'})
    with urllib.request.urlopen(req, timeout=40) as r:
        crudo = r.read()
        cs = r.headers.get_content_charset() or ('iso-8859-1' if b'charset=iso-8859-1' in crudo[:3000].lower() else 'utf-8')
        return crudo.decode(cs, errors='replace')


def partir(celda):
    return [x.strip() for x in celda.split('|')]


def obras_sociales():
    cuerpo = bajar(FUENTE_OS)
    p = Tablas()
    p.feed(cuerpo)
    print(f'SSSalud: {len(p.tablas)} tablas; links de interés:', [l for l in p.links if re.search(r'excel|xls|csv|pag', l, re.I)][:10])
    filas = [f for t in p.tablas for f in t if f and re.match(r'^\d-\d{4}-\d$', f[0])]
    out = []
    for f in filas:
        sede = partir(f[2]) if len(f) > 2 else ['']
        tel = partir(f[3]) if len(f) > 3 else ['']
        linea = tel[1] if len(tel) > 1 else ''
        out.append({
            'codigo': f[0],
            'nombre': f[1] if len(f) > 1 else '',
            'domicilio': sede[0],
            'localidad': re.sub(r'\s*-\s*.*$', '', sede[1]) if len(sede) > 1 else '',
            'telefono': tel[0],
            'lineaGratuita': '' if re.search(r'sin l', linea, re.I) else linea,
            'habilitadaOpciones': (f[4].strip().upper() == 'SI') if len(f) > 4 else None,
        })
    print(f'SSSalud: {len(out)} obras sociales que aceptan monotributistas')
    for x in out[:3] + out[-3:]:
        print('  ', x)
    texto = re.sub(r'<[^>]+>', ' ', cuerpo)
    print('¿Paginado?', len(re.findall(r'[Ss]iguiente|[Pp]ágina \d|pagina=', cuerpo)), '| total en el texto:', re.findall(r'(?:[Tt]otal|[Cc]antidad)[^\n]{0,60}', texto)[:3])
    if not out:
        print('HTML (inicio):', cuerpo[:3000])
    return out


def categorias():
    for url in FUENTES_ARCA:
        try:
            cuerpo = bajar(url)
        except Exception as e:  # noqa: BLE001
            print(f'ARCA {url}: {e}')
            continue
        p = Tablas()
        p.feed(cuerpo)
        print(f'ARCA {url}: {len(p.tablas)} tablas')
        for i, t in enumerate(p.tablas):
            print(f'  tabla {i}: {len(t)} filas; primeras:', t[:3])
        # La tabla de categorías: filas que empiezan con una letra de categoría
        mejor = max(p.tablas, key=lambda t: sum(1 for f in t if f and re.match(r'^[A-K]$', f[0])), default=None)
        if mejor and sum(1 for f in mejor if f and re.match(r'^[A-K]$', f[0])) >= 8:
            encabezado = [f for f in mejor if f and not re.match(r'^[A-K]$', f[0])]
            filas = [f for f in mejor if f and re.match(r'^[A-K]$', f[0])]
            texto = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', cuerpo)))
            vigencias = [m.group(0) for m in re.finditer(r'[^.]{0,120}[Vv]igen[^.]{0,160}', texto)][:6]
            notas = [m.group(0).strip() for m in re.finditer(r'\(\*{1,4}\)[^(]{5,700}', texto)][-8:]
            for v in vigencias:
                print('  vigencia:', v)
            for n in notas:
                print('  nota:', n)
            return {'fuente': url, 'encabezado': encabezado, 'filas': filas, 'vigencias': vigencias, 'notas': notas}
        print('  sin tabla de categorías reconocible. Texto:', re.sub(r'<[^>]+>', ' ', cuerpo)[:2500])
    return None


def main():
    previo = {}
    if os.path.exists(SALIDA):
        previo = json.load(open(SALIDA, encoding='utf-8'))
    datos = dict(previo)
    try:
        os_ = obras_sociales()
        if len(os_) >= MINIMO_OS:
            datos['obrasSociales'] = os_
            datos['fuenteObrasSociales'] = FUENTE_OS
        else:
            print(f'SSSalud: pocas ({len(os_)}), se conservan las anteriores')
    except Exception as e:  # noqa: BLE001
        print('SSSalud falló:', e)
    try:
        cat = categorias()
        if cat:
            datos['categorias'] = cat
    except Exception as e:  # noqa: BLE001
        print('ARCA falló:', e)
    if datos != previo:
        datos['generado'] = datetime.date.today().isoformat()
        with open(SALIDA, 'w', encoding='utf-8') as f:
            json.dump(datos, f, ensure_ascii=False, indent=1)
            f.write('\n')
        print('Guardado', SALIDA)
    else:
        print('Sin cambios')


if __name__ == '__main__':
    sys.exit(main())
