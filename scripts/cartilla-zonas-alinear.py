"""Alinea los slugs de zona de una cartilla por rubro (farmacias, ópticas,
vacunatorios, especialidades) con los de la cartilla principal de la prepaga.

La página pide los datos de cada rubro con el slug de la zona de la cartilla
principal (ej. swiss-medical.json). Cada generador arma sus slugs según el orden
en que aparecen las zonas y le agrega la provincia si el nombre se repite, así
que "mercedes" puede ser Corrientes en la principal y Buenos Aires en farmacias
(2-nov-2026: la página de Mercedes, Corrientes mostraba farmacias de Mercedes,
Buenos Aires). Este script reasigna por (nombre, provincias) y le da un slug
libre a las zonas que no existen en la principal.

Uso:
  python cartilla-zonas-alinear.py ../lib/data/cartilla-zonas/swiss-medical.json ../lib/data/cartilla-zonas/swiss-medical-farmacias.json [...]
"""
import json, re, sys, unicodedata


def clave(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def alinear(principal, ruta):
    zonas_p = json.load(open(principal, encoding='utf-8'))['zonas']
    por_slug = {z['slug']: z for z in zonas_p}
    slug_de = {(clave(z['nombre']), tuple(z['provincias'])): z['slug'] for z in zonas_p}
    d = json.load(open(ruta, encoding='utf-8'))
    original = [z['slug'] for z in d['zonas']]
    usados = set(por_slug)
    for z in d['zonas']:
        p = por_slug.get(z['slug'])
        if p and p['provincias'] == z['provincias']:
            continue  # misma zona (el nombre puede variar, ej. "y alrededores" en OSDE)
        z['slug'] = slug_de.get((clave(z['nombre']), tuple(z['provincias'])))
    asignados = {z['slug'] for z in d['zonas'] if z['slug']}
    for z, base in zip(d['zonas'], original):
        if z['slug'] is None:
            for slug in [base, f'{base}-{clave(z["provincias"][0])}'] + [f'{base}-{i}' for i in range(2, 50)]:
                if slug not in usados and slug not in asignados:
                    break
            z['slug'] = slug
            asignados.add(slug)
    slugs = [z['slug'] for z in d['zonas']]
    assert len(slugs) == len(set(slugs)), 'slugs repetidos'
    cambios = [(a, b) for a, b in zip(original, slugs) if a != b]
    json.dump(d, open(ruta, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(ruta, len(cambios), 'cambios', cambios[:12])


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
    for ruta in sys.argv[2:]:
        alinear(sys.argv[1], ruta)
