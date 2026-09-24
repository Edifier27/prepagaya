"""Lee páginas oficiales de trámites de obra social y las imprime como texto.

La red de los entornos de desarrollo no llega a argentina.gob.ar ni a
sssalud.gob.ar; esta Action sí. No guarda nada: el texto queda en el log
del job y sirve para escribir las guías de trámites (lib/data/guias.ts)
con la letra oficial. Arranca de unas páginas semilla y sigue los links que
hablan de obra social, aportes, opción de cambio, reclamos y jubilación.
"""
import html
import re
import sys
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urldefrag, urlparse

SEMILLAS = [
    # Segunda pasada: jubilados (ANSES, PAMI) y el manual del usuario de la SSSalud
    'https://www.anses.gob.ar/jubilaciones-y-pensiones',
    'https://www.anses.gob.ar/consultas/obra-social-codem',
    'https://www.anses.gob.ar/tramite/opcion-de-obra-social-para-jubilados-y-pensionados',
    'https://www.pami.org.ar/afiliacion',
    'https://www.argentina.gob.ar/servicio/elegir-o-cambiar-la-obra-social-siendo-jubilado-o-pensionado',
    'https://www.argentina.gob.ar/sssalud/usuarios/manual-del-usuario',
    'https://www.argentina.gob.ar/sssalud/usuarios/manual-del-usuario/cambio-de-agente-del-seguro',
    'https://www.argentina.gob.ar/sssalud/usuarios/manual-del-usuario/tipos-de-usuarios',
    'https://www.argentina.gob.ar/sssalud/usuarios/manual-del-usuario/afiliacion',
    'https://www.argentina.gob.ar/sssalud/usuarios',
]
CLAVES = re.compile(r'manual|usuario|afiliac|jubilad|pensionad|obra[-_ ]?social|opcion|opci%C3%B3n|aporte|unific|reclam|jubil|monotribut|padron|padr%C3%B3n|cobertura|prepaga|sssalud|desempleo|traspaso|cambi', re.I)
DOMINIOS = ('www.argentina.gob.ar', 'argentina.gob.ar', 'www.sssalud.gob.ar', 'sssalud.gob.ar', 'www.anses.gob.ar', 'www.pami.org.ar')
MAX_PAGINAS = 60
MAX_CHARS = 6000


class Extraer(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texto, self.links, self.titulo = [], [], ''
        self._saltar = 0
        self._en_titulo = False

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'noscript', 'svg', 'header', 'footer', 'nav'):
            self._saltar += 1
        if tag == 'title':
            self._en_titulo = True
        if tag == 'a':
            href = dict(attrs).get('href')
            if href:
                self.links.append(href)
        if tag in ('p', 'li', 'h1', 'h2', 'h3', 'h4', 'tr', 'br', 'div'):
            self.texto.append('\n')

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript', 'svg', 'header', 'footer', 'nav') and self._saltar:
            self._saltar -= 1
        if tag == 'title':
            self._en_titulo = False

    def handle_data(self, data):
        if self._en_titulo:
            self.titulo += data
        elif not self._saltar:
            self.texto.append(data)


def bajar(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; prepagaya-fuentes/1.0)', 'Accept-Language': 'es-AR,es'})
    with urllib.request.urlopen(req, timeout=25) as r:
        crudo = r.read()
        cs = r.headers.get_content_charset() or 'utf-8'
        return r.geturl(), crudo.decode(cs, errors='replace')


# Ya leídas en la primera pasada (24-sep-2026)
LEIDAS = re.compile(r'/sssalud/(transparencia|institucional|noticias|recepci|base-datos|prestadores|valores-de-planes|medicina-prepaga-0|centro-de-atencion)|/noticias/|hospitales-publicos|transparencia/subsidios|procedimiento-de-mediacion|reclamos-interrupcion')


def main():
    cola, vistos, n = list(SEMILLAS), set(), 0
    while cola and n < MAX_PAGINAS:
        url = urldefrag(cola.pop(0))[0]
        if url in vistos or LEIDAS.search(url):
            continue
        vistos.add(url)
        try:
            final, cuerpo = bajar(url)
        except Exception as e:  # noqa: BLE001
            print(f'\n##### {url}\n!! {e}')
            continue
        n += 1
        p = Extraer()
        p.feed(cuerpo)
        texto = html.unescape(''.join(p.texto))
        texto = re.sub(r'[ \t\r\f\v]+', ' ', texto)
        texto = re.sub(r'\n\s*\n+', '\n', texto).strip()
        print(f'\n##### {final}\n## {p.titulo.strip()}\n{texto[:MAX_CHARS]}')
        for h in p.links:
            u = urldefrag(urljoin(final, h))[0]
            if urlparse(u).netloc in DOMINIOS and CLAVES.search(u) and u not in vistos and not re.search(r'\.(pdf|jpg|png|zip|docx?)$', u, re.I):
                cola.append(u)
    print(f'\nPáginas leídas: {n}')


if __name__ == '__main__':
    sys.exit(main())
