"""Cartilla de Sancor Salud por zona — solo instituciones (internación y guardias).

Fuente: el buscador público de sancorsalud.com.ar/cartilla-nosoyasociado, que
consulta POST https://busquedas.sancorsalud.com.ar/prestadores_gestor_prod_cartilla_web/_search
(Elasticsearch, sin credenciales: el mismo pedido que hace cualquier visitante).
Se bajan solo las categorías "CLÍNICAS CON INTERNACIÓN" y "GUARDIAS" (los
profesionales particulares están en otra categoría y no se tocan). Los nombres
de cada código de plan salen del índice público planes_web del mismo buscador.

Uso:
  python sancor.py descargar <carpeta_raw>
  python sancor.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/sancor-salud.json
"""
import json, os, re, sys, time, unicodedata, urllib.request
from datetime import date

BASE = 'https://busquedas.sancorsalud.com.ar'
CATEGORIAS = {'CLÍNICAS CON INTERNACIÓN': 'internacion', 'GUARDIAS': 'guardia'}
# Planes que se muestran (los del comparador y sus hermanos de la misma línea),
# en orden de cobertura según su numeración. Las variantes regionales (R/B),
# ON, OSUTI, F801/F802 y 800C/800V quedan fuera de los chips.
PLANES = ['F700', 'F800', 'S1000', 'S1500', 'G3000', 'S3000', 'S4000', 'S4500', 'S5000', 'S6000']
ZONAS_GBA = {
    'BUENOS AIRES - GBA ZONA NORTE': ('GBA Zona Norte', 'gba-zona-norte'),
    'BUENOS AIRES - GBA ZONA SUR': ('GBA Zona Sur', 'gba-zona-sur'),
    'BUENOS AIRES - GBA ZONA OESTE': ('GBA Zona Oeste', 'gba-zona-oeste'),
}
PROVINCIAS = {
    'BUENOS AIRES': 'Buenos Aires', 'CATAMARCA': 'Catamarca', 'CHACO': 'Chaco', 'CHUBUT': 'Chubut', 'CORDOBA': 'Córdoba',
    'CORRIENTES': 'Corrientes', 'ENTRE RIOS': 'Entre Ríos', 'FORMOSA': 'Formosa', 'JUJUY': 'Jujuy', 'LA PAMPA': 'La Pampa',
    'LA RIOJA': 'La Rioja', 'MENDOZA': 'Mendoza', 'MISIONES': 'Misiones', 'NEUQUEN': 'Neuquén', 'RIO NEGRO': 'Río Negro',
    'SALTA': 'Salta', 'SAN JUAN': 'San Juan', 'SAN LUIS': 'San Luis', 'SANTA CRUZ': 'Santa Cruz', 'SANTA FE': 'Santa Fe',
    'SANTIAGO DEL ESTERO': 'Santiago del Estero', 'TIERRA DEL FUEGO': 'Tierra del Fuego', 'TUCUMAN': 'Tucumán',
}
TILDES = {
    'CORDOBA': 'Córdoba', 'RIO CUARTO': 'Río Cuarto', 'VILLA MARIA': 'Villa María', 'BAHIA BLANCA': 'Bahía Blanca',
    'OLAVARRIA': 'Olavarría', 'JUNIN': 'Junín', 'ZARATE': 'Zárate', 'LUJAN': 'Luján', 'PARANA': 'Paraná',
    'GUALEGUAYCHU': 'Gualeguaychú', 'CONCEPCION DEL URUGUAY': 'Concepción del Uruguay', 'NEUQUEN': 'Neuquén',
    'SAN MIGUEL DE TUCUMAN': 'San Miguel de Tucumán', 'TUCUMAN': 'Tucumán', 'SAN NICOLAS': 'San Nicolás',
    'RIO GALLEGOS': 'Río Gallegos', 'RIO GRANDE': 'Río Grande', 'SAN CARLOS DE BARILOCHE': 'San Carlos de Bariloche',
    'GUAYMALLEN': 'Guaymallén', 'MAIPU': 'Maipú', 'CONCEPCION': 'Concepción', 'OBERA': 'Oberá', 'RIO TERCERO': 'Río Tercero',
    'JESUS MARIA': 'Jesús María', 'VILLA GOBERNADOR GALVEZ': 'Villa Gobernador Gálvez', 'CAÑADA DE GOMEZ': 'Cañada de Gómez',
    'SAN FERNANDO DEL VALLE DE CATAMARCA': 'San Fernando del Valle de Catamarca', 'GENERAL DEHEZA': 'General Deheza',
}
ABREV = {'SANAT.': 'Sanatorio', 'CL.': 'Clínica', 'CLIN.': 'Clínica', 'HOSP.': 'Hospital', 'INST.': 'Instituto',
         'CTRO.': 'Centro', 'CENT.': 'Centro', 'FUND.': 'Fundación', 'PRIV.': 'Privado', 'ASOC.': 'Asociación',
         'MED.': 'Médico', 'COOP.': 'Cooperativa', 'DIAG': 'Diagnóstico', 'TRAT': 'Tratamiento'}
MINUS = {'de', 'del', 'la', 'las', 'los', 'y', 'el', 'e'}


