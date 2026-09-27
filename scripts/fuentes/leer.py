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
    # Octava pasada (27-sep-2026): el texto de la Ley 26.872 (Infoleg id
    # 218211), que la séptima encontró en el buscador de Infoleg.
    'https://servicios.infoleg.gob.ar/infolegInternet/anexos/215000-219999/218211/norma.htm',
    'https://servicios.infoleg.gob.ar/infolegInternet/anexos/215000-219999/218211/texact.htm',
]
# Extractos: se imprime solo alrededor de estos temas
EXTRACTO = re.compile(r'26\.?872|mastectom|reconstruc|reparador|pr[oó]tesis mamari|cirug[ií]a pl[aá]stica|est[eé]tic', re.I)
SOLO_SEMILLAS = True
# Links a seguir (por texto del link o por URL): solo los que nombran la norma
SEGUIR = re.compile(r'26\.?872|26872|mastectom|reconstrucci[oó]n mamaria', re.I)
MAX_SEGUIDOS = 15
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
        cs = r.headers.get_content_charset()
        if cs:
            return r.geturl(), crudo.decode(cs, errors='replace')
        try:
            return r.geturl(), crudo.decode('utf-8')
        except UnicodeDecodeError:
            return r.geturl(), crudo.decode('cp1252', errors='replace')


# Ya leídas en la primera pasada (24-sep-2026)
LEIDAS = re.compile(r'casasparticulares|anses\.gob\.ar/(hijos|trabajo|matrimonio|embarazo|viudez)|unificacion-de-aportes|jubilaciones-y-pensiones|pami\.org\.ar|jubilado|/sssalud/(institucional|noticias|recepci|base-datos|prestadores|valores-de-planes|medicina-prepaga-0|centro-de-atencion)|/noticias/|hospitales-publicos|transparencia/subsidios|procedimiento-de-mediacion|reclamos-interrupcion')


def main():
    cola, vistos, n = list(SEMILLAS), set(), 0
    seguidos = [0]
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
        rangos = []
        for m in EXTRACTO.finditer(texto):
            a, b = max(0, m.start() - 400), min(len(texto), m.end() + 1500)
            if rangos and a <= rangos[-1][1]:
                rangos[-1][1] = max(rangos[-1][1], b)
            else:
                rangos.append([a, b])
        partes = '\n[...]\n'.join(texto[a:b] for a, b in rangos)
        print(f'\n##### {final}\n## {p.titulo.strip()} ({len(texto)} caracteres, {len(rangos)} extractos)\n{partes[:12000] if partes else texto[:600]}')
        # Links que nombran la norma, para saber dónde está el texto
        for h, t in p.anclas:
            if SEGUIR.search(t) or SEGUIR.search(h):
                print(f'  -> {t.strip()[:120]} | {urljoin(final, h)}')
        if SOLO_SEMILLAS:
            continue
        for h, t in p.anclas:
            u = urldefrag(urljoin(final, h))[0]
            if (SEGUIR.search(t) or SEGUIR.search(u)) and u not in vistos and urlparse(u).netloc in DOMINIOS and seguidos[0] < MAX_SEGUIDOS:
                seguidos[0] += 1
                cola.append(u)
    print(f'\nPáginas leídas: {n}')


# ── Novena pasada (27-sep-2026): leyes especiales para el buscador "¿Qué me
# cubre la prepaga?". Para cada ley: buscador de Infoleg → ficha (verNorma)
# → "Texto completo" o "Texto actualizado". Se imprimen los artículos que
# hablan de cobertura. Además, ubicar los anexos del PMO (Res. 201/2002) y la
# Resolución 310/2004 (medicamentos).
LEYES = {
    26862: 'fertilización asistida', 26130: 'anticoncepción quirúrgica', 26396: 'trastornos alimentarios / obesidad',
    23753: 'diabetes', 24901: 'discapacidad', 26657: 'salud mental', 27043: 'TEA', 25415: 'hipoacusia',
    26588: 'celiaquía', 25673: 'salud sexual', 27610: 'IVE', 26743: 'identidad de género', 24455: 'HIV y adicciones',
    26279: 'pesquisa neonatal', 27552: 'fibrosis quística', 27305: 'leche medicamentosa',
}
COBERTURA = re.compile(r'cobertura|prepaga|obras? sociales?|100 ?%|cien por ciento|incorp[oó]rase|Programa M[eé]dico Obligatorio|PMO|tratamiento|prestaci', re.I)
MAX_LOG_LEY = 7000


