"""Arma lib/data/sindicales-cartillas/{slug}.json con la cartilla oficial de
cada obra social sindical, a partir del Anexo III de la Res. SSSalud 2165/2021
que la propia obra social publica en su web (ver FUENTES).

Reglas (Darío, 1-oct-2026):
- Solo instituciones con nombre: sanatorios/clínicas (internación), guardias y
  centros de diagnóstico. Nada de médicos: un prestador se nombra solo si su
  nombre es de institución (ver institucional()); el resto se cuenta.
- Sin correos electrónicos. Teléfonos solo si son válidos tal como se publicaron.
- "Centro de infertilidad" solo se marca en centros que declararon pocas
  especialidades de diagnóstico (<= 6): hay planillas que tildan las 20 en
  todos los centros, y ahí el dato no dice nada.

Uso: python generar.py            (descarga lo que falte en fuentes/ y regenera)
     python generar.py osdop      (solo esa)
"""
import collections
import datetime
import json
import os
import re
import sys
import unicodedata
import urllib.request

from anexo3 import leer

AQUI = os.path.dirname(os.path.abspath(__file__))
DESTINO = os.path.join(AQUI, '..', '..', 'lib', 'data', 'sindicales-cartillas')
CACHE = os.path.join(AQUI, 'fuentes')

FUENTES = {
    'osba-bancarios': {
        'url': 'https://www.osssb.com/imagenes/anexos/ANEXO%20III%20-%20CARTILLA%20MEDICA%202025-2026.xlsx',
        'pagina': 'https://www.osssb.com/',
        'archivo': 'bancarios.xlsx',
    },
    'construir-salud': {
        'url': 'https://www.construirsalud.com.ar/pdf/cartilla_anexo_III-2026.xlsx',
        'pagina': 'https://www.construirsalud.com.ar/',
        'archivo': 'construir-salud.xlsx',
    },
    'osmedica': {
        'url': 'https://osmedica.com.ar/download/anexo-iii/?wpdmdl=4463',
        'pagina': 'https://osmedica.com.ar/cartillas-prestacionales-aprobadas-por-la-sss/',
        'archivo': 'osmedica.xlsx',
    },
    'ospes': {
        'url': 'https://ospes.org.ar/Files/123008_-_anexo_iii_-_res._2165-21_1.xlsx',
        'pagina': 'https://ospes.org.ar/',
        'archivo': 'ospes.xlsx',
    },
    'osdop': {
        'url': 'https://www.osdop.org.ar/formularios/cartilla/2026/106302_Anexo-III-Res.2165-21.pdf',
        'pagina': 'https://www.osdop.org.ar/',
        'archivo': 'osdop.pdf',
    },
    'osperyh': {
        'url': 'https://osperyh.org.ar/wp-content/uploads/2026/07/106500_ANEXO_III.pdf',
        'pagina': 'https://osperyh.org.ar/procedimientos-y-cartilla-aprobados-por-superintendencia-de-servicios-de-salud/',
        'archivo': 'osperyh.pdf',
    },
}

PROVINCIAS = {
    'buenos aires': ('buenos-aires', 'Buenos Aires'),
    'ciudad autonoma de buenos aires': ('caba', 'CABA'),
    'caba': ('caba', 'CABA'),
    'capital federal': ('caba', 'CABA'),
    'catamarca': ('catamarca', 'Catamarca'),
    'chaco': ('chaco', 'Chaco'),
    'chubut': ('chubut', 'Chubut'),
    'cordoba': ('cordoba', 'Córdoba'),
    'corrientes': ('corrientes', 'Corrientes'),
    'entre rios': ('entre-rios', 'Entre Ríos'),
    'formosa': ('formosa', 'Formosa'),
    'jujuy': ('jujuy', 'Jujuy'),
    'jujy': ('jujuy', 'Jujuy'),
    'la pampa': ('la-pampa', 'La Pampa'),
    'la rioja': ('la-rioja', 'La Rioja'),
    'mendoza': ('mendoza', 'Mendoza'),
    'misiones': ('misiones', 'Misiones'),
    'neuquen': ('neuquen', 'Neuquén'),
    'rio negro': ('rio-negro', 'Río Negro'),
    'salta': ('salta', 'Salta'),
    'san juan': ('san-juan', 'San Juan'),
    'san luis': ('san-luis', 'San Luis'),
    'santa cruz': ('santa-cruz', 'Santa Cruz'),
    'santa fe': ('santa-fe', 'Santa Fe'),
    'santiago del estero': ('santiago-del-estero', 'Santiago del Estero'),
    'tierra del fuego': ('tierra-del-fuego', 'Tierra del Fuego'),
    'isla grande de tierra del fuego': ('tierra-del-fuego', 'Tierra del Fuego'),
    'tucuman': ('tucuman', 'Tucumán'),
}

