"""Cartilla de Premedic por zona — solo instituciones (internación y urgencias).

Fuente: el buscador público de web.grupopremedic.com.ar/cartilla-medica, que
consulta GET https://afiliados.grupopremedic.com.ar/api/proxy/{localidad}/{plan}/{prestacion}
(sin credenciales: es el mismo pedido que hace cualquier visitante).

Uso:
  python premedic.py descargar <carpeta_raw>     (~770 pedidos, ~25 min)
  python premedic.py generar <carpeta_raw> ../../lib/data/cartilla-zonas/premedic.json
"""
import json, os, re, sys, time, unicodedata, urllib.request
from datetime import date

API = 'https://afiliados.grupopremedic.com.ar/api/proxy/{loc}/{plan}/{pr}'

# Opciones del formulario oficial (value → texto), leídas del buscador.
LOCALIDADES = {
    '1': ('Ciudad de Buenos Aires', 'caba', ['Ciudad de Buenos Aires']),
    '2': ('GBA Zona Norte', 'gba-zona-norte', ['Buenos Aires']),
    '3': ('GBA Zona Oeste y Noroeste', 'gba-zona-oeste', ['Buenos Aires']),
    '4': ('GBA Zona Sur', 'gba-zona-sur', ['Buenos Aires']),
    '7': ('Córdoba', 'cordoba', ['Córdoba']),
    '9': ('Tucumán', 'tucuman', ['Tucumán']),
    '10': ('Misiones', 'misiones', ['Misiones']),
    '14': ('Mendoza', 'mendoza', ['Mendoza']),
}
PLANES = {'2': 'C-100', '1': '200', '3': '300', '5': '400', '7': '500', '4': '0-50', '6': 'Por aportes',
          '11': 'AMBA', '10': 'Básico', '16': 'Bronce', '17': 'Plata', '18': 'Simple'}
ORDEN_PLANES = ['C-100', '200', '300', '400', '500', 'Por aportes', '0-50', 'AMBA', 'Básico', 'Bronce', 'Plata', 'Simple']
PRESTACIONES = {
    '88': ('internacion', 'Internación'),
    '103': ('internacion', 'Internación obstétrica'),
    '89': ('guardia', 'Urgencias'),
    '94': ('guardia', 'Urgencias pediátricas'),
    '96': ('guardia', 'Urgencias traumatológicas'),
    '97': ('guardia', 'Urgencias ginecológicas'),
    '98': ('guardia', 'Urgencias obstétricas'),
    '99': ('guardia', 'Urgencias oftalmológicas'),
}


def clave(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def limpio(s):
    s = (s or '').replace('\u00a0', ' ').replace('\u00ad', '')
    return re.sub(r'\s+', ' ', s).strip() or None


def limpiar_domicilio(s):
    # "Fondo de la Legua 390 Bs. As. Zona Norte,San Isidro: San Isidro" →
    # "Fondo de la Legua 390, San Isidro"
    s = limpio(s)
    if not s:
        return None
    s = re.sub(r'\s*Bs\. ?As\. Zona [A-Za-z-]+,?\s*', ' ', s)
    s = re.sub(r'(\S[^,:]*?)\s*:\s*\1$', r'\1', s.strip())  # "Moron: Moron" → "Moron"
    s = re.sub(r'\s*:\s*', ', ', s)  # "Tigre: El Talar" → "Tigre, El Talar"
    return re.sub(r'\s+', ' ', s).strip(' ,') or None


def descargar(raw):
    os.makedirs(raw, exist_ok=True)
    for loc in LOCALIDADES:
        for plan in PLANES:
            for pr in PRESTACIONES:
                f = os.path.join(raw, f'{loc}_{plan}_{pr}.json')
                if os.path.exists(f) and os.path.getsize(f) > 0:
                    continue
                req = urllib.request.Request(API.format(loc=loc, plan=plan, pr=pr), headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=60) as r:
                    open(f, 'wb').write(r.read())
                print(loc, plan, pr, flush=True)
                time.sleep(1.5)


def generar(raw, salida):
    zonas = {}
    for loc, (nombre, slug, provincias) in LOCALIDADES.items():
        z = zonas.setdefault(slug, {'slug': slug, 'nombre': nombre, 'provincias': provincias, 'centros': {}})
        for pcod, plan in PLANES.items():
            for prcod, (seccion, servicio) in PRESTACIONES.items():
                f = os.path.join(raw, f'{loc}_{pcod}_{prcod}.json')
                if not os.path.exists(f):
                    raise SystemExit(f'falta {f}')
                filas = json.load(open(f, encoding='utf-8'))
                for row in filas:
                    nom = limpio(row.get('prestador'))
                    if not nom:
                        continue
                    c = z['centros'].setdefault(clave(nom), {
                        'nombre': nom, 'internacion': [], 'guardia': [], 'marca': None,
                        'notas': [], 'servicios': [], 'sedes': []})
                    if plan not in c[seccion]:
                        c[seccion].append(plan)
                    if servicio not in c['servicios']:
                        c['servicios'].append(servicio)
                    dire = limpiar_domicilio(row.get('domicilio'))
                    sede = next((s for s in c['sedes'] if clave(s['direccion'] or '') == clave(dire or '')), None)
                    if sede is None:
                        sede = {'direccion': dire, 'localidad': None, 'tel': limpio(row.get('teléfono')), 'servicios': []}
                        c['sedes'].append(sede)
                    if seccion not in sede['servicios']:
                        sede['servicios'].append(seccion)
    salida_zonas = []
    for z in zonas.values():
        centros = list(z['centros'].values())
        for c in centros:
            c['internacion'] = [p for p in ORDEN_PLANES if p in c['internacion']]
            c['guardia'] = [p for p in ORDEN_PLANES if p in c['guardia']]
            orden_serv = [v[1] for v in PRESTACIONES.values()]
            c['servicios'] = sorted(c['servicios'], key=orden_serv.index)
        centros.sort(key=lambda c: (not c['internacion'], clave(c['nombre'])))
        salida_zonas.append({**z, 'centros': centros})
    hoy = date.today().strftime('%d/%m/%Y')
    out = {
        'fuente': 'Buscador oficial de cartilla de Premedic (web.grupopremedic.com.ar/cartilla-medica)',
        'vigencia': [hoy],
        'planes': [p for p in ORDEN_PLANES if any(p in c['internacion'] or p in c['guardia'] for z in salida_zonas for c in z['centros'])],
        'faltantes': [],
        'zonas': salida_zonas,
    }
    json.dump(out, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(salida_zonas), 'zonas', sum(len(z['centros']) for z in salida_zonas), 'centros', out['planes'])


if __name__ == '__main__':
    {'descargar': lambda: descargar(sys.argv[2]), 'generar': lambda: generar(sys.argv[2], sys.argv[3])}[sys.argv[1]]()