def texto_de(url):
    final, cuerpo = bajar(url)
    p = Extraer()
    p.feed(cuerpo)
    t = html.unescape(''.join(p.texto))
    t = re.sub(r'[ \t\r\f\v]+', ' ', t)
    t = re.sub(r'\n\s*\n+', '\n', t).strip()
    return final, p, t


def extractos(t, rx, antes=250, despues=1100, tope=MAX_LOG_LEY):
    rangos = []
    for m in rx.finditer(t):
        a, b = max(0, m.start() - antes), min(len(t), m.end() + despues)
        if rangos and a <= rangos[-1][1]:
            rangos[-1][1] = max(rangos[-1][1], b)
        else:
            rangos.append([a, b])
    return '\n[...]\n'.join(t[a:b] for a, b in rangos)[:tope]


def leyes():
    base = 'https://servicios.infoleg.gob.ar/infolegInternet/'
    for num, tema in LEYES.items():
        print(f'\n########## LEY {num} ({tema})')
        try:
            final, p, t = texto_de(f'{base}buscarNormas.do?tipoNorma=1&numero={num}')
            ficha = next((urljoin(final, h) for h, x in p.anclas if 'verNorma.do' in h), None)
            if not ficha:
                print('!! sin ficha'); continue
            final, p, t = texto_de(ficha)
            print(f'ficha: {final}')
            print(t[:400].replace('\n', ' | '))
            textos = [(x.strip(), urljoin(final, h)) for h, x in p.anclas if re.search(r'Texto (completo|actualizado)', x, re.I)]
            # el actualizado primero, si existe
            textos.sort(key=lambda e: 0 if 'actualizado' in e[0].lower() else 1)
            if not textos:
                print('!! sin link al texto'); continue
            nombre, url = textos[0]
            final, p, t = texto_de(url)
            print(f'## {nombre}: {final} ({len(t)} caracteres)')
            print(extractos(t, re.compile(r'ART[IÍ]CULO\s*\d+|ART\.\s*\d+', re.I), antes=0, despues=900) if len(t) < 9000 else extractos(t, COBERTURA))
        except Exception as e:  # noqa: BLE001
            print(f'!! {e}')
    # PMO: anexos de la Res. 201/2002 (links de su página)
    print('\n########## PMO Res. 201/2002: anexos')
    try:
        final, p, t = texto_de(base + 'anexos/70000-74999/73649/norma.htm')
        for h, x in p.anclas:
            print(f'  -> {x.strip()[:80]} | {urljoin(final, h)}')
    except Exception as e:  # noqa: BLE001
        print(f'!! {e}')
    # Resolución 310/2004 (medicamentos): probar los tipos de norma del buscador
    for tipo in (2, 3, 4, 5):
        url = f'{base}buscarNormas.do?tipoNorma={tipo}&numero=310&anioSancion=2004'
        print(f'\n########## búsqueda Res 310/2004, tipoNorma={tipo}')
        try:
            final, p, t = texto_de(url)
            print(t[:700].replace('\n', ' | '))
            for h, x in p.anclas:
                if 'verNorma' in h:
                    print(f'  -> {x.strip()[:60]} | {urljoin(final, h)}')
        except Exception as e:  # noqa: BLE001
            print(f'!! {e}')


