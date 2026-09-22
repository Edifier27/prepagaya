"""Genera lib/data/cartilla-zonas/avalian.json desde lo que bajó scrape.py.

Uso: python generar.py <carpeta_raw> ../../lib/data/cartilla-zonas/avalian.json
"""
import json, os, re, sys, glob, unicodedata
from datetime import date

# Credencial (nivel de cartilla) → id de plan. Los códigos AS salen del
# endpoint público de copagos del cotizador oficial (CERCA AS100, INTEGRAL
# AS200/AS204, SUPERIOR AS300, SELECTA AS400/AS500).
PLANES = {'CERCA': 'Cerca', 'INTEGRAL': 'Integral', 'SUPERIOR': 'Superior', 'SELECTA': 'Selecta', 'CLASICA': 'Clásica'}
ORDEN_PLANES = ['Cerca', 'Integral', 'Superior', 'Selecta', 'Clásica']

PROVINCIAS = {
    'B': 'Buenos Aires', 'C': 'Ciudad de Buenos Aires', 'K': 'Catamarca', 'H': 'Chaco', 'U': 'Chubut', 'X': 'Córdoba',
    'W': 'Corrientes', 'E': 'Entre Ríos', 'P': 'Formosa', 'Y': 'Jujuy', 'L': 'La Pampa', 'F': 'La Rioja', 'M': 'Mendoza',
    'N': 'Misiones', 'Q': 'Neuquén', 'R': 'Río Negro', 'A': 'Salta', 'J': 'San Juan', 'D': 'San Luis', 'Z': 'Santa Cruz',
    'S': 'Santa Fe', 'G': 'Santiago del Estero', 'V': 'Tierra del Fuego', 'T': 'Tucumán',
}
ZONAS_GBA = {
    'GBA_N': ('GBA Zona Norte', 'gba-zona-norte'),
    'GBA_O': ('GBA Zona Oeste', 'gba-zona-oeste'),
    'GBA_SE': ('GBA Zona Sudeste', 'gba-zona-sudeste'),
    'GBA_SO': ('GBA Zona Sudoeste', 'gba-zona-sudoeste'),
}
# Avalian manda los nombres en mayúsculas y sin tildes: nombre correcto de
# las localidades que se muestran (geografía pública).
NOMBRES = {
    'CAPITAL FEDERAL': 'Ciudad de Buenos Aires', 'CORDOBA': 'Córdoba', 'RIO CUARTO': 'Río Cuarto', 'VILLA MARIA': 'Villa María',
    'RIO TERCERO': 'Río Tercero', 'JESUS MARIA': 'Jesús María', 'BAHIA BLANCA': 'Bahía Blanca', 'OLAVARRIA': 'Olavarría',
    'JUNIN': 'Junín', 'ZARATE': 'Zárate', 'LUJAN': 'Luján', 'SAN NICOLAS DE LOS ARROYOS': 'San Nicolás de los Arroyos',
    'GUAYMALLEN': 'Guaymallén', 'MAIPU': 'Maipú', 'SAN MIGUEL DE TUCUMAN': 'San Miguel de Tucumán',
    'BANDA DEL RIO SALI': 'Banda del Río Salí', 'CONCEPCION': 'Concepción', 'TAFI VIEJO': 'Tafí Viejo',
    'SAN RAMON DE LA NUEVA ORAN': 'San Ramón de la Nueva Orán', 'PALPALA': 'Palpalá', 'PARANA': 'Paraná',
    'GUALEGUAYCHU': 'Gualeguaychú', 'CONCEPCION DEL URUGUAY': 'Concepción del Uruguay', 'POSADAS (EXTENSION)': 'Posadas',
    'OBERA': 'Oberá', 'PRESIDENCIA ROQUE SAENZ PEÑA': 'Presidencia Roque Sáenz Peña', 'NEUQUEN': 'Neuquén',
    'CUTRAL CO': 'Cutral Có', 'SAN CARLOS DE BARILOCHE': 'San Carlos de Bariloche', 'RIO GALLEGOS': 'Río Gallegos',
    'RIO GRANDE': 'Río Grande', 'SANTA LUCIA': 'Santa Lucía', 'S. F. DEL VALLE DE CATAMARCA': 'San Fernando del Valle de Catamarca',
    'TERMAS DE RIO HONDO': 'Termas de Río Hondo', 'VILLA GOBERNADOR GALVEZ': 'Villa Gobernador Gálvez',
}
MINUS = {'de', 'del', 'la', 'las', 'los', 'y', 'el'}


