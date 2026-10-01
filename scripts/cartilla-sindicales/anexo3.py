"""Lector del Anexo III de la Res. SSSalud 2165/2021 ("Listado completo de
prestadores"): el formato estándar con el que cada obra social nacional
presenta su cartilla ante la Superintendencia y la publica en su web.

Lee .xlsx (la planilla oficial) y .pdf (la misma planilla impresa) y devuelve
filas normalizadas. Uso: python anexo3.py archivo [archivo...] -> imprime un
resumen. generar.py usa leer() para armar lib/data/sindicales-cartillas/*.json.
"""
import re
import sys
import unicodedata

CAMPOS = ['nombre', 'cuit', 'tipo', 'especialidad', 'ap', 'provincia', 'partido', 'localidad', 'beneficiarios', 'domicilio', 'telefono', 'correo']


def _limpio(v):
    if v is None:
        return ''
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return re.sub(r'\s+', ' ', str(v)).strip()


def _sin_tildes(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


# Encabezado de la planilla -> campo. La versión 2026 de la planilla oficial
# agregó columnas ("OTRA ESPECIALIDAD", "CODIGO POSTAL") y renombró otras
# ("DEPARTAMENTO/PARTIDO", "JURISDICCION"): se ubican por nombre.
_COLUMNAS_XLSX = [
    ('nombre', ('NOMBRE',)),
    ('cuit', ('CUIT',)),
    ('tipo', ('TIPO DE PRESTADOR',)),
    ('especialidad', ('ESPECIALIDAD',)),
    ('ap', ('ADULTO',)),
    ('provincia', ('PROVINCIA',)),
    ('partido', ('PARTIDO', 'DEPARTAMENTO')),
    ('localidad', ('LOCALIDAD', 'JURISDICCION')),
    ('beneficiarios', ('BENEFICIARIOS',)),
    ('domicilio', ('DOMICILIO',)),
    ('telefono', ('TELEFONO',)),
    ('correo', ('CORREO',)),
]


def _columnas(encabezado):
    hdr = [_sin_tildes(_limpio(c)).upper() for c in encabezado]
    indices = {}
    for campo, claves in _COLUMNAS_XLSX:
        i = None
        for j, h in enumerate(hdr):
            if campo == 'especialidad' and h.startswith('OTRA'):
                continue
            if campo == 'localidad' and 'BENEFICIARIOS' in h:
                continue
            if any(h.startswith(k) or (k in h and campo in ('partido', 'beneficiarios')) for k in claves):
                i = j
                break
        indices[campo] = i
    return indices


def leer_xlsx(ruta):
    import openpyxl
    wb = openpyxl.load_workbook(ruta, read_only=True, data_only=True)
    for ws in wb.worksheets:
        filas = ws.iter_rows(values_only=True)
        for fila in filas:
            if fila and any(c and 'TIPO DE PRESTADOR' in str(c) for c in fila):
                break
        else:
            continue
        indices = _columnas(fila)
        out = []
        for fila in filas:
            if not fila or not fila[0]:
                continue
            d = {k: _limpio(fila[i] if i is not None and i < len(fila) else None) for k, i in indices.items()}
            if d['tipo']:
                out.append(d)
        return out
    raise ValueError(f'{ruta}: no encontré la hoja del Anexo III')


# Encabezados del PDF -> campo. Las columnas de texto están alineadas a la
# izquierda (el x0 del encabezado es el x0 del texto); las numéricas (CUIT,
# beneficiarios, teléfono) a la derecha, dentro de su banda.
_ENCABEZADOS = [('NOMBRE', 'nombre'), ('CUIT', 'cuit'), ('TIPO', 'tipo'), ('ESPECIALIDAD', 'especialidad'),
                ('ADULTO', 'ap'), ('PROVINCIA', 'provincia'), ('PARTIDO', 'partido'), ('LOCALIDAD', 'localidad'),
                ('DOMICILIO', 'domicilio'), ('TELEFONO', 'telefono'), ('CORREO', 'correo')]


def _bandas(pagina):
    ws = pagina.extract_words(x_tolerance=0.8, use_text_flow=True)
    fila_hdr = [w for w in ws if w['text'] == 'NOMBRE']
    if not fila_hdr:
        return None
    top = fila_hdr[0]['top']
    hdr = [w for w in ws if abs(w['top'] - top) < 8]
    bandas = []
    for clave, campo in _ENCABEZADOS:
        cand = [w for w in hdr if w['text'].startswith(clave)]
        if cand:
            bandas.append((min(c['x0'] for c in cand), campo))
    bandas.sort()
    return bandas, top


def leer_pdf(ruta):
    import pdfplumber
    out = []
    bandas = None
    with pdfplumber.open(ruta) as pdf:
        for pagina in pdf.pages:
            b = _bandas(pagina)
            top_hdr = -1
            if b:
                bandas, top_hdr = b
            if not bandas:
                continue
            palabras = pagina.extract_words(x_tolerance=0.8, use_text_flow=True)
            lineas = {}
            for w in palabras:
                if w['top'] <= top_hdr + 3:
                    continue
                # Filas en orden de escritura: una fila nueva cuando cambia la altura
                clave = next((k for k in lineas if abs(k - w['top']) < 1.5), w['top'])
                lineas.setdefault(clave, []).append(w)
            inicios = [bx for bx, _ in bandas]
            for k in sorted(lineas):
                ws = lineas[k]
                celdas = []  # [x0_inicio, [palabras]]
                prev = None
                for w in ws:
                    en_inicio = any(abs(w['x0'] - bx) < 0.6 for bx in inicios)
                    if prev is None or en_inicio or w['x0'] < prev['x0'] or w['x0'] - prev['x1'] > 2.5:
                        celdas.append([w['x0'], [w]])
                    else:
                        celdas[-1][1].append(w)
                    prev = w
                fila = {c: [] for c in CAMPOS}
                asignadas = []
                for x0, pals in celdas:
                    campo = bandas[0][1]
                    for bx, bc in bandas:
                        if x0 >= bx - 1.2:
                            campo = bc
                    txt = ' '.join(p['text'] for p in pals)
                    # Beneficiarios: número alineado a la derecha dentro de la banda de localidad
                    if campo == 'localidad' and re.fullmatch(r'\d+', txt):
                        campo = 'beneficiarios'
                    asignadas.append((campo, txt))
                # Desborde: si un campo de texto recibe dos celdas, la primera es
                # el final del campo anterior que se pasó de su columna.
                orden = [c for _, c in bandas]
                vistos = {}
                for i, (campo, txt) in enumerate(asignadas):
                    vistos.setdefault(campo, []).append(i)
                for campo, idxs in vistos.items():
                    if len(idxs) > 1 and campo in ('localidad', 'partido', 'provincia', 'especialidad', 'tipo'):
                        anterior = orden[orden.index(campo) - 1]
                        for i in idxs[:-1]:
                            asignadas[i] = (anterior, asignadas[i][1])
                for campo, txt in asignadas:
                    fila[campo].append(txt)
                d = {c: ' '.join(v).strip() for c, v in fila.items()}
                _separar_pegados(d)
                if d['tipo'] and d['nombre']:
                    out.append(d)
    return out


_TIPOS = ['Establecimiento con internacion', 'Centros de Urgencia o Emergencia', 'Centros de diagnostico y tratamiento',
          'Ambulatorio/Especialista', 'Farmacia', 'Optica', 'Ortopedia']


def _separar_pegados(d):
    # "27364779459Ambulatorio/Especialista": CUIT pegado al tipo
    m = re.match(r'^(\d{11})\s*(.*)$', d['tipo'])
    if m:
        d['cuit'], d['tipo'] = m.group(1), m.group(2)
    m = re.match(r'^(.*?)(\d{11})$', d['cuit'] or '')
    if m:
        d['cuit'] = m.group(2)
    # "72Rivadavia 378": beneficiarios pegados al domicilio
    for campo in ('localidad', 'domicilio'):
        m = re.match(r'^(.*?)\s*(\d+)$', d[campo]) if campo == 'localidad' else None
        if m and m.group(1):
            d['localidad'], d['beneficiarios'] = m.group(1), m.group(2)
    # "3401533827administracion@...": teléfono pegado al correo
    for campo in ('telefono', 'correo'):
        m = re.match(r'^([\d\-\s/,E+]{6,}?)([A-Za-z].*@.*)$', d[campo])
        if m:
            d['telefono'], d['correo'] = m.group(1).strip(), m.group(2)
    # Una especialidad larga se pega al "AMBOS" de la columna siguiente
    m = re.match(r'^(.*?)(AMBOS|ADULTO|PEDIATRICO)$', d['especialidad'])
    if m and m.group(1):
        d['especialidad'], d['ap'] = m.group(1).strip(), m.group(2)
    d['tipo'] = d['tipo'].strip()


def leer(ruta):
    return leer_pdf(ruta) if ruta.lower().endswith('.pdf') else leer_xlsx(ruta)


if __name__ == '__main__':
    import collections
    for ruta in sys.argv[1:]:
        filas = leer(ruta)
        print(ruta, len(filas))
        print(collections.Counter(f['tipo'] for f in filas).most_common(10))
        print(collections.Counter(f['provincia'] for f in filas).most_common(30))
        for f in filas[:3] + filas[len(filas) // 2:len(filas) // 2 + 3]:
            print(f)
