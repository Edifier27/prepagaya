"""Farmacias de Swiss Medical por zona — SOLO comercios (nunca médicos).

Fuente: endpoint dedicado del mismo buscador público que usa swiss.py, pero
DISTINTO del de médicos/sanatorios (confirmado inspeccionando la red real del
buscador oficial, 29-sep-2026 — "tipo" del otro endpoint nunca sirvió para
esto porque es un endpoint aparte):

  GET https://mobile.swissmedical.com.ar/api-smg/v1/getFarmaciasCartillaWithoutLoc
      ?tipo=5&pt=&d=&carti={grupo},ANT&especialidad=Farmacias&deno_prov=...

- "carti" son grupos de cartilla: NU3 (SMG02), CLE (SMG20), CLS (SMG30) — los
  mismos 3 grupos que usa swiss.py — más "ANT" (bucket adicional que trae el
  buscador oficial siempre sumado al grupo elegido; sin fuente de qué
  significa la sigla, pero se replica el comportamiento exacto del sitio).
- "pt"/"d" (punto/radio) se pueden dejar vacíos: filtrar por deno_prov ya
  alcanza y no trunca (probado con Buenos Aires: 986 resultados, sin tope).

Uso:
  python farmacias.py descargar <carpeta_raw>
  python farmacias.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/swiss-medical-farmacias.json
"""
import json, os, re, sys, time
from datetime import date
import importlib.util

_spec = importlib.util.spec_from_file_location('swiss', os.path.join(os.path.dirname(__file__), 'swiss.py'))
swiss = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(swiss)

API = 'https://mobile.swissmedical.com.ar/api-smg/v1/getFarmaciasCartillaWithoutLoc'
ZONAS_AMBA_FARMA = {'ZONA NORTE': ('GBA Zona Norte', 'gba-zona-norte'), 'ZONA SUR': ('GBA Zona Sur', 'gba-zona-sur'),
                     'ZONA OESTE': ('GBA Zona Oeste', 'gba-zona-oeste'), 'ZONA NOROESTE': ('GBA Zona Noroeste', 'gba-zona-noroeste')}


def pedir_farmacias(carti, prov):
    q = swiss.urllib.parse.urlencode({'tipo': '5', 'pt': '', 'd': '', 'carti': carti, 'especialidad': 'Farmacias',
                                       'deno_prov': prov, 'deno_loca': '', 'deno_barr': '', 'deno_part': '', 'ape_razon': ''},
                                      quote_via=swiss.urllib.parse.quote)
    req = swiss.urllib.request.Request(f'{API}?{q}', headers={'User-Agent': 'Mozilla/5.0', 'Origin': 'https://www.swissmedical.com.ar'})
    for intento in range(4):
        try:
            with swiss.urllib.request.urlopen(req, timeout=90) as r:
                return json.loads(r.read().decode('utf-8'))['response']
        except Exception as e:
            print('  reintento', intento, e, flush=True)
            time.sleep(15 * (intento + 1))
    raise RuntimeError(f'fallo farmacias {carti} {prov}')


def descargar(raw):
    os.makedirs(raw, exist_ok=True)
    for carti in swiss.CARTILLAS:
        for prov in swiss.PROVINCIAS:
            f = os.path.join(raw, f'{carti}__{swiss.clave(prov)}.json')
            if os.path.exists(f):
                continue
            r = pedir_farmacias(f'{carti},ANT', prov)
            docs = r.get('docs', [])
            if r.get('numFound', 0) > len(docs):
                print('  OJO: sigue truncado', carti, prov, r.get('numFound'), len(docs), flush=True)
            json.dump(docs, open(f, 'w', encoding='utf-8'), ensure_ascii=False)
            print(carti, prov, len(docs), flush=True)
            time.sleep(1)