def titulo(s):
    s = (s or '').strip()
    if s.upper() in NOMBRES:
        return NOMBRES[s.upper()]
    return ' '.join(w.lower() if i and w.lower() in MINUS else w.capitalize() for i, w in enumerate(s.lower().split()))


def clave(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def limpio(s):
    s = re.sub(r'\s+', ' ', str(s or '').replace('\u00a0', ' ')).strip()
    return s or None


def nombre_centro(s):
    # Avalian manda todo en mayúsculas: se pasa a tipo título pero se
    # respetan siglas cortas (IMAC, CEMIC, S.A., SRL).
    s = limpio(s) or ''
    if s != s.upper():
        return s  # ya viene en mayúsculas/minúsculas: se respeta el nombre oficial
    out = []
    for i, w in enumerate(s.split()):
        if re.fullmatch(r'[A-Z]{2,5}|[A-Z](\.[A-Z])+\.?|S\.?R\.?L\.?|S\.?A\.?', w) and w not in ('DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y', 'SAN', 'DR', 'DRA'):
            out.append(w)
        elif i and w.lower() in MINUS:
            out.append(w.lower())
        else:
            out.append(w.capitalize())
    return ' '.join(out)


# En "Servicio de Guardia" Avalian mezcla profesionales individuales
# ("Correa MARIA Virginia"). Solo publicamos instituciones (decisión de
# Darío): se descarta todo lo que tiene forma de nombre de persona y no tiene
# internación. Se imprime la lista descartada para revisarla en cada corrida.
INSTITUCION = re.compile(
    r'(cl[ií]nic|sanat|hosp|inst|centr|fund|polic|servic|asoc|coop|m[eé]dic|salud|emerg|urgen|grupo|srl|\bs\.?a\.?\b|'
    r'diagn|mater|odont|emprend|c[ií]rculo|respirat|visi[oó]n|ojos|neonat|pediat|cardio|trauma|kids|dont|med\b)', re.I)
PERSONA = re.compile(r"^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ']+(?: (?:[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ']*\.?|\(h\))){1,4}$")


def es_persona(c):
    return not c['internacion'] and bool(PERSONA.match(c['nombre'])) and not INSTITUCION.search(c['nombre'])


def main(raw, salida):
    zonas = {}
    for f in sorted(glob.glob(os.path.join(raw, '*__*__*__*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        prov, loc, plan, seccion = d['provincia'], d['localidad'], PLANES[d['credencial']], d['clase']
        if prov in ZONAS_GBA:
            nombre, slug = ZONAS_GBA[prov]
            provincias = ['Buenos Aires']
        else:
            nombre = titulo(loc)
            slug = 'caba' if prov == 'C' else clave(nombre)
            provincias = [PROVINCIAS[prov]]
        if slug in zonas and zonas[slug]['provincias'] != provincias:
            slug = f'{slug}-{clave(provincias[0])}'
        z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre, 'provincias': provincias, 'centros': {}})
        for row in d['cartilla']:
            nom = nombre_centro(row.get('nombre'))
            if not nom:
                continue
            c = z['centros'].setdefault(clave(nom), {
                'nombre': nom, 'internacion': [], 'guardia': [], 'marca': None, 'notas': [], 'sedes': []})
            if plan not in c[seccion]:
                c[seccion].append(plan)
            dire = limpio(row.get('domicilio'))
            sede = next((s for s in c['sedes'] if clave(s['direccion']) == clave(dire)), None)
            if sede is None:
                sede = {'direccion': dire, 'localidad': titulo(row.get('localidad')) or None,
                        'tel': limpio(row.get('telefono')), 'servicios': []}
                c['sedes'].append(sede)
            if seccion not in sede['servicios']:
                sede['servicios'].append(seccion)
    salida_zonas = []
    descartados = []
    for z in zonas.values():
        centros = [c for c in z['centros'].values() if not es_persona(c)]
        descartados += [f"{z['slug']}: {c['nombre']}" for c in z['centros'].values() if es_persona(c)]
        if not centros:
            continue
        for c in centros:
            c['internacion'] = [p for p in ORDEN_PLANES if p in c['internacion']]
            c['guardia'] = [p for p in ORDEN_PLANES if p in c['guardia']]
        centros.sort(key=lambda c: (not c['internacion'], clave(c['nombre'])))
        salida_zonas.append({**z, 'centros': centros})
    out = {
        'fuente': 'Buscador oficial de cartilla de Avalian (avalian.com/cartilla)',
        'vigencia': [date.today().strftime('%d/%m/%Y')],
        'planes': ORDEN_PLANES,
        'faltantes': [],
        'zonas': salida_zonas,
    }
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'centros')
    print('descartados (profesionales individuales):', len(descartados))
    for d in descartados:
        print('   ', d)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
