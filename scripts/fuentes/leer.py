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
    # Quinta pasada (27-sep-2026): carencias y preexistencias en prepagas.
    # Texto actualizado de la Ley 26.682 (el DNU 70/2023 la modificó), su
    # reglamentación (Decreto 1993/2011) y las páginas de derechos de la
    # SSSalud y de Derecho Fácil sobre medicina prepaga.
    'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm',
    'https://servicios.infoleg.gob.ar/infolegInternet/verVinculos.do?modo=2&id=182180',
    'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/medicina-prepaga',
    'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/salud/medicina-prepaga',
    'https://www.argentina.gob.ar/sssalud/usuarios-de-medicina-prepaga',
    'https://www.argentina.gob.ar/servicio/afiliarse-una-empresa-de-medicina-prepaga',
]
CLAVES = re.compile(r'acceso|informacion-publica|informaci%C3%B3n-p%C3%BAblica|aaip|solicitar-informacion|responsable|casas|domestic|particular|hijo|estudiant|famil|divorc|desunific|conyug|c%C3%B3nyuge|conviv|trabajador|empleador|manual|usuario|afiliac|jubilad|pensionad|obra[-_ ]?social|opcion|opci%C3%B3n|aporte|unific|reclam|jubil|monotribut|padron|padr%C3%B3n|cobertura|prepaga|sssalud|desempleo|traspaso|cambi', re.I)
DOMINIOS = ('servicios.infoleg.gob.ar', 'www.arca.gob.ar', 'www.afip.gob.ar', 'www.argentina.gob.ar', 'argentina.gob.ar', 'www.sssalud.gob.ar', 'sssalud.gob.ar', 'www.anses.gob.ar', 'www.pami.org.ar')
MAX_PAGINAS = 60
MAX_CHARS = 9000
# Textos de normas completos (el artículo buscado puede estar lejos del inicio)
MAX_CHARS_NORMA = 60000
INFOLEG_SEGUIR = re.compile(r'Decreto\s*1993|Decreto\s*70|DNU|1993/2011|70/2023', re.I)


class Extraer(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texto, self.links, self.titulo = [], [], ''
        self.anclas, self._ancla = [], None
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
                self._ancla = [href, '']
        if tag in ('p', 'li', 'h1', 'h2', 'h3', 'h4', 'tr', 'br', 'div'):
            self.texto.append('\n')

    def handle_endtag(self, tag):
        if tag == 'a' and getattr(self, '_ancla', None):
            self.anclas.append(tuple(self._ancla))
            self._ancla = None
        if tag in ('script', 'style', 'noscript', 'svg', 'header', 'footer', 'nav') and self._saltar:
            self._saltar -= 1
        if tag == 'title':
            self._en_titulo = False

    def handle_data(self, data):
        if self._en_titulo:
            self.titulo += data
        elif not self._saltar:
            self.texto.append(data)
        if getattr(self, '_ancla', None):
            self._ancla[1] += data


def bajar(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; prepagaya-fuentes/1.0)', 'Accept-Language': 'es-AR,es'})
    with urllib.request.urlopen(req, timeout=25) as r:
        crudo = r.read()
        cs = r.headers.get_content_charset() or 'utf-8'
        return r.geturl(), crudo.decode(cs, errors='replace')


# Ya leídas en la primera pasada (24-sep-2026)
LEIDAS = re.compile(r'casasparticulares|anses\.gob\.ar/(hijos|trabajo|matrimonio|embarazo|viudez)|unificacion-de-aportes|jubilaciones-y-pensiones|pami\.org\.ar|jubilado|/sssalud/(institucional|noticias|recepci|base-datos|prestadores|valores-de-planes|medicina-prepaga-0|centro-de-atencion)|/noticias/|hospitales-publicos|transparencia/subsidios|procedimiento-de-mediacion|reclamos-interrupcion')


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
        tope = MAX_CHARS_NORMA if 'infoleg' in final else MAX_CHARS
        print(f'\n##### {final}\n## {p.titulo.strip()}\n{texto[:tope]}')
        # Infoleg: de la lista de normas vinculadas, solo decretos/DNU de la ley
        for h, t in p.anclas:
            u = urldefrag(urljoin(final, h))[0]
            if 'infoleg' in urlparse(u).netloc and INFOLEG_SEGUIR.search(t) and u not in vistos:
                cola.insert(0, u)
        for h in p.links:
            u = urldefrag(urljoin(final, h))[0]
            if urlparse(u).netloc in DOMINIOS and CLAVES.search(u) and u not in vistos and not re.search(r'\.(pdf|jpg|png|zip|docx?)$', u, re.I):
                cola.append(u)
    print(f'\nPáginas leídas: {n}')


if __name__ == '__main__':
    sys.exit(main())