# zona_deno trae variantes mensas para GBA ("ZONA NORTE", "GRAN GBA - ZONA
# NORTE", "PROV. BUENOS AIRES - ZONA NORTE"): las dos primeras son GBA real
# (confirmado con Part_deno=SAN ISIDRO en una muestra); la tercera es
# interior de la provincia más lejos, se trata como localidad suelta
# (mismo criterio que swiss.py para el resto de las categorías).
def zona_de_farmacia(doc):
    prov = (doc.get('Prov_deno') or '').strip().upper()
    if prov == 'CAPITAL FEDERAL':
        return 'Ciudad de Buenos Aires', 'caba', ['Ciudad de Buenos Aires']
    if prov == 'BUENOS AIRES':
        zd = (doc.get('zona_deno') or '').strip().upper()
        if not zd.startswith('PROV. BUENOS AIRES'):
            z = zd.replace('GRAN GBA - ', '').strip()
            if z in ZONAS_AMBA_FARMA:
                nombre, slug = ZONAS_AMBA_FARMA[z]
                return nombre, slug, ['Buenos Aires']
    loca = swiss.titulo(doc.get('Loca_deno') or doc.get('Part_deno') or '')
    provincia = swiss.PROVINCIAS.get(prov, swiss.titulo(prov))
    return loca, swiss.clave(loca), [provincia]


def generar(raw, salida):
    zonas = {}
    for carti, plan in swiss.CARTILLAS.items():
        for prov in swiss.PROVINCIAS:
            docs = json.load(open(os.path.join(raw, f'{carti}__{swiss.clave(prov)}.json'), encoding='utf-8'))
            for doc in docs:
                nombre_z, slug, provincias = zona_de_farmacia(doc)
                if not slug:
                    continue
                if slug in zonas and zonas[slug]['provincias'] != provincias:
                    slug = f'{slug}-{swiss.clave(provincias[0])}'
                z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre_z, 'provincias': provincias, 'centros': {}})
                nom = swiss.nombre_centro(doc.get('razon'))
                if not nom:
                    continue
                calle = ' '.join(x for x in [swiss.titulo(doc.get('direccion')), (doc.get('numero') or '').strip()] if x) or None
                ck = swiss.clave(f'{nom}-{calle or ""}')
                c = z['centros'].setdefault(ck, {'nombre': nom, 'planes': [], 'notas': [], 'sedes': []})
                if plan not in c['planes']:
                    c['planes'].append(plan)
                if doc.get('anticonceptivo') and 'Anticonceptivos al 100%' not in c['notas']:
                    c['notas'].append('Anticonceptivos al 100%')
                if not any(swiss.clave(s['direccion'] or '') == swiss.clave(calle or '') for s in c['sedes']):
                    caba = (doc.get('Prov_deno') or '').strip().upper() == 'CAPITAL FEDERAL'
                    loca = swiss.titulo(doc.get('Barr_deno') if caba else doc.get('Loca_deno') or '') or None
                    tel = re.sub(r'\s+', ' ', (doc.get('Telefono') or '').strip()) or None
                    lat, lon = doc.get('coordenada_1_coordinate'), doc.get('coordenada_0_coordinate')
                    c['sedes'].append({
                        'direccion': calle, 'localidad': loca, 'tel': tel,
                        'lat': lat if isinstance(lat, (int, float)) else None,
                        'lon': lon if isinstance(lon, (int, float)) else None,
                        'turnoDigital': False,
                    })
    salida_zonas = []
    for z in zonas.values():
        centros = list(z['centros'].values())
        for c in centros:
            c['planes'] = [p for p in swiss.ORDEN_PLANES if p in c['planes']]
        centros.sort(key=lambda c: swiss.clave(c['nombre']))
        salida_zonas.append({**z, 'centros': centros})
    out = {'fuente': 'Buscador oficial de cartilla de Swiss Medical (swissmedical.com.ar/prepagaclientes/cartilla)',
           'vigencia': [date.today().strftime('%d/%m/%Y')], 'planes': swiss.ORDEN_PLANES, 'zonas': salida_zonas}
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'farmacias')


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
