"""Ópticas y vacunatorios de Avalian por zona — clases "2" (Ópticas) y "6"
(Vacunatorios) del mismo buscador (avalian.com/xhr/cartilla.php).

Pedido de Darío (2-nov-2026). Las clases salen del propio formulario de
avalian.com/cartilla (2-nov-2026: data-clase="2" "Ópticas", "6" "Vacunatorios",
las dos sin campo de especialidad ni de profesional, igual que Farmacias = 1):
son comercios e instituciones, sin médicos particulares. Se reutiliza
farmacias.py con otra clase: mismas zonas, mismos planes, mismo formato.

Uso:
  python rubros.py descargar <carpeta_raw>     (~1 h, el buscador limita pedidos)
  python rubros.py generar <carpeta_raw> ../../lib/data/cartilla-zonas
    → avalian-vacunatorios.json (ópticas: ver RUBROS)
"""
import os, sys
import importlib.util

_spec = importlib.util.spec_from_file_location('farmacias', os.path.join(os.path.dirname(__file__), 'farmacias.py'))
farmacias = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(farmacias)

# Ópticas (clase 2) existe en el formulario pero el buscador no devuelve
# ninguna (2-nov-2026: 0 en CABA, GBA, Córdoba, Rosario y La Plata, con
# INTEGRAL y SUPERIOR): por ahora solo vacunatorios. Si algún día trae
# resultados, alcanza con volver a sumar 'opticas': '2'.
RUBROS = {'vacunatorios': '6'}


def descargar(raw):
    for rubro, clase in RUBROS.items():
        farmacias.CLASE = clase
        farmacias.descargar(os.path.join(raw, rubro))


def generar(raw, carpeta_salida):
    for rubro in RUBROS:
        farmacias.generar(os.path.join(raw, rubro), os.path.join(carpeta_salida, f'avalian-{rubro}.json'))


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
