"""
Genera lib/data/historial-precios.json: el precio de lista de cada plan del
sitio en cada período de los cuadros tarifarios guardados
(data/sssalud/cuadros-<periodo>.json). Misma regla que generar.py: 30 años,
contratación directa, región CABA/AMBA de cada prepaga, IVA 10,5% incluido.

Lo usa la página /historial-precios (3-oct-2026). Como los cuadros de cada
mes quedan guardados en data/sssalud, la serie crece sola con cada
actualización.

Uso: python scripts/cuadros-sssalud/historial.py
"""
import json, os, time

from generar import DATOS, EDAD_REFERENCIA, IVA, MAPEO, RAIZ, periodos_disponibles

SALIDA = os.path.join(RAIZ, 'lib', 'data', 'historial-precios.json')


def main():
    # Como generar.py: hasta el mes en curso (la SSSalud publica el siguiente por adelantado)
    tope = int(time.strftime('%Y%m'))
    periodos = [p for p in periodos_disponibles() if p <= tope]
    serie = {}
    for p in periodos:
        filas = json.load(open(os.path.join(DATOS, f'cuadros-{p}.json'), encoding='utf-8'))['filas']
        for slug, m in MAPEO.items():
            for plan_slug, nombre in m['planes'].items():
                cand = [f for f in filas
                        if f['rnemp'] == m['rnemp'] and f['nombre_plan'] == nombre and f['region'] == m['region']
                        and f['modalidad_adhesion'] and f['rango_etario_desde'] <= EDAD_REFERENCIA <= f['rango_etario_hasta']]
                if not cand:
                    continue
                f = min(cand, key=lambda f: f['rango_etario_hasta'] - f['rango_etario_desde'])
                serie.setdefault(slug, {}).setdefault(plan_slug, {})[str(p)] = round(f['valor_capital'] * IVA)
    with open(SALIDA, 'w', encoding='utf-8') as fh:
        json.dump({'fuente': 'Superintendencia de Servicios de Salud — cuadros tarifarios (Res. 645/2025)',
                   'referencia': f'{EDAD_REFERENCIA} años, contratación individual directa, CABA/AMBA, IVA 10,5% incluido',
                   'periodos': periodos, 'generado': time.strftime('%Y-%m-%d'), 'precios': serie},
                  fh, ensure_ascii=False, separators=(',', ':'))
    print(f'OK → {SALIDA} ({len(periodos)} períodos)')


if __name__ == '__main__':
    main()
