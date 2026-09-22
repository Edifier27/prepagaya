"""Une las cartillas parseadas de todos los planes en un solo JSON por zona.

Uso: python merge.py <carpeta_pdfs> <filiales.txt> <salida.json>
"""
import json, re, sys, os, unicodedata, glob
from parse import parse_pdf

PLANES = {'21': '210', '31': '310', '41': '410', '45': '450', '51': '510', '70': 'Flux'}
ORDEN_PLANES = ['210', '310', '410', '450', '510', 'Flux']


def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def clave_nombre(s):
    return slugify(re.sub(r'\s+', ' ', s))


def titulo_filial(s):
    return ' '.join(w.capitalize() if len(w) > 3 or i == 0 else w.lower()
                    for i, w in enumerate(s.lower().split()))


def main(carpeta, filiales_txt, salida):
    # filial -> provincias (según el listado del propio buscador de OSDE)
    prov_por_filial = {}
    for m in re.finditer(r'provincia:"([^"]+)",codFilial:(\d+),filial:"([^"]+)"',
                         open(filiales_txt, encoding='utf-8').read()):
        prov, cod, nom = m.group(1), m.group(2).zfill(2), m.group(3)
        prov_por_filial.setdefault(cod, {'nombre': nom, 'provincias': []})
        if prov not in prov_por_filial[cod]['provincias']:
            prov_por_filial[cod]['provincias'].append(prov)

    zonas = {}      # (filial, zona) -> {...}
    vigencias = set()
    faltantes = []
    for cod in sorted(prov_por_filial):
        for pcod, pnom in PLANES.items():
            path = os.path.join(carpeta, f'Cartilla{cod}_{pcod}.pdf')
            if not os.path.exists(path):
                faltantes.append(f'{cod}_{pcod}')
                continue
            r = parse_pdf(path)
            if r['vigencia']:
                vigencias.add(r['vigencia'])
            for it in r['items']:
                if not it['zona'] or not it['sedes']:
                    continue
                zk = (cod, it['zona'])
                z = zonas.setdefault(zk, {'filial': cod, 'zona': it['zona'], 'centros': {}})
                ck = clave_nombre(it['nombre'])
                c = z['centros'].setdefault(ck, {
                    'nombre': it['nombre'], 'internacion': [], 'guardia': [],
                    'marca': None, 'notas': [], 'sedes': [],
                })
                lista = c[it['seccion']]
                if pnom not in lista:
                    lista.append(pnom)
                if it['seccion'] == 'internacion' and it['marca']:
                    c['marca'] = it['marca']
                for n in it['notas']:
                    if n not in c['notas'] and n != '(Atención las 24 hs.)':
                        c['notas'].append(n)
                for s in it['sedes']:
                    clave_sede = slugify(s['direccion'] or '')
                    previa = next((x for x in c['sedes'] if slugify(x['direccion'] or '') == clave_sede), None)
                    if previa is None:
                        previa = {'direccion': s['direccion'], 'localidad': s['localidad'], 'tel': s['tel'], 'servicios': []}
                        c['sedes'].append(previa)
                    if it['seccion'] not in previa['servicios']:
                        previa['servicios'].append(it['seccion'])

    # slugs de zona únicos a nivel país
    usados = {}
    salida_zonas = []
    for (cod, nombre_zona), z in sorted(zonas.items(), key=lambda kv: (kv[0][0], kv[0][1])):
        fil = prov_por_filial[cod]
        base = 'caba' if nombre_zona == 'Ciudad de Buenos Aires' else slugify(nombre_zona.replace(' y alrededores', ''))
        slug = base
        if slug in usados or base in ('interior', 'capital'):
            slug = f"{base}-{slugify(fil['nombre'])}"
        usados[slug] = True
        centros = []
        for c in z['centros'].values():
            c['internacion'] = [p for p in ORDEN_PLANES if p in c['internacion']]
            c['guardia'] = [p for p in ORDEN_PLANES if p in c['guardia']]
            # El PDF de cada plan repite el centro pero aclara "Exclusivo plan 450":
            # manda la nota, no la aparición en el PDF.
            for n in c['notas']:
                m = re.match(r'Exclusivo plan (\w+)', n, re.I)
                if m:
                    c['internacion'] = [p for p in c['internacion'] if p == m.group(1)]
                    c['guardia'] = [p for p in c['guardia'] if p == m.group(1)]
            centros.append(c)
        centros.sort(key=lambda c: (not c['internacion'], clave_nombre(c['nombre'])))
        salida_zonas.append({
            'slug': slug,
            'nombre': nombre_zona,
            'filial': titulo_filial(fil['nombre']),
            # Metropolitana cubre CABA + GBA: "Ciudad de Buenos Aires" es CABA y
            # el resto de sus zonas (GBA Zona Norte, Oeste, ...) es provincia de Bs. As.
            'provincias': (['Ciudad de Buenos Aires'] if nombre_zona == 'Ciudad de Buenos Aires' else ['Buenos Aires'])
                          if fil['nombre'] == 'METROPOLITANA' else fil['provincias'],
            'centros': centros,
        })

    out = {
        'fuente': 'Cartillas PDF oficiales de OSDE (osde.com.ar/cartilla-inteligente, descarga por filial y plan)',
        'vigencia': sorted(vigencias),
        'planes': ORDEN_PLANES,
        'faltantes': faltantes,
        'zonas': salida_zonas,
    }
    with open(salida, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    n_centros = sum(len(z['centros']) for z in salida_zonas)
    print(f'{len(salida_zonas)} zonas, {n_centros} centros, vigencia {sorted(vigencias)}, faltantes {len(faltantes)}')


if __name__ == '__main__':
    main(*sys.argv[1:4])
