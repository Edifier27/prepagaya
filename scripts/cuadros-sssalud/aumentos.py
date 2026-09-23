"""
Genera lib/data/aumentos-oficiales.json: el aumento REAL de cada prepaga mes a
mes, comparando los cuadros tarifarios oficiales de la SSSalud de períodos
consecutivos (data/sssalud/cuadros-<periodo>.json, ver scrape.py).

Por prepaga y mes: mediana, mínimo y máximo del aumento de todas sus filas
(plan × región × rango etario × modalidad) que existen en los dos períodos, y
las tasas que la prepaga declaró (tasa_aumento_mensual) para controlar.

Uso: python scripts/cuadros-sssalud/aumentos.py
"""
import glob, json, os, re, statistics, time

RAIZ = os.path.join(os.path.dirname(__file__), '..', '..')
DATOS = os.path.join(RAIZ, 'data', 'sssalud')
SALIDA = os.path.join(RAIZ, 'lib', 'data', 'aumentos-oficiales.json')

# RNEMP → slug y nombre del sitio (mismo mapeo que scrape.py)
SITIO = {
    113328: ('swiss-medical', 'Swiss Medical'), 614081: ('osde', 'OSDE'), 211947: ('avalian', 'Avalian'),
    311371: ('sancor-salud', 'Sancor Salud'), 112172: ('premedic', 'Premedic'), 412258: ('medife', 'Medifé'),
    113366: ('omint', 'Omint'), 111834: ('medicus', 'Medicus'), 112851: ('galeno', 'Galeno'),
    116792: ('prevencion-salud', 'Prevención Salud'), 111438: ('hominis', 'Hominis'), 311586: ('federada-salud', 'Federada Salud'),
    413145: ('hospital-italiano', 'Hospital Italiano'), 412593: ('cemic', 'CEMIC'), 610133: ('luis-pasteur', 'Luis Pasteur'),
}
MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']


def anterior(periodo):
    a, m = divmod(periodo, 100)
    return (a - 1) * 100 + 12 if m == 1 else periodo - 1


def clave(f):
    return (f['nombre_plan'], f['region'], f['rango_etario_desde'], f['rango_etario_hasta'], f['modalidad_adhesion'])


def main():
    periodos = sorted(int(re.search(r'(\d{6})', p).group(1)) for p in glob.glob(os.path.join(DATOS, 'cuadros-*.json')))
    cache = {p: json.load(open(os.path.join(DATOS, f'cuadros-{p}.json'), encoding='utf-8'))['filas'] for p in periodos}
    meses = {}
    for p in periodos:
        prev = anterior(p)
        if prev not in cache:
            continue
        por_prepaga = {}
        for rnemp, (slug, nombre) in SITIO.items():
            a = {clave(f): f for f in cache[prev] if f['rnemp'] == rnemp and f['valor_capital']}
            b = {clave(f): f for f in cache[p] if f['rnemp'] == rnemp and f['valor_capital']}
            comunes = [k for k in b if k in a]
            if not comunes:
                continue  # todavía no declaró el período o no declara
            subas = [b[k]['valor_capital'] / a[k]['valor_capital'] - 1 for k in comunes]
            declaradas = sorted({round(b[k]['tasa_aumento_mensual'] * 100, 2) for k in comunes if b[k].get('tasa_aumento_mensual') is not None})
            por_prepaga[slug] = {
                'nombre': nombre,
                'mediana': round(statistics.median(subas) * 100, 2),
                'minimo': round(min(subas) * 100, 2),
                'maximo': round(max(subas) * 100, 2),
                'declaradas': declaradas,
                'filas': len(comunes),
            }
        if por_prepaga:
            medianas = [v['mediana'] for v in por_prepaga.values()]
            meses[str(p)] = {
                'label': f'{MESES[p % 100 - 1]} {p // 100}',
                'promedio': round(sum(medianas) / len(medianas), 2),
                'prepagas': dict(sorted(por_prepaga.items(), key=lambda kv: kv[1]['mediana'])),
            }
    salida = {
        'fuente': 'Superintendencia de Servicios de Salud — cuadros tarifarios (Res. 645/2025)',
        'fuenteUrl': 'https://cuadrostarifarios.sssalud.gob.ar/',
        'metodo': 'Aumento de cada fila (plan, región, rango de edad y modalidad) entre dos períodos consecutivos; por prepaga se informa la mediana, el mínimo y el máximo. El promedio del mes es el promedio simple de las medianas de las prepagas que declararon.',
        'generado': time.strftime('%Y-%m-%d'),
        'meses': meses,
    }
    with open(SALIDA, 'w', encoding='utf-8') as fh:
        json.dump(salida, fh, ensure_ascii=False, indent=2)
    print('OK →', SALIDA, list(meses))


if __name__ == '__main__':
    main()
