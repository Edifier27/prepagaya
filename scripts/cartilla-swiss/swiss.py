"""Cartilla de Swiss Medical por zona — solo instituciones (internación y guardias).

Fuente: el buscador público de www.swissmedical.com.ar/prepagaclientes/cartilla,
que consulta GET https://mobile.swissmedical.com.ar/api-smg/v1/busquedaPrestadoresSinCalif
(sin login: es el mismo pedido que hace cualquier visitante). Devuelve hasta
600 resultados por consulta: si una búsqueda nacional pasa ese tope, se
repite provincia por provincia.

Cartillas (código "carti" → planes), según la lista de planes del propio buscador:
  NU2 = SMG01 (Nubial Clásica) · NU3 = SMG02 y S1 (Nubial Quality)
  CL1 = SMG10 (Advance) · CLE = SMG20 y S2 (Global) · CLS = SMG30 a SMG70 (Premium)

Uso:
  python swiss.py descargar <carpeta_raw>
  python swiss.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/swiss-medical.json
"""
import json, os, re, sys, time, unicodedata, urllib.parse, urllib.request
from datetime import date

API = 'https://mobile.swissmedical.com.ar/api-smg/v1/busquedaPrestadoresSinCalif'
CARTILLAS = {'NU2': 'SMG01', 'NU3': 'SMG02', 'CL1': 'SMG10', 'CLE': 'SMG20', 'CLS': 'SMG30'}
ORDEN_PLANES = ['SMG01', 'SMG02', 'SMG10', 'SMG20', 'SMG30']
# (tipo de búsqueda del buscador, especialidad, sección, etiqueta de servicio)
BUSQUEDAS = [
    ('3', 'Internación', 'internacion', 'Internación'),
    ('3', 'Internación Pediátrica', 'internacion', 'Internación pediátrica'),
    ('3', 'Internación Hospitales Públicos', 'internacion', 'Hospital público'),
    ('2', 'Clínica Médica', 'guardia', 'Guardia clínica'),
    ('2', 'Pediatría', 'guardia', 'Guardia pediátrica'),
    ('2', 'Traumatología y Ortopedia', 'guardia', 'Guardia traumatológica'),
    ('2', 'Ginecología', 'guardia', 'Guardia ginecológica'),
    ('2', 'Obstetricia', 'guardia', 'Guardia obstétrica'),
    ('2', 'Cardiología', 'guardia', 'Guardia cardiológica'),
    ('2', 'Oftalmología', 'guardia', 'Guardia oftalmológica'),
]
PROVINCIAS = {
    'CAPITAL FEDERAL': 'Ciudad de Buenos Aires', 'BUENOS AIRES': 'Buenos Aires', 'CATAMARCA': 'Catamarca', 'CHACO': 'Chaco',
    'CHUBUT': 'Chubut', 'CORDOBA': 'Córdoba', 'CORRIENTES': 'Corrientes', 'ENTRE RIOS': 'Entre Ríos', 'FORMOSA': 'Formosa',
    'JUJUY': 'Jujuy', 'LA PAMPA': 'La Pampa', 'LA RIOJA': 'La Rioja', 'MENDOZA': 'Mendoza', 'MISIONES': 'Misiones',
    'NEUQUEN': 'Neuquén', 'RIO NEGRO': 'Río Negro', 'SALTA': 'Salta', 'SAN JUAN': 'San Juan', 'SAN LUIS': 'San Luis',
    'SANTA CRUZ': 'Santa Cruz', 'SANTA FE': 'Santa Fe', 'SANTIAGO DEL ESTERO': 'Santiago del Estero',
    'TIERRA DEL FUEGO': 'Tierra del Fuego', 'TUCUMAN': 'Tucumán',
}
ZONAS_AMBA = {'ZONA NORTE': ('GBA Zona Norte', 'gba-zona-norte'), 'ZONA SUR': ('GBA Zona Sur', 'gba-zona-sur'),
              'ZONA OESTE': ('GBA Zona Oeste', 'gba-zona-oeste'), 'ZONA NOROESTE': ('GBA Zona Noroeste', 'gba-zona-noroeste')}
