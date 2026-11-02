"""
Afiliados ("usuarios") de cada prepaga según la Superintendencia de Servicios
de Salud: lib/data/afiliados-prepagas.json.

Fuente: la página de estadísticas de la SSSalud
(argentina.gob.ar/sssalud/estadisticas), planilla "Evolución anual de usuarios
por Entidades de Medicina Prepaga" de cada año (un número por prepaga y por
mes, del padrón que cada prepaga presenta). Se toma el último mes con datos
del año más nuevo y el mismo mes del año anterior para la variación.

Pedido de Darío (2-nov-2026): ranking de prepagas por cantidad de afiliados,
con la fuente oficial. Primer corte: agosto de 2026, 8.693.041 usuarios.

Uso: python scripts/afiliados-sssalud/generar.py   (requiere openpyxl)
"""
import io, json, os, re, sys, urllib.request

RAIZ = os.path.join(os.path.dirname(__file__), '..', '..')
SALIDA = os.path.join(RAIZ, 'lib', 'data', 'afiliados-prepagas.json')
NOMBRES = os.path.join(RAIZ, 'data', 'sssalud', 'prepagas.json')
PAGINA = 'https://www.argentina.gob.ar/sssalud/estadisticas'
BASE = 'https://www.argentina.gob.ar/sites/default/files/2020/07/'
TOP = 30
MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
# Prepagas con ficha en el sitio (RNEMP → slug). Mismos códigos que scripts/cuadros-sssalud/generar.py
SLUGS = {
    614081: 'osde', 113328: 'swiss-medical', 311371: 'sancor-salud', 112851: 'galeno', 412258: 'medife',
    113366: 'omint', 211947: 'avalian', 116792: 'prevencion-salud', 112172: 'premedic', 111438: 'hominis',
    111834: 'medicus', 413145: 'hospital-italiano', 311586: 'federada-salud', 610133: 'luis-pasteur',
}


SIGLAS = {'OSDE', 'OSDEPYM', 'URG', 'MET', 'SMG', 'ACA', 'SCIS', 'APRES', 'AMTA', 'OSPEDYC'}
CHICAS = {'de', 'del', 'la', 'las', 'los', 'y'}


def visible(nombre):
    # "JERARQUICOS SALUD" → "Jerarquicos Salud"; las siglas quedan en mayúsculas. Las prepagas con ficha
    # usan el nombre del sitio (lib/data/prepagas.ts), esto es solo para el resto del ranking.
    palabras = nombre.split()
    return ' '.join(w if w in SIGLAS else (w.lower() if i and w.lower() in CHICAS else w.capitalize()) for i, w in enumerate(palabras))


# Tildes que la SSSalud no pone en el nombre comercial
TILDES = {'Union Personal': 'Unión Personal', 'Jerarquicos Salud': 'Jerárquicos Salud', 'Prevencion Salud': 'Prevención Salud',
          'Hospital Aleman': 'Hospital Alemán', 'Hospital Britanico': 'Hospital Británico', 'Medife': 'Medifé',
          'Federada Cobertura Medica': 'Federada Cobertura Médica', 'APRES Cobertura Medica': 'APRES Cobertura Médica',
          'Asociacion Trabajadores de la Salud Publica de la Republica Argentina': 'ATSA (Asociación Trabajadores de la Salud Pública)'}


def bajar(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'prepagaya-bot (+https://www.prepagaya.com.ar)'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def evolucion(contenido):
    import openpyxl
    ws = openpyxl.load_workbook(io.BytesIO(contenido), read_only=True, data_only=True).worksheets[0]
    filas = {}
    for r in ws.iter_rows(values_only=True):
        if isinstance(r[0], int) and r[1]:
            filas[r[0]] = {'nombre': ' '.join(str(r[1]).split()), 'meses': [v if isinstance(v, int) else 0 for v in r[2:14]]}
    return filas


def main():
    html = bajar(PAGINA).decode('utf-8', 'ignore')
    archivos = sorted(set(re.findall(r'evolucion_anual_de_usuarios_por_entidades_de_medicina_prepaga_-_ano_(\d{4})([0-9.]*)\.xlsx', html)))
    por_anio = {}
    for anio, sufijo in archivos:
        por_anio[anio] = f'evolucion_anual_de_usuarios_por_entidades_de_medicina_prepaga_-_ano_{anio}{sufijo}.xlsx'
    anio = max(por_anio)
    actual = evolucion(bajar(BASE + por_anio[anio]))
    mes = max(i for i in range(12) if sum(f['meses'][i] for f in actual.values()) > 0)
    anterior = evolucion(bajar(BASE + por_anio[str(int(anio) - 1)])) if str(int(anio) - 1) in por_anio else {}

    comerciales = {x['rnemp']: x['nombre_comercial'] for x in json.load(open(NOMBRES, encoding='utf-8'))}
    total = sum(f['meses'][mes] for f in actual.values())
    total_ant = sum(f['meses'][mes] for f in anterior.values()) or None
    entidades = sum(1 for f in actual.values() if f['meses'][mes] > 0)
    filas = sorted(((r, f) for r, f in actual.items() if f['meses'][mes] > 0), key=lambda x: -x[1]['meses'][mes])
    ranking = []
    for pos, (rnemp, f) in enumerate(filas[:TOP], 1):
        usuarios = f['meses'][mes]
        previo = anterior.get(rnemp, {}).get('meses', [0] * 12)[mes] or None
        ranking.append({
            'posicion': pos, 'rnemp': rnemp, 'nombre': (lambda n: TILDES.get(n, n))(visible(comerciales.get(rnemp) or f['nombre'])), 'razonSocial': f['nombre'],
            'slug': SLUGS.get(rnemp), 'usuarios': usuarios, 'cuota': round(usuarios / total * 100, 2),
            'usuariosAnioAnterior': previo, 'variacion': round((usuarios / previo - 1) * 100, 1) if previo else None,
        })
    out = {
        'fuente': 'Superintendencia de Servicios de Salud, "Evolución anual de usuarios por Entidades de Medicina Prepaga"',
        'fuenteUrl': PAGINA, 'planilla': BASE + por_anio[anio],
        'periodo': f'{anio}-{mes + 1:02d}', 'periodoTexto': f'{MESES[mes]} de {anio}',
        'totalUsuarios': total, 'totalUsuariosAnioAnterior': total_ant, 'entidades': entidades, 'ranking': ranking,
    }
    json.dump(out, open(SALIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(out['periodoTexto'], total, entidades, 'entidades;', ', '.join(f"{r['nombre']} {r['usuarios']}" for r in ranking[:5]))


if __name__ == '__main__':
    sys.exit(main())
