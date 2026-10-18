"""Centros de atención de OSECAC (policlínicos, clínicas, centros de diagnóstico) por provincia.

Fuente: el buscador público "Búsqueda Centros de Atención" del sitio oficial
(https://www.osecac.org.ar/Centros), que pega a un endpoint propio sin login
ni captcha (verificado el 18-oct-2026):

  GET https://www.osecac.org.ar/Centros/TablaCentro?prov=&loc=&cent=&provNombre=Cordoba

Devuelve un fragmento de HTML con un bloque por centro: nombre (h3), dirección,
teléfono, horario (a veces falta), el link "Ver en el mapa" con
data-assigned-id="lat/lon/NOMBRE" (a veces sin mapa: "Mapa no disponible") y tres
listas de especialidades (generales, pediátricas, adultos). El parámetro
provNombre es el nombre de la provincia sin tilde, igual que en el buscador de
delegaciones (scrape.py de esta carpeta).

Uso:
  python scrape_centros.py descargar ../../data/osecac-centros
  python scrape_centros.py generar ../../data/osecac-centros ../../lib/data/sindicales-zonas/osecac-centros.json
"""
import html as htmllib
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

API = 'https://www.osecac.org.ar/Centros/TablaCentro?prov=&loc=&cent=&provNombre={prov}&page={page}&_={ts}'
MAX_PAGINAS = 40  # tope de seguridad; la provincia con más centros (Buenos Aires) tiene unas 15
UA = {'User-Agent': 'Mozilla/5.0 (PrepagaYa; datos publicos de centros de atencion OSECAC)'}

PROVINCIAS = [
    'Buenos Aires', 'Capital Federal', 'Catamarca', 'Chaco', 'Chubut', 'Cordoba',
    'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquen', 'Rio Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago Del Estero',
    'Tierra Del Fuego', 'Tucuman',
]


def pedir(prov, page):
    url = API.format(prov=urllib.parse.quote(prov), page=page, ts=int(time.time() * 1000))
    req = urllib.request.Request(url, headers=UA)
    for intento in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode('utf-8', errors='replace')
        except Exception as e:  # noqa: BLE001
            print(f'{prov} p{page}: intento {intento + 1} falló ({e})')
            time.sleep(3)
    return None


def descargar(raw_dir):
    """Baja todas las páginas de cada provincia (el buscador pagina de a ~7 centros)."""
    os.makedirs(raw_dir, exist_ok=True)
    for prov in PROVINCIAS:
        vistos = set()
        for page in range(1, MAX_PAGINAS + 1):
            texto = pedir(prov, page)
            if texto is None:
                break
            ids = set(re.findall(r'Favoritos\(this\);"[^>]*data-assigned-id="(\d+)"', texto)) or set(re.findall(r'<h3>(.*?)</h3>', texto, re.S))
            if not ids or ids <= vistos:
                break
            vistos |= ids
            destino = os.path.join(raw_dir, f'{prov.lower().replace(" ", "-")}-p{page:02d}.html')
            with open(destino, 'w', encoding='utf-8') as f:
                f.write(texto)
            time.sleep(1.2)
        print(f'{prov}: {len(vistos)} centros distintos')


def limpiar(txt):
    return re.sub(r'\s+', ' ', htmllib.unescape(re.sub(r'<[^>]+>', ' ', txt))).strip()


def parsear(texto):
    """Devuelve la lista de centros de un fragmento de HTML."""
    centros = []
    # Cada centro arranca en un <h3> dentro de un bloque de resultado.
    partes = re.split(r'(?=<h3>)', texto)
    for parte in partes:
        m = re.match(r'<h3>(.*?)</h3>', parte, re.S)
        if not m:
            continue
        nombre = limpiar(m.group(1))
        mitad = len(nombre) // 2
        if len(nombre) % 2 == 1 and nombre[:mitad] == nombre[mitad + 1:]:
            nombre = nombre[:mitad]  # el sitio repite el nombre en algunos centros
        def campo(etiqueta):
            mm = re.search(r'<strong>\s*' + etiqueta + r':?\s*</strong>(.*?)</li>', parte, re.S)
            return limpiar(mm.group(1)) if mm else ''
        mapa = re.search(r'data-assigned-id="(-?[\d.]+)/(-?[\d.]+)/', parte)
        idm = re.search(r'Favoritos\(this\);"[^>]*data-assigned-id="(\d+)"', parte)
        espec = {}
        for titulo, bloque in re.findall(r'Especialidades\s+([^:<]+):</h5></div>(.*?)(?=<div class="col-sm-12"|<hr|$)', parte, re.S):
            items = [limpiar(x) for x in re.findall(r'</i>\s*([^<]+?)\s*</div>', bloque)]
            espec[limpiar(titulo)] = [i for i in items if i]
        centros.append({
            'id': idm.group(1) if idm else '',
            'nombre': nombre,
            'direccion': campo('Direcci(?:ó|&#243;|o)n'),
            'telefono': campo('Tel(?:é|&#233;|e)fono'),
            'horario': campo('Horario'),
            'lat': float(mapa.group(1)) if mapa else None,
            'lon': float(mapa.group(2)) if mapa else None,
            'especialidades': espec,
        })
    return centros


def generar(raw_dir, salida):
    out = {'descargado': time.strftime('%Y-%m-%d'), 'fuente': 'https://www.osecac.org.ar/Centros', 'provincias': {}}
    for prov in PROVINCIAS:
        base = prov.lower().replace(' ', '-')
        archivos = sorted(f for f in os.listdir(raw_dir) if re.fullmatch(re.escape(base) + r'-p\d+\.html', f))
        vistos, centros = set(), []
        for a in archivos:
            with open(os.path.join(raw_dir, a), encoding='utf-8') as f:
                for c in parsear(f.read()):
                    clave = c['id'] or c['nombre']
                    if clave in vistos:
                        continue
                    vistos.add(clave)
                    centros.append(c)
        out['provincias'][prov] = centros
        print(f'{prov}: {len(centros)} centros')
    os.makedirs(os.path.dirname(salida), exist_ok=True)
    with open(salida, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