# Tipo de prestador del Anexo III -> clave corta
TIPOS = {
    'establecimiento con internacion': 'internacion',
    'centros de urgencia o emergencia': 'guardia',
    'centros de diagnostico y tratamiento': 'diagnostico',
    'centro de diagnostico y tratamiento': 'diagnostico',
    'ambulatorio/especialista': 'ambulatorio',
    'ambulotorio/especialista': 'ambulatorio',
    'consulta ambulatoria': 'ambulatorio',
    'farmacia': 'farmacia',
    'optica': 'optica',
    'ortopedia': 'ortopedia',
}

# Un prestador se nombra solo si el nombre es claramente de una institución.
# El CUIT no alcanza: hay obras sociales que cargan a cada médico con el CUIT
# del círculo o la clínica donde atiende (OSDOP, por ejemplo).
_INSTITUCIONAL = re.compile(
    r'\b(sanatori|clinic|hospital|centro|instituto|policlinic|policonsultori|laboratori|diagnostic|fundacion|asociacion|'
    r'cooperativa|mutual|circulo|colegio|federacion|sociedad|grupo|medic|salud|imagen|radiolog|ecograf|tomograf|resonancia|'
    r'unidad|servicio|maternidad|emergencia|urgencia|cemic|nuclear|dialisis|oncolog|cardio|nefro|oftalm|ojos|vision|'
    r'diagnos|densit|mamograf|rehabilita|kinesi|odontolog|sede|delegacion|consultorios|complejo|polo|cruz roja)'
    r'|\b(sa|s\.a\.?|srl|s\.r\.l\.?|sas|ute|scs|sac|saic|ltda|limitada)(\W|$)')


def nombre_publicable(nombre):
    """Saca los paréntesis que no suman: "()", "(30d)", "(Juan Alberto)",
    "( Realico- la Pampa)". Quedan la red o la institución: "(Fecliba)",
    "(Sanatorio Laprida)"."""
    def paren(m):
        dentro = m.group(1).strip()
        if dentro and not re.search(r'\d', dentro) and (institucional(dentro) or (len(dentro.split()) == 1 and '-' not in dentro)):
            return f' ({dentro})'
        return ''
    nombre = re.sub(r'\s*\d{11}\s*$', '', nombre)  # CUIT pegado al final
    return re.sub(r'\s*\(([^)]*)\)\s*', lambda m: paren(m) + ' ', nombre).strip()


def institucional(nombre):
    # "Romano Maria (Circulo Bioquimico de Junin)": el paréntesis es dónde atiende, no quién es
    n = clave(re.sub(r'\([^)]*\)?', '', nombre))
    return bool(_INSTITUCIONAL.search(n)) and not re.search(r'\b(dr|dra|lic)\b\.?', n)