# Swiss manda todo en mayúsculas y sin tildes: nombres correctos de las
# localidades más buscadas (geografía pública). El resto se pasa a tipo título.
TILDES = {
    'CORDOBA': 'Córdoba', 'RIO CUARTO': 'Río Cuarto', 'VILLA MARIA': 'Villa María', 'BAHIA BLANCA': 'Bahía Blanca',
    'OLAVARRIA': 'Olavarría', 'JUNIN': 'Junín', 'ZARATE': 'Zárate', 'LUJAN': 'Luján', 'PARANA': 'Paraná',
    'GUALEGUAYCHU': 'Gualeguaychú', 'CONCEPCION DEL URUGUAY': 'Concepción del Uruguay', 'NEUQUEN': 'Neuquén',
    'SAN MIGUEL DE TUCUMAN': 'San Miguel de Tucumán', 'TUCUMAN': 'Tucumán', 'SAN NICOLAS': 'San Nicolás',
    'SAN NICOLAS DE LOS ARROYOS': 'San Nicolás de los Arroyos', 'RIO GALLEGOS': 'Río Gallegos', 'RIO GRANDE': 'Río Grande',
    'SAN CARLOS DE BARILOCHE': 'San Carlos de Bariloche', 'GUAYMALLEN': 'Guaymallén', 'MAIPU': 'Maipú',
    'CONCEPCION': 'Concepción', 'OBERA': 'Oberá', 'CIPOLLETTI': 'Cipolletti', 'VILLA GOBERNADOR GALVEZ': 'Villa Gobernador Gálvez',
    'SANTA ROSA': 'Santa Rosa', 'PERGAMINO': 'Pergamino', 'CAÑUELAS': 'Cañuelas', 'JESUS MARIA': 'Jesús María',
    'RIO TERCERO': 'Río Tercero', 'SAN FERNANDO DEL VALLE DE CATAMARCA': 'San Fernando del Valle de Catamarca',
    'SAN FDO DEL VALLE DE CATAMARCA': 'San Fernando del Valle de Catamarca', 'PRESIDENCIA ROQUE SAENZ PEÑA': 'Presidencia Roque Sáenz Peña',
    'SAN SALVADOR DE JUJUY': 'San Salvador de Jujuy', 'VILLA ANGELA': 'Villa Ángela', 'POSADAS': 'Posadas',
}
MINUS = {'de', 'del', 'la', 'las', 'los', 'y', 'el', 'e'}


def titulo(s):
    s = re.sub(r'\s+', ' ', (s or '').strip())
    if s.upper() in TILDES:
        return TILDES[s.upper()]
    return ' '.join(w.lower() if i and w.lower() in MINUS else w.capitalize() for i, w in enumerate(s.lower().split()))


