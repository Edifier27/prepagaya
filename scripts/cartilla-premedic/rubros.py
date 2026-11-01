"""Vacunatorios de Premedic por zona — prestación "91" del mismo buscador.

Pedido de Darío (2-nov-2026: ópticas y vacunatorios en la cartilla). Premedic
no tiene categoría de ópticas: se probaron todas las prestaciones del 1 al 199
en CABA con el plan C-100 y ninguna trae ópticas. La 91 trae los vacunatorios
(ej. la red "Vacunar"), todos comercios, sin médicos particulares. Se
reutiliza farmacias.py con otra prestación: mismas zonas, planes y formato.

Uso:
  python rubros.py descargar <carpeta_raw>
  python rubros.py generar <carpeta_raw> ../../lib/data/cartilla-zonas
    → premedic-vacunatorios.json
"""
import os, sys
import importlib.util

_spec = importlib.util.spec_from_file_location('farmacias', os.path.join(os.path.dirname(__file__), 'farmacias.py'))
farmacias = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(farmacias)

RUBROS = {'vacunatorios': '91'}


def descargar(raw):
    for rubro, prestacion in RUBROS.items():
        farmacias.PRESTACION = prestacion
        farmacias.descargar(os.path.join(raw, rubro))


def generar(raw, carpeta_salida):
    for rubro, prestacion in RUBROS.items():
        farmacias.PRESTACION = prestacion
        farmacias.generar(os.path.join(raw, rubro), os.path.join(carpeta_salida, f'premedic-{rubro}.json'))


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