def sin_tildes(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


def clave(s):
    return re.sub(r'\s+', ' ', sin_tildes(s or '').lower()).strip()


def provincia(s):
    c = re.sub(r'\s+provincia$', '', clave(s))
    return PROVINCIAS.get(c)


_MINUS = {'de', 'del', 'la', 'las', 'los', 'y', 'e', 'el', 'en', 'a'}
_MAYUS = {'sa', 's.a.', 's.a', 'srl', 's.r.l.', 's.r.l', 'sas', 'ute', 'scs', 'sac', 'saic', 'ii', 'iii', 'iv', 'cemic', 'osde', 'osperyh', 'osdop',
          'osmedica', 'ospes', 'uom', 'uocra', 'ioma', 'pami', 'dr', 'dra'}


def titulo(s):
    s = re.sub(r'\s+', ' ', re.sub(r'\(cid:\d+\)', '', s or '').strip())
    if not s:
        return s
    # "CLiNICA": el PDF a veces baja a minúscula la vocal acentuada
    s = re.sub(r'(?<=[A-Z])([a-zñ])(?=[A-Z])', lambda m: m.group(1).upper(), s)
    if s != s.upper():
        # Mixto ("Clinica Parra (PROACTIVA SALUD)"): solo se ajustan las partes en mayúsculas
        return re.sub(r'\b[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,})*\b', lambda m: titulo(m.group(0)) if len(m.group(0)) > 3 else m.group(0), s)
    out = []
    for i, p in enumerate(s.split(' ')):
        l = p.lower()
        if l.strip('().,') in _MAYUS and l not in ('dr', 'dra'):
            out.append(p)
        elif re.fullmatch(r'[ivx]+', l.strip('().,')) and len(l.strip('().,')) > 1:
            out.append(p.upper())
        elif i and l in _MINUS:
            out.append(l)
        else:
            out.append(re.sub(r'(^|[-(/"])([a-zñáéíóú])', lambda m: m.group(1) + m.group(2).upper(), l))
    return ' '.join(out).replace('Dr ', 'Dr. ').replace('Dra ', 'Dra. ')


def telefono(t):
    t = (t or '').strip()
    if not t or 'E+' in t.upper():
        return None
    if len(re.sub(r'\D', '', t)) < 7:
        return None
    return t


def descargar(slug, f):
    os.makedirs(CACHE, exist_ok=True)
    ruta = os.path.join(CACHE, f['archivo'])
    if not os.path.exists(ruta):
        print('descargando', f['url'])
        req = urllib.request.Request(f['url'], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=120) as r, open(ruta, 'wb') as out:
            out.write(r.read())
    return ruta


def caratula_xlsx(ruta):
    """RNAS, vigencia y beneficiarios de la carátula (si la planilla la trae)."""
    import openpyxl
    wb = openpyxl.load_workbook(ruta, read_only=True, data_only=True)
    datos = {}
    for ws in wb.worksheets[:2]:
        for fila in ws.iter_rows(values_only=True, max_row=8):
            vals = [v for v in fila if v is not None]
            for i, v in enumerate(vals):
                t = str(v)
                if t.startswith('RNAS') and i + 1 < len(vals) and str(vals[i + 1]).isdigit():
                    datos['rnas'] = str(vals[i + 1])
                if t.startswith('PER') and 'VIGENCIA' in t and i + 1 < len(vals) and re.match(r'^\d{4}', str(vals[i + 1])):
                    datos['vigencia'] = str(vals[i + 1]).replace('/', '-')
                if 'TOTAL DE BENEFICIARIOS' in t and i + 1 < len(vals) and isinstance(vals[i + 1], (int, float)):
                    datos['beneficiarios'] = int(vals[i + 1])
    return datos


def caratula_pdf(ruta):
    import pdfplumber
    datos = {}
    with pdfplumber.open(ruta) as pdf:
        texto = (pdf.pages[0].extract_text() or '') + '\n' + (pdf.pages[1].extract_text() or '')
    m = re.search(r'RNAS:\s*(\d{6})', texto)
    if m:
        datos['rnas'] = m.group(1)
    m = re.search(r'VIGENCIA:\s*(\d{4}[-/]\d{4})', texto)
    if m:
        datos['vigencia'] = m.group(1).replace('/', '-')
    m = re.search(r'BENEFICIARIOS:\s*(\d{3,})', texto)
    if m:
        datos['beneficiarios'] = int(m.group(1))
    return datos


def generar(slug):
    f = FUENTES[slug]
    ruta = descargar(slug, f)
    # Leer el PDF de OSDOP lleva ~15 minutos: se cachean las filas leídas
    cache = ruta + '.filas.json'
    if os.path.exists(cache) and os.path.getmtime(cache) > os.path.getmtime(ruta):
        with open(cache, encoding='utf-8') as fh:
            filas = json.load(fh)
    else:
        filas = leer(ruta)
        with open(cache, 'w', encoding='utf-8') as fh:
            json.dump(filas, fh, ensure_ascii=False)
    car =caratula_pdf(ruta) if ruta.endswith('.pdf') else caratula_xlsx(ruta)

    # Entidad = mismo prestador en el mismo domicilio
    entidades = {}
    descartadas = collections.Counter()
    for r in filas:
        tipo = TIPOS.get(clave(r['tipo']))
        prov = provincia(r['provincia'])
        if not tipo or not prov:
            descartadas['tipo' if not tipo else 'provincia'] += 1
            continue
        cuit = re.sub(r'\D', '', r['cuit'])
        k = (cuit, clave(r['nombre']), clave(r['domicilio']), clave(r['localidad']), prov[0])
        loc = r['localidad'] or r['partido']
        # "General Jose de San MartinEmbarcacion": partido pegado a la localidad
        m = re.search(r'[a-z]([A-Z][a-z].*)$', loc)
        if m:
            loc = m.group(1)
        e = entidades.setdefault(k, {
            'nombre': r['nombre'], 'cuit': cuit, 'prov': prov, 'partido': r['partido'], 'localidad': loc,
            'domicilio': r['domicilio'], 'telefono': telefono(r['telefono']), 'tipos': set(), 'esp': set(), 'esp_diag': set(),
        })
        e['tipos'].add(tipo)
        e['esp'].add(clave(r['especialidad']))
        if tipo == 'diagnostico':
            e['esp_diag'].add(clave(r['especialidad']))

    def infertilidad(e):
        return 'centro de infertilidad' in e['esp_diag'] and len(e['esp_diag']) <= 6

    por_prov = {}
    for e in entidades.values():
        ps, pn = e['prov']
        p = por_prov.setdefault(ps, {'slug': ps, 'nombre': pn, 'instituciones': [], 'profesionales': 0,
                                     'especialidades': collections.Counter(), 'farmacias': 0, 'opticas': 0, 'ortopedias': 0})
        persona = not institucional(e['nombre'])
        for t, campo in (('farmacia', 'farmacias'), ('optica', 'opticas'), ('ortopedia', 'ortopedias')):
            if t in e['tipos']:
                p[campo] += 1
        inst = e['tipos'] & {'internacion', 'guardia', 'diagnostico'}
        if persona and (inst or 'ambulatorio' in e['tipos']):
            p['profesionales'] += 1
            esp = [s for s in e['esp'] if s]
            if len(esp) <= 4:  # quien tilda todo no cuenta por especialidad
                for s in esp:
                    p['especialidades'][s] += 1
        if inst and not persona:
            item = {
                'n': titulo(nombre_publicable(e['nombre'])),
                'loc': titulo(e['localidad']),
                't': [t for t in ('internacion', 'guardia', 'diagnostico') if t in inst],
            }
            if e['domicilio']:
                item['dom'] = titulo(e['domicilio'])
            if e['telefono']:
                item['tel'] = e['telefono']
            if infertilidad(e):
                item['inf'] = True
            p['instituciones'].append(item)

    # Nombres de especialidad tal como los escribe la SSSalud, con tildes
    provincias = []
    for p in por_prov.values():
        orden = {'internacion': 0, 'guardia': 1, 'diagnostico': 2}
        unicas = {}
        for i in p['instituciones']:
            k = (clave(i['n']), clave(i['loc']), clave(i.get('dom', '')))
            if k in unicas:
                u = unicas[k]
                u['t'] = [t for t in ('internacion', 'guardia', 'diagnostico') if t in u['t'] or t in i['t']]
                u['inf'] = u.get('inf') or i.get('inf')
                if not u['inf']:
                    u.pop('inf', None)
                u.setdefault('tel', i.get('tel'))
                if not u['tel']:
                    u.pop('tel')
            else:
                unicas[k] = i
        p['instituciones'] = list(unicas.values())
        p['instituciones'].sort(key=lambda i: (orden[i['t'][0]], clave(i['loc']), clave(i['n'])))
        p['especialidades'] = dict(p['especialidades'].most_common())
        if p['instituciones'] or p['profesionales'] or p['farmacias']:
            provincias.append(p)
    provincias.sort(key=lambda p: -(len(p['instituciones']) * 5 + p['profesionales'] + p['farmacias']))

    salida = {
        'slug': slug,
        'fuente': f['url'],
        'paginaFuente': f['pagina'],
        'norma': 'Resolución 2165/2021 de la Superintendencia de Servicios de Salud, Anexo III',
        'descargado': datetime.date.today().isoformat(),
        **car,
        'provincias': provincias,
    }
    os.makedirs(DESTINO, exist_ok=True)
    with open(os.path.join(DESTINO, f'{slug}.json'), 'w', encoding='utf-8') as out:
        json.dump(salida, out, ensure_ascii=False, separators=(',', ':'))
    tot = collections.Counter()
    for p in provincias:
        for i in p['instituciones']:
            for t in i['t']:
                tot[t] += 1
        tot['profesionales'] += p['profesionales']
        tot['farmacias'] += p['farmacias']
    print(slug, len(filas), 'filas;', dict(tot), 'provincias', len(provincias), 'descartadas', dict(descartadas), car)


if __name__ == '__main__':
    for s in (sys.argv[1:] or list(FUENTES)):
        generar(s)