def clave(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def nombre_centro(s):
    # Si ya viene en mayúsculas/minúsculas se respeta el nombre oficial; si
    # viene todo en mayúsculas, tipo título respetando siglas y conectores.
    s = re.sub(r'\s+', ' ', (s or '').strip())
    if s != s.upper():
        return s
    out = []
    for i, w in enumerate(s.split()):
        if re.fullmatch(r'[A-Z]{2,5}|[A-Z](\.[A-Z])+\.?|S\.?R\.?L\.?|S\.?A\.?|I{1,3}', w) and w not in (
                'DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y', 'SAN', 'DR', 'DRA', 'SANTA', 'CLINICA', 'CASA', 'VIDA', 'SUR', 'NORTE'):
            out.append(w)
        elif i and w.lower() in MINUS:
            out.append(w.lower())
        else:
            out.append(w.capitalize())
    return ' '.join(out)


def pedir(tipo, carti, esp, prov=''):
    q = urllib.parse.urlencode({'tipo': tipo, 'pt': '', 'd': '', 'carti': carti, 'especialidad': esp, 'deno_prov': prov,
                                'deno_loca': '', 'deno_barr': '', 'deno_part': '', 'ape_razon': ''}, quote_via=urllib.parse.quote)
    req = urllib.request.Request(f'{API}?{q}', headers={'User-Agent': 'Mozilla/5.0', 'Origin': 'https://www.swissmedical.com.ar'})
    for intento in range(4):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.loads(r.read().decode('utf-8'))['response']
        except Exception as e:
            print('  reintento', intento, e, flush=True)
            time.sleep(15 * (intento + 1))
    raise RuntimeError(f'fallo {tipo} {carti} {esp} {prov}')


def descargar(raw):
    os.makedirs(raw, exist_ok=True)
    for carti in CARTILLAS:
        for tipo, esp, _, _ in BUSQUEDAS:
            f = os.path.join(raw, f'{carti}__{clave(esp)}.json')
            if os.path.exists(f):
                continue
            r = pedir(tipo, carti, esp)
            docs = r['docs']
            if r['numFound'] > len(docs):
                docs = []
                for prov in PROVINCIAS:
                    rp = pedir(tipo, carti, esp, prov)
                    if rp['numFound'] > len(rp['docs']):
                        print('  OJO: sigue truncado', carti, esp, prov, rp['numFound'], flush=True)
                    docs += rp['docs']
                    time.sleep(1)
            json.dump({'carti': carti, 'especialidad': esp, 'numFound': r['numFound'], 'docs': docs},
                      open(f, 'w', encoding='utf-8'), ensure_ascii=False)
            print(carti, esp, r['numFound'], len(docs), flush=True)
            time.sleep(1)


def zona_de(doc):
    prov = (doc.get('deno_prov') or '').strip().upper()
    if prov == 'CAPITAL FEDERAL':
        return 'Ciudad de Buenos Aires', 'caba', ['Ciudad de Buenos Aires']
    z = (doc.get('zona') or '').strip().upper()
    if (doc.get('region') or '').startswith('CAPITAL FEDERAL Y GRAN BUENOS AIRES') and z in ZONAS_AMBA:
        nombre, slug = ZONAS_AMBA[z]
        return nombre, slug, ['Buenos Aires']
    loca = titulo(doc.get('deno_loca') or doc.get('deno_part') or '')
    provincia = PROVINCIAS.get(prov, titulo(prov))
    return loca, clave(loca), [provincia]


def generar(raw, salida):
    zonas = {}
    for carti, plan in CARTILLAS.items():
        for tipo, esp, seccion, servicio in BUSQUEDAS:
            d = json.load(open(os.path.join(raw, f'{carti}__{clave(esp)}.json'), encoding='utf-8'))
            for doc in d['docs']:
                if doc.get('Prestad_Tipo_Deno') != 'Institución':
                    continue  # solo instituciones, nunca profesionales particulares
                nombre_z, slug, provincias = zona_de(doc)
                if not slug:
                    continue
                if slug in zonas and zonas[slug]['provincias'] != provincias:
                    slug = f'{slug}-{clave(provincias[0])}'
                z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre_z, 'provincias': provincias, 'centros': {}})
                nom = nombre_centro(doc.get('ape_razon'))
                c = z['centros'].setdefault(clave(nom), {'nombre': nom, 'internacion': [], 'guardia': [], 'marca': None,
                                                        'notas': [], 'servicios': [], 'sedes': []})
                if plan not in c[seccion]:
                    c[seccion].append(plan)
                if servicio not in c['servicios']:
                    c['servicios'].append(servicio)
                if doc.get('Centro_Propio') and 'Centro propio de Swiss Medical' not in c['notas']:
                    c['notas'].append('Centro propio de Swiss Medical')
                calle = ' '.join(x for x in [titulo(doc.get('calle')), (doc.get('numero') or '').strip()] if x) or None
                sede = next((s for s in c['sedes'] if clave(s['direccion']) == clave(calle)), None)
                if sede is None:
                    # en CABA la localidad es siempre "Ciudad Autónoma...": se usa el barrio
                    caba = (doc.get('deno_prov') or '').strip().upper() == 'CAPITAL FEDERAL'
                    loca = titulo(doc.get('deno_barr') if caba else doc.get('deno_loca') or '') or None
                    tel = re.sub(r'\s+', ' ', (doc.get('tele') or '').strip()) or None
                    sede = {'direccion': calle, 'localidad': loca, 'tel': tel, 'servicios': []}
                    c['sedes'].append(sede)
                if seccion not in sede['servicios']:
                    sede['servicios'].append(seccion)
    orden_serv = [b[3] for b in BUSQUEDAS]
    salida_zonas = []
    for z in zonas.values():
        centros = list(z['centros'].values())
        for c in centros:
            c['internacion'] = [p for p in ORDEN_PLANES if p in c['internacion']]
            c['guardia'] = [p for p in ORDEN_PLANES if p in c['guardia']]
            c['servicios'] = sorted(c['servicios'], key=orden_serv.index)
        centros.sort(key=lambda c: (not c['internacion'], clave(c['nombre'])))
        salida_zonas.append({**z, 'centros': centros})
    out = {'fuente': 'Buscador oficial de cartilla de Swiss Medical (swissmedical.com.ar/prepagaclientes/cartilla)',
           'vigencia': [date.today().strftime('%d/%m/%Y')], 'planes': ORDEN_PLANES, 'faltantes': [], 'zonas': salida_zonas}
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'centros')


if __name__ == '__main__':
    {'descargar': lambda: descargar(sys.argv[2]), 'generar': lambda: generar(sys.argv[2], sys.argv[3])}[sys.argv[1]]()