# ── Décima pasada (27-sep-2026): Anexo I del PMO completo (prestaciones),
# Anexos III y IV (inicio), la Resolución 310/2004 del Ministerio de Salud
# (medicamentos) entre los 5 resultados del buscador, el art. 7 de la Ley
# 26.682 (PMO y discapacidad) y el texto de las leyes 27.043, 27.305 y 24.455
# que salieron vacías por la codificación.
def decima():
    base = 'https://servicios.infoleg.gob.ar/infolegInternet/'
    anexos = base + 'anexos/70000-74999/73649/res201-2002MS-anexo'
    for nombre, tope in (('I', 70000), ('III', 4000), ('IV', 4000)):
        print(f'\n########## PMO ANEXO {nombre}')
        try:
            final, p, t = texto_de(anexos + nombre + '.htm')
            print(f'({len(t)} caracteres)')
            print(t[:tope])
        except Exception as e:  # noqa: BLE001
            print(f'!! {e}')
    for i in (103765, 95169, 94218, 93100, 92579):
        try:
            final, p, t = texto_de(f'{base}verNorma.do?id={i}')
            if not re.search(r'SALUD', t):
                continue
            print(f'\n########## RES 310/2004 candidata id={i}')
            print(t[:500].replace('\n', ' | '))
            textos = [(x.strip(), urljoin(final, h)) for h, x in p.anclas if re.search(r'Texto (completo|actualizado)', x, re.I)]
            textos.sort(key=lambda e: 0 if 'actualizado' in e[0].lower() else 1)
            for nombre, url in textos[:1]:
                final, p2, t2 = texto_de(url)
                print(f'## {nombre}: {final} ({len(t2)} caracteres)')
                print(t2[:9000])
                for h, x in p2.anclas:
                    if 'anexo' in h.lower():
                        print(f'  -> {x.strip()[:60]} | {urljoin(final, h)}')
        except Exception as e:  # noqa: BLE001
            print(f'!! {e}')
    print('\n########## LEY 26682 art. 7')
    try:
        final, p, t = texto_de(base + 'anexos/180000-184999/182180/texact.htm')
        i = t.find('ARTICULO 7')
        print(t[i:i + 1500] if i >= 0 else t[:3000])
    except Exception as e:  # noqa: BLE001
        print(f'!! {e}')
    for url, nombre in ((base + 'anexos/240000-244999/240452/norma.htm', 'LEY 27043 (TEA)'),
                        (base + 'anexos/265000-269999/267397/norma.htm', 'LEY 27305 (leche medicamentosa)'),
                        (base + 'anexos/10000-14999/14919/norma.htm', 'LEY 24455 (HIV y adicciones)')):
        print(f'\n########## {nombre}')
        try:
            final, p, t = texto_de(url)
            print(t[:6000])
        except Exception as e:  # noqa: BLE001
            print(f'!! {e}')



# ── Undécima pasada (27-sep-2026): leyes que faltan para el buscador "¿Qué me
# cubre la prepaga?": 24.754 (prepagas = prestaciones obligatorias de las obras
# sociales), 27.491 (vacunas), 27.675 (VIH), 27.447 (trasplantes), 27.674
# (cáncer infantil), 25.929 (parto respetado), 27.611 (mil días), el art. 37 de
# la 26.657 (salud mental) y el Decreto 956/2013 (fertilización: cuántos
# tratamientos).
LEYES_11 = {24754: 'prepagas', 27491: 'vacunación', 27675: 'VIH', 27447: 'trasplantes',
            27674: 'cáncer infantil', 25929: 'parto respetado', 27611: 'mil días'}
PREPAGA = re.compile(r'prepaga|obras? sociales?|Programa M[eé]dico Obligatorio|PMO|cien por ciento|100 ?%', re.I)