def clave(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def titulo(s):
    s = re.sub(r'\s+', ' ', (s or '').strip())
    if s.upper() in TILDES:
        return TILDES[s.upper()]
    return ' '.join(w.lower() if i and w.lower() in MINUS else w.capitalize() for i, w in enumerate(s.lower().split()))


def nombre_centro(s):
    out = []
    for i, w in enumerate(re.sub(r'\s+', ' ', (s or '').strip()).split()):
        if w.upper() in ABREV:
            out.append(ABREV[w.upper()])
        elif re.fullmatch(r'S\.?R\.?L\.?|S\.?A\.?|S\.?A\.?S\.?|[A-Z](\.[A-Z])+\.?|I{1,3}', w):
            out.append(w)
        elif i and w.lower() in MINUS:
            out.append(w.lower())
        else:
            out.append(w.capitalize())
    return ' '.join(out)


def post(indice, q):
    req = urllib.request.Request(f'{BASE}/{indice}/_search', data=json.dumps(q).encode('utf-8'),
                                 headers={'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode('utf-8'))


def descargar(raw):
    os.makedirs(raw, exist_ok=True)
    for cat in CATEGORIAS:
        d = post('prestadores_gestor_prod_cartilla_web', {'size': 5000, 'query': {'term': {'categorias.categoria.keyword': cat}}})
        assert d['hits']['total'] == len(d['hits']['hits']), 'resultado truncado'
        json.dump(d, open(os.path.join(raw, f'{clave(cat)}.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        print(cat, d['hits']['total'], flush=True)
        time.sleep(1)
    d = post('planes_web', {'size': 500})
    json.dump(d, open(os.path.join(raw, 'planes.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('planes', d['hits']['total'])


def zona_de(dom):
    prov = (dom.get('provincia') or '').strip().upper()
    if prov.startswith('CIUDAD AUTONOMA'):
        return 'Ciudad de Buenos Aires', 'caba', ['Ciudad de Buenos Aires']
    if prov in ZONAS_GBA:
        n, s = ZONAS_GBA[prov]
        return n, s, ['Buenos Aires']
    loca = titulo(dom.get('localidad'))
    return loca, clave(loca), [PROVINCIAS.get(prov, titulo(prov))]


def telefono(dom):
    tels = []
    for t in dom.get('telefonos') or []:
        n = f"({t['caracteristica']}) {t['nro_telefono']}" if t.get('caracteristica') else (t.get('nro_telefono') or '')
        if n and n not in tels:
            tels.append(n)
    return ' / '.join(tels) or None


def generar(raw, salida):
    # código interno → nombre oficial del plan según el índice planes_web
    # (ej. S3000 = "SANCOR 3500", G3000 = "SANCOR 3000"): se usa como id
    nombres = {h['_source']['codigo']: h['_source']['descripcion'].replace('SANCOR ', '').strip()
               for h in json.load(open(os.path.join(raw, 'planes.json'), encoding='utf-8'))['hits']['hits']}
    ids = [nombres[c] for c in PLANES]
    zonas = {}
    for cat, seccion in CATEGORIAS.items():
        for h in json.load(open(os.path.join(raw, f'{clave(cat)}.json'), encoding='utf-8'))['hits']['hits']:
            src = h['_source']
            planes = [nombres[p['codigo_plan_contratado']] for p in src.get('planes') or [] if p['codigo_plan_contratado'] in PLANES]
            if not planes:
                continue
            nom = nombre_centro(src['prestador'])
            vistos = set()
            # Sancor carga en cada prestador TODAS sus direcciones (consultorios
            # externos incluidos: al Hospital Británico le figuran Lomas, Lanús,
            # Quilmes...), sin decir en cuál interna o tiene guardia. Para no
            # afirmar internación donde no la hay se usa solo la dirección
            # principal: la más repetida en su ficha (empate → la primera).
            doms = src.get('domicilios') or []
            cuenta = {}
            for d0 in doms:
                k0 = (clave(d0.get('calle')), str(d0.get('nro') or ''))
                cuenta[k0] = cuenta.get(k0, 0) + 1
            principal = max(doms, key=lambda d0: cuenta[(clave(d0.get('calle')), str(d0.get('nro') or ''))], default=None)
            for dom in ([principal] if principal else []):
                nombre_z, slug, provincias = zona_de(dom)
                if not slug:
                    continue
                if slug in zonas and zonas[slug]['provincias'] != provincias:
                    slug = f'{slug}-{clave(provincias[0])}'
                z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre_z, 'provincias': provincias, 'centros': {}})
                c = z['centros'].setdefault(clave(nom), {'nombre': nom, 'internacion': [], 'guardia': [], 'marca': None,
                                                        'notas': [], 'sedes': []})
                for p in planes:
                    if p not in c[seccion]:
                        c[seccion].append(p)
                calle = ' '.join(x for x in [titulo(dom.get('calle')), str(dom.get('nro') or '').strip()] if x and x != '0') or None
                k = (slug, clave(calle))
                if k in vistos:
                    continue
                vistos.add(k)
                sede = next((s for s in c['sedes'] if clave(s['direccion']) == clave(calle)), None)
                if sede is None:
                    loca = None if slug == 'caba' else titulo(dom.get('localidad')) or None
                    sede = {'direccion': calle, 'localidad': loca, 'tel': telefono(dom), 'servicios': []}
                    c['sedes'].append(sede)
                if seccion not in sede['servicios']:
                    sede['servicios'].append(seccion)
    salida_zonas = []
    for z in zonas.values():
        centros = list(z['centros'].values())
        for c in centros:
            c['internacion'] = [p for p in ids if p in c['internacion']]
            c['guardia'] = [p for p in ids if p in c['guardia']]
        centros.sort(key=lambda c: (not c['internacion'], clave(c['nombre'])))
        salida_zonas.append({**z, 'centros': centros})
    out = {'fuente': 'Buscador oficial de cartilla de Sancor Salud (sancorsalud.com.ar/cartilla-nosoyasociado)',
           'vigencia': [date.today().strftime('%d/%m/%Y')], 'planes': ids, 'faltantes': [], 'zonas': salida_zonas}
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'centros')


if __name__ == '__main__':
    {'descargar': lambda: descargar(sys.argv[2]), 'generar': lambda: generar(sys.argv[2], sys.argv[3])}[sys.argv[1]]()
