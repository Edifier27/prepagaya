"""Cartilla de Swiss Medical por especialidad — SOLO centros e instituciones.

Pedido de Darío (28-sep-2026): por especialidad (pediatría, traumatología,
dermatología...) y fertilidad, mostrar los centros médicos de cada zona y
cuántos profesionales de esa especialidad hay, SIN datos de médicos
particulares (de los profesionales solo se cuenta la cantidad).

Fuente: el mismo buscador público que usa swiss.py
(busquedaPrestadoresSinCalif, tipo 1 = especialidades).

Uso:
  python especialidades.py descargar <carpeta_raw>
"""
import json, os, sys, time
import importlib.util

_spec = importlib.util.spec_from_file_location('swiss', os.path.join(os.path.dirname(__file__), 'swiss.py'))
swiss = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(swiss)

ESPECIALIDADES = [
    'Pediatría', 'Traumatología y Ortopedia', 'Ginecología', 'Cardiología',
    'Dermatología', 'Oftalmología', 'Esterilidad',
]
TOPE = 600  # el buscador devuelve hasta 600 resultados por consulta


def descargar(carpeta):
    os.makedirs(carpeta, exist_ok=True)
    for carti in swiss.CARTILLAS:
        for esp in ESPECIALIDADES:
            destino = os.path.join(carpeta, f'{carti}__{esp}.json')
            if os.path.exists(destino):
                continue
            r = swiss.pedir('1', carti, esp)
            docs = r['docs']
            if r['numFound'] > TOPE:
                docs = []
                for prov in swiss.PROVINCIAS:
                    rp = swiss.pedir('1', carti, esp, prov)
                    docs.extend(rp['docs'])
                    time.sleep(1)
            json.dump(docs, open(destino, 'w', encoding='utf-8'), ensure_ascii=False)
            print(carti, esp, len(docs), flush=True)
            time.sleep(1)


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'descargar':
        descargar(sys.argv[2])
    else:
        print(__doc__)
