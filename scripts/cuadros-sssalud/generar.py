"""
Genera lib/data/precios-oficiales.json a partir de los cuadros tarifarios de la
SSSalud (data/sssalud/cuadros-<periodo>.json, ver scrape.py).

Precio de referencia de la web = valor por cápita declarado para la
modalidad Directo (contratación particular), la región de CABA/AMBA de cada
prepaga y el rango etario que incluye EDAD_REFERENCIA, más IVA del 10,5%
(medicina prepaga). Validado el 23-sep-2026: con esta regla los 12 planes de
Swiss Medical coinciden al peso con la lista que ya tenía el sitio.

Solo se mapean los planes cuyo nombre coincide sin ambigüedad con el plan
declarado (MAPEO). Los que no están acá mantienen el precio manual de
lib/data/prepagas.ts hasta que se confirme a qué plan oficial corresponden.

Por prepaga se usa el último período publicado que no sea posterior al mes
en curso (la SSSalud publica el mes siguiente por adelantado).

Uso: python scripts/cuadros-sssalud/generar.py [--periodo 202609]
"""
import glob, json, os, re, sys, time

RAIZ = os.path.join(os.path.dirname(__file__), '..', '..')
DATOS = os.path.join(RAIZ, 'data', 'sssalud')
SALIDA = os.path.join(RAIZ, 'lib', 'data', 'precios-oficiales.json')
# Tabla completa (todas las regiones y rangos etarios) para el motor de
# precios del servidor (lib/precios/motor.ts). Valores SIN IVA, tal cual
# los declara la prepaga: el IVA lo aplica el motor según la modalidad.
SALIDA_TARIFAS = os.path.join(RAIZ, 'lib', 'data', 'tarifas-oficiales.json')
EDAD_REFERENCIA = 30
IVA = 1.105

# prepaga del sitio → RNEMP, región equivalente a CABA/AMBA y
# {slug del plan en el sitio: nombre_plan declarado en la SSSalud}
MAPEO = {
    'swiss-medical': {'rnemp': 113328, 'region': 'AMBA', 'planes': {
        'smg02': 'SMG02', 's1': 'S1', 's2': 'S2', 'sport-s': 'SPORT-S', 'smg20': 'SMG20', 'smg30': 'SMG30',
        'sport': 'SPORT', 'smg40': 'SMG40', 'sport-plus': 'SPORT+', 'smg50': 'SMG50', 'smg60': 'SMG60', 'smg70': 'SMG70'}},
    'osde': {'rnemp': 614081, 'region': 'CABA, Provincia de Bs As y Ciudad de Viedma', 'planes': {
        '210': '2 210 INDIVIDUAL', '310': '2 310 INDIVIDUAL', '410': '2 410 INDIVIDUAL', '510': '2 510 INDIVIDUAL'}},
    'premedic': {'rnemp': 112172, 'region': 'CAPITAL FEDERAL', 'planes': {
        'plan-200': '200', 'plan-300': '300', 'plan-400': '400'}},
    'medife': {'rnemp': 412258, 'region': 'PROVINCIA DE BUENOS AIRES', 'planes': {
        'medife-plus': 'MEDIFE MAS', 'bronce': 'BRONCE', 'plata': 'PLATA', 'oro': 'ORO', 'platinum': 'PLATINUM'}},
    'galeno': {'rnemp': 112851, 'region': 'Pais', 'planes': {
        'azul-200': 'Azul 200', 'azul-220': 'Azul 220', 'plata-300': 'Plata 300', 'plata-330': 'Plata 330',
        'oro-400': 'Oro 400', 'oro-440': 'Oro 440', 'oro-550': 'Oro 550'}},
}
# Pendientes de confirmar a qué plan oficial corresponde cada plan del sitio
# (23-sep-2026): Sancor (líneas "GEN" y no GEN), Avalian (el sitio tiene
# planes que no existen; los reales son AS100/AS200/AS204/AS300/AS400/AS500),
# Omint, Prevención, Hospital Italiano, Federada y CEMIC (nombres distintos),
# y Luis Pasteur (cruza por nombre pero da +100% contra el sitio: revisar).
# Medicus y Hominis no declaran cuadros en la SSSalud.

MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']


def periodos_disponibles():
    return sorted(int(re.search(r'(\d{6})', p).group(1)) for p in glob.glob(os.path.join(DATOS, 'cuadros-*.json')))


def main():
    args = sys.argv[1:]
    tope = int(args[args.index('--periodo') + 1]) if '--periodo' in args else int(time.strftime('%Y%m'))
    periodos = [p for p in periodos_disponibles() if p <= tope]
    cache = {p: json.load(open(os.path.join(DATOS, f'cuadros-{p}.json'), encoding='utf-8'))['filas'] for p in periodos}

    precios, periodo_por_prepaga, faltantes = {}, {}, []
    for slug, m in MAPEO.items():
        # último período en que esta prepaga declaró filas
        periodo = next((p for p in reversed(periodos) if any(f['rnemp'] == m['rnemp'] for f in cache[p])), None)
        if periodo is None:
            faltantes.append(f'{slug}: sin datos')
            continue
        periodo_por_prepaga[slug] = periodo
        precios[slug] = {}
        for plan_slug, nombre in m['planes'].items():
            cand = [f for f in cache[periodo]
                    if f['rnemp'] == m['rnemp'] and f['nombre_plan'] == nombre and f['region'] == m['region']
                    and f['modalidad_adhesion'] and f['rango_etario_desde'] <= EDAD_REFERENCIA <= f['rango_etario_hasta']]
            if not cand:
                faltantes.append(f'{slug}/{plan_slug} ({nombre})')
                continue
            # si hay rangos superpuestos, el más acotado
            f = min(cand, key=lambda f: f['rango_etario_hasta'] - f['rango_etario_desde'])
            precios[slug][plan_slug] = round(f['valor_capital'] * IVA)

    # Tabla completa por plan: {prepaga: {plan: {region: {"d": [[desde, hasta, valor]], "r": [...]}}}}
    # d = modalidad Directo (particular), r = Desregulado (derivando aportes).
    tarifas = {}
    for slug, m in MAPEO.items():
        periodo = periodo_por_prepaga.get(slug)
        if not periodo:
            continue
        tarifas[slug] = {}
        for plan_slug, nombre in m['planes'].items():
            por_region = {}
            for f in cache[periodo]:
                if f['rnemp'] != m['rnemp'] or f['nombre_plan'] != nombre:
                    continue
                clave = 'd' if f['modalidad_adhesion'] else 'r'
                por_region.setdefault(f['region'], {}).setdefault(clave, []).append(
                    [f['rango_etario_desde'], f['rango_etario_hasta'], round(f['valor_capital'], 2)])
            for reg in por_region.values():
                for lista in reg.values():
                    lista.sort()
            if por_region:
                tarifas[slug][plan_slug] = por_region
    with open(SALIDA_TARIFAS, 'w', encoding='utf-8') as fh:
        json.dump({'fuente': 'Superintendencia de Servicios de Salud — cuadros tarifarios (Res. 645/2025)',
                   'iva': IVA, 'periodoPorPrepaga': periodo_por_prepaga, 'tarifas': tarifas},
                  fh, ensure_ascii=False, separators=(',', ':'))
    print(f'OK → {SALIDA_TARIFAS}')

    ultimo = max(periodo_por_prepaga.values())
    salida = {
        'fuente': 'Superintendencia de Servicios de Salud — cuadros tarifarios (Res. 645/2025)',
        'fuenteUrl': 'https://cuadrostarifarios.sssalud.gob.ar/',
        'referencia': f'{EDAD_REFERENCIA} años, contratación individual directa, CABA/AMBA, IVA 10,5% incluido',
        'periodo': ultimo,
        'periodoTexto': f'{MESES[ultimo % 100 - 1]} {ultimo // 100}',
        'periodoPorPrepaga': periodo_por_prepaga,
        'generado': time.strftime('%Y-%m-%d'),
        'precios': precios,
    }
    with open(SALIDA, 'w', encoding='utf-8') as fh:
        json.dump(salida, fh, ensure_ascii=False, indent=2)
    print(f'OK → {SALIDA} (período {ultimo})')
    for x in faltantes:
        print('  sin dato:', x)


if __name__ == '__main__':
    main()
