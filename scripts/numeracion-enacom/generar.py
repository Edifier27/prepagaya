"""Bloques de numeración geográfica asignados por ENACOM → lib/data/numeracion-ar.json

Uso:
  pip install xlrd==2.0.1
  python scripts/numeracion-enacom/generar.py ruta/al/archivo.xls

El .xls sale de https://www.enacom.gob.ar/asignaciones-a-la-fecha_p445
("Numeración Geográfica", botón descargable). Cada fila es un bloque:
INDICATIVO (código de área sin 0) + BLOQUE (primeros dígitos del abonado) y
el SERVICIO: SBT es telefonía fija; STM, PCS, SRMC, OMV, SCMA, SRCE, SAP y
sus combinaciones son móviles. Se guarda por indicativo la lista de bloques
móviles y la de fijos, para que lib/celular-ar.ts diga si un número existe y
si es celular (sin el número completo: solo prefijos).
"""
import json
import re
import sys
from datetime import date

import xlrd

archivo = sys.argv[1]
hoja = xlrd.open_workbook(archivo).sheet_by_index(0)
cab = [str(c).strip().upper() for c in hoja.row_values(0)]
i_serv, i_ind, i_blo = cab.index('SERVICIO'), cab.index('INDICATIVO'), cab.index('BLOQUE')

movil: dict[str, set[str]] = {}
fijo: dict[str, set[str]] = {}
for r in range(1, hoja.nrows):
    fila = hoja.row_values(r)
    ind = re.sub(r'\D', '', str(fila[i_ind]).split('.')[0])
    blo = re.sub(r'\D', '', str(fila[i_blo]).split('.')[0])
    serv = str(fila[i_serv]).upper()
    if not ind or not blo or len(ind) + len(blo) > 10:
        continue
    destino = fijo if serv.strip().startswith('SBT') else movil
    destino.setdefault(ind, set()).add(blo)

def compacto(d):
    # Bloques de un indicativo separados por coma, ordenados
    return {k: ','.join(sorted(v)) for k, v in sorted(d.items())}

salida = {
    'fuente': 'ENACOM, numeración geográfica asignada (enacom.gob.ar/asignaciones-a-la-fecha_p445)',
    'generado': date.today().isoformat(),
    'movil': compacto(movil),
    'fijo': compacto(fijo),
}
with open('lib/data/numeracion-ar.json', 'w', encoding='utf-8') as f:
    json.dump(salida, f, ensure_ascii=False, separators=(',', ':'))
print(f"{sum(len(v) for v in movil.values())} bloques móviles y {sum(len(v) for v in fijo.values())} fijos en {len(set(movil) | set(fijo))} indicativos")