def texto_norma(tipo, num, anio=None):
    base = 'https://servicios.infoleg.gob.ar/infolegInternet/'
    url = f'{base}buscarNormas.do?tipoNorma={tipo}&numero={num}' + (f'&anioSancion={anio}' if anio else '')
    final, p, t = texto_de(url)
    fichas = [urljoin(final, h) for h, x in p.anclas if 'verNorma.do' in h]
    if not fichas:
        return None, None, t[:600]
    final, p, t = texto_de(fichas[0])
    print(f'ficha: {final}')
    print(t[:350].replace('\n', ' | '))
    textos = [(x.strip(), urljoin(final, h)) for h, x in p.anclas if re.search(r'Texto (completo|actualizado)', x, re.I)]
    textos.sort(key=lambda e: 0 if 'actualizado' in e[0].lower() else 1)
    if not textos:
        return None, None, 'sin link al texto'
    final, p, t = texto_de(textos[0][1])
    print(f'## {textos[0][0]}: {final} ({len(t)} caracteres)')
    return final, p, t


def undecima():
    for num, tema in LEYES_11.items():
        print(f'\n########## LEY {num} ({tema})')
        try:
            final, p, t = texto_norma(1, num)
            if final is None:
                print(f'!! {t}'); continue
            print(t[:5000] if len(t) < 5000 else extractos(t, PREPAGA, antes=500, despues=900, tope=6000))
        except Exception as e:  # noqa: BLE001
            print(f'!! {e}')
    print('\n########## LEY 26657 art. 37 y prepagas')
    try:
        final, p, t = texto_de('https://servicios.infoleg.gob.ar/infolegInternet/anexos/175000-179999/175977/norma.htm')
        i = t.find('ARTICULO 37')
        print(t[i:i + 1200] if i >= 0 else '!! sin art. 37')
        print(extractos(t, re.compile(r'prepaga', re.I), antes=600, despues=600, tope=3000))
    except Exception as e:  # noqa: BLE001
        print(f'!! {e}')
    print('\n########## DECRETO 956/2013 (fertilización)')
    try:
        final, p, t = texto_norma(2, 956, 2013)
        if final is None:
            print(f'!! {t}')
        else:
            i = t.find('ARTICULO 8')
            print(t[i:i + 2500] if i >= 0 else extractos(t, re.compile(r'tratamientos|complejidad', re.I), tope=5000))
    except Exception as e:  # noqa: BLE001
        print(f'!! {e}')



# ── Duodécima pasada (27-sep-2026): lo que la undécima dejó incompleto. La
# Ley 27.491 (vacunas) salió vacía, el art. 2 de la 25.929 cortado, y falta la
# reglamentación de salud mental (Decreto 603/2013, art. 37: límites de
# cobertura) y ver si la 27.447 (trasplantes) dice algo de la cobertura.
def duodecima():
    base = 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/'
    for url, nombre, rx in (
        (base + '315000-319999/318455/norma.htm', 'LEY 27491 (vacunas)', r'prepaga|obras?\s+sociales?|gratuit|cobertura'),
        (base + '95000-99999/98805/norma.htm', 'LEY 25929 art. 2', None),
        (base + '310000-314999/312715/norma.htm', 'LEY 27447 (trasplantes) cobertura', r'cobertura|obras?\s+sociales?|prepaga|cargo de'),
    ):
        print(f'\n########## {nombre}')
        try:
            final, p, t = texto_de(url)
            print(f'({len(t)} caracteres)')
            if rx is None:
                i = t.find('ARTICULO 2')
                print(t[i:i + 3000])
            else:
                print(extractos(t, re.compile(rx, re.I), antes=300, despues=700, tope=6000) or t[:2500])
        except Exception as e:  # noqa: BLE001
            print(f'!! {e}')
    print('\n########## DECRETO 603/2013 (salud mental) art. 37')
    try:
        final, p, t = texto_norma(2, 603, 2013)
        if final is None:
            print(f'!! {t}')
        else:
            i = t.find('ARTICULO 37')
            print(t[i:i + 2500] if i >= 0 else extractos(t, re.compile(r'cobertura|prepaga', re.I), tope=5000))
    except Exception as e:  # noqa: BLE001
        print(f'!! {e}')


if __name__ == '__main__':
    sys.exit(duodecima())
