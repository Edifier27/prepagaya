"""Ópticas y vacunatorios de Sancor Salud por zona — categorías "OPTICAS" y
"VACUNATORIOS" del mismo buscador (busquedas.sancorsalud.com.ar).

Pedido de Darío (2-nov-2026). Las categorías existen tal cual en el índice
del buscador (2-nov-2026: OPTICAS 1718 documentos, VACUNATORIOS 7). Como en
farmacias, cada documento es un comercio o institución (sin médicos
particulares) y cada domicilio es una sucursal puntual. Se reutiliza
farmacias.generar(): mismo formato de salida.

Uso:
  python rubros.py descargar <carpeta_raw>
  python rubros.py generar <carpeta_raw> ../../lib/data/cartilla-zonas
    → sancor-salud-opticas.json y sancor-salud-vacunatorios.json
"""
import json, os, sys
import importlib.util

_dir = os.path.dirname(__file__)
_spec = importlib.util.spec_from_file_location('farmacias', os.path.join(_dir, 'farmacias.py'))
farmacias = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(farmacias)
sancor = farmacias.sancor

RUBROS = {'opticas': 'OPTICAS', 'vacunatorios': 'VACUNATORIOS'}


def planes_conocidos():
    # El índice "planes_web" ya no existe (2-nov-2026: 404). Los nombres de los
    # planes salen de la cartilla de farmacias ya generada (misma fuente y mismo
    # orden que sancor.PLANES), en el formato que espera farmacias.generar().
    ruta = os.path.join(_dir, '..', '..', 'lib', 'data', 'cartilla-zonas', 'sancor-salud-farmacias.json')
    nombres = json.load(open(ruta, encoding='utf-8'))['planes']
    assert len(nombres) == len(sancor.PLANES)
    return {'hits': {'hits': [{'_source': {'codigo': c, 'descripcion': n}} for c, n in zip(sancor.PLANES, nombres)]}}


def descargar(raw):
    try:
        d2 = sancor.post('planes_web', {'size': 500})
    except Exception:
        d2 = planes_conocidos()
    for rubro, categoria in RUBROS.items():
        carpeta = os.path.join(raw, rubro)
        os.makedirs(carpeta, exist_ok=True)
        d = sancor.post('prestadores_gestor_prod_cartilla_web', {'size': 8000, 'query': {'term': {'categorias.categoria.keyword': categoria}}})
        assert d['hits']['total'] == len(d['hits']['hits']), 'resultado truncado, subir size'
        # farmacias.generar() lee estos dos nombres de archivo
        json.dump(d, open(os.path.join(carpeta, 'farmacias.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        json.dump(d2, open(os.path.join(carpeta, 'planes.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        print(categoria, d['hits']['total'], flush=True)


def generar(raw, carpeta_salida):
    for rubro in RUBROS:
        farmacias.generar(os.path.join(raw, rubro), os.path.join(carpeta_salida, f'sancor-salud-{rubro}.json'))


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
