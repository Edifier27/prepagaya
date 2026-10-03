"""Lector de cartillas impresas "por provincia y especialidad" (formato de
OSPSA - Sanidad: el Anexo III maquetado como libro). Cada provincia tiene
secciones por especialidad ("Internación Pediatría (12)") con una tabla
PRESTADOR | ATENCIÓN | LOCALIDAD | DOMICILIO | TELÉFONO, donde la localidad
ocupa dos líneas (localidad y partido) y los nombres largos se parten.

Devuelve filas con el mismo formato que anexo3.leer(): el tipo de prestador
se deduce de la sección.
"""
import re
import unicodedata

ATENCION = {'adultos', 'ambos', 'pediatrica', 'pediatrico'}

DIAGNOSTICO = ('anatomia patologica', 'centro de infertilidad', 'centro de rehabilitacion', 'centros oncologicos',
               'densitometria', 'ecografia', 'estudios ', 'hemodialisis', 'laboratorios', 'mamografia', 'medicina nuclear',
               'radiologia', 'radioterapia', 'resonancia', 'tomografia')


def _c(s):
    return ''.join(ch for ch in unicodedata.normalize('NFD', s or '') if unicodedata.category(ch) != 'Mn').lower().strip()


def tipo_de_seccion(seccion):
    s = _c(seccion)
    if s.startswith('internacion'):
        return 'Establecimiento con internacion'
    if s.startswith('emergencia') or s.startswith('urgencia'):
        return 'Centros de Urgencia o Emergencia'
    if s.startswith('farmacia'):
        return 'Farmacia'
    if s.startswith('optica'):
        return 'Optica'
    if s.startswith('ortopedia'):
        return 'Ortopedia'
    if s.startswith(DIAGNOSTICO):
        return 'Centros de diagnostico y tratamiento'
    return 'Ambulatorio/Especialista'


def _lineas(palabras):
    lineas = []
    for w in sorted(palabras, key=lambda w: (round(w['top']), w['x0'])):
        if lineas and abs(lineas[-1]['top'] - w['top']) < 2.5:
            lineas[-1]['ws'].append(w)
        else:
            lineas.append({'top': w['top'], 'ws': [w]})
    for l in lineas:
        l['ws'].sort(key=lambda w: w['x0'])
        l['txt'] = ' '.join(w['text'] for w in l['ws'])
    return lineas


def leer(ruta):
    import pdfplumber
    out = []
    seccion = None
    provincia = None
    with pdfplumber.open(ruta) as pdf:
        for pagina in pdf.pages[2:]:
            lineas = _lineas(pagina.extract_words(x_tolerance=1.5))
            if len(lineas) < 3:
                continue
            # Encabezado: nombre de la OS / PROVINCIA / "Cartilla de Prestadores"
            if lineas[2]['txt'].startswith('Cartilla de Prestadores'):
                provincia = lineas[1]['txt'].title()
            hdr = next((l for l in lineas if l['txt'].startswith('PRESTADOR ATENCI')), None)
            if not hdr:
                continue
            col = {}
            for w in hdr['ws']:
                t = _c(w['text'])
                for k in ('prestador', 'atencion', 'localidad', 'domicilio', 'telefono'):
                    if t.startswith(k):
                        col[k] = w['x0']
            if len(col) < 5:
                continue

            def banda(x):
                b = 'prestador'
                for k in ('atencion', 'localidad', 'domicilio', 'telefono'):
                    if x >= col[k] - 1.5:
                        b = k
                return b

            # Recorre las líneas: títulos de sección, encabezados de tabla y filas
            bloques = []  # (seccion, [lineas de la tabla])
            i = 0
            while i < len(lineas):
                l = lineas[i]
                sig = lineas[i + 1]['txt'] if i + 1 < len(lineas) else ''
                if re.fullmatch(r'\(\d+\)', sig.strip()):
                    seccion = l['txt']
                    i += 2
                    continue
                if l['top'] > hdr['top'] - 1 and not l['txt'].startswith('PRESTADOR ATENCI') and not re.fullmatch(r'\d+', l['txt']):
                    if not bloques or bloques[-1][0] != seccion:
                        bloques.append((seccion, []))
                    bloques[-1][1].append(l)
                elif l['txt'].startswith('PRESTADOR ATENCI') and bloques:
                    bloques.append((seccion, []))
                i += 1
            for sec, ls in bloques:
                if not sec or not ls:
                    continue
                anclas = [j for j, l in enumerate(ls) if any(banda(w['x0']) == 'atencion' and _c(w['text']) in ATENCION for w in l['ws'])]
                for n, j in enumerate(anclas):
                    # Ventana de la fila: de la mitad hacia la fila anterior a la mitad hacia la siguiente
                    top = ls[j]['top']
                    ant = ls[anclas[n - 1]]['top'] if n else -1e9
                    sig = ls[anclas[n + 1]]['top'] if n + 1 < len(anclas) else 1e9
                    desde, hasta = (top + ant) / 2 if n else top - 12, (top + sig) / 2 if n + 1 < len(anclas) else top + 12
                    celdas = {k: [] for k in col}
                    for l in ls:
                        if not (desde < l['top'] <= hasta) and l is not ls[j]:
                            continue
                        for w in l['ws']:
                            celdas[banda(w['x0'])].append((l['top'], w['x0'], w['text']))
                    txt = {k: ' '.join(t for _, _, t in sorted(v)) for k, v in celdas.items()}
                    # Localidad: primera línea localidad, segunda partido
                    locs = {}
                    for t, x, w in sorted(celdas['localidad']):
                        locs.setdefault(round(t), []).append(w)
                    partes = [' '.join(v) for _, v in sorted(locs.items())]
                    tel = txt['telefono'].replace('—', '').strip()
                    out.append({
                        'nombre': txt['prestador'], 'cuit': '', 'tipo': tipo_de_seccion(sec), 'especialidad': sec,
                        'ap': txt['atencion'], 'provincia': provincia or '', 'partido': partes[1] if len(partes) > 1 else '',
                        'localidad': partes[0] if partes else '', 'beneficiarios': '', 'domicilio': txt['domicilio'],
                        'telefono': tel, 'correo': '',
                    })
    return out


if __name__ == '__main__':
    import collections
    import sys
    filas = leer(sys.argv[1])
    print(len(filas))
    print(collections.Counter(f['tipo'] for f in filas).most_common())
    print(collections.Counter(f['provincia'] for f in filas).most_common(30))
    for f in filas[:4] + filas[3000:3006]:
        print(f)
