"""Parser de las cartillas PDF oficiales de OSDE (downloadPDF/CartillaFF_PP.pdf).

Extrae solo instituciones de dos secciones:
  - SANATORIOS PARA INTERNACIÓN
  - CENTROS CON SERVICIO DE GUARDIA (LAS 24 HS)
Uso: python parse.py pdfs/Cartilla60_31.pdf [...]  -> imprime JSON
"""
import json, re, sys, io, unicodedata
import pymupdf

SECCIONES = {
    'SANATORIOS PARA INTERNACI': 'internacion',
    'CENTROS CON SERVICIO DE GUARDIA': 'guardia',
}
MARCAS = {
    '(***)': 'solo-cartilla',   # internación con profesionales de cartilla exclusivamente
    '(**)': 'cuerpo-propio',    # solamente con su cuerpo profesional
    '(*)': 'mixto',             # con su cuerpo profesional o con médicos de cartilla
}
FIN_BLOQUE = ('(*) Instituciones', '(**) Instituciones', '(***) Instituciones', 'PARA TENER EN CUENTA')


def norm(s):
    return re.sub(r'\s+', ' ', s.replace(' ', ' ')).strip()


def es_cont_tel(tel_prev, t):
    """¿La línea t continúa el teléfono anterior (en vez de ser la dirección de otra sede)?"""
    if tel_prev.count('(') > tel_prev.count(')'):
        return True  # "(Solo" / "(011)" cortado
    if re.search(r'\(\d{2,4}\)$', tel_prev):
        return True  # termina en código de área
    if re.search(r'para socios$', tel_prev) and re.match(r'^[A-Z]{2,6}$', t):
        return True  # "... WhatsApp preferencial para socios" + "OSDE"
    if re.search(r'\b\d{2,4}-\d{4}\b', t) or re.match(r'^(0800|0810|15-|\d{3,5}-\d{5,8})', t):
        return True
    if re.match(r'^(WhatsApp|Fax|Urg|Int\.|interno|Opci[oó]n|Turnos|llamados|guardia)', t, re.I):
        return True
    # solo números/separadores ("451-430", "15608634", "501 - 502") o que
    # arranca con código de área "(0343) 4206755 GUARDIA MEDICA 24 HS"
    if re.match(r'^[\d\s()/\-–,.y]+$', t) and len(re.sub(r'\D', '', t)) >= 3:
        return True
    if re.match(r'^\(0\d{2,4}\)\s*\d', t):
        return True
    return False


def lineas(page):
    out = []
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            txt = norm(''.join(s['text'] for s in l['spans']))
            if not txt:
                continue
            f = l['spans'][0]
            out.append({
                'txt': txt,
                'size': round(f['size']),
                'bold': 'Bold' in f['font'],
                'italic': 'It' in f['font'] or 'Formata' in f['font'],
                'x': l['bbox'][0],
            })
    return out


def parse_pdf(path):
    d = pymupdf.open(path)
    m = re.search(r'Cartilla(\d+)_(\d+)', path)
    filial, plan = m.group(1), m.group(2)
    vigencia = None
    first = d[0].get_text()
    mv = re.search(r'Vigencia (\d{2}/\d{2}/\d{4})', first)
    if mv:
        vigencia = mv.group(1)
    mf = re.search(r'Filial (.+)', first)
    filial_nombre = norm(mf.group(1)) if mf else None

    items = []
    seccion = None
    zona = None
    actual = None
    cerrado = False  # tras la leyenda de asteriscos, ignorar el resto de la columna/página

    def cerrar():
        nonlocal actual
        if actual:
            items.append(actual)
        actual = None

    for pi in range(d.page_count):
        cerrado = False
        for ln in lineas(d[pi]):
            t = ln['txt']
            if ln['size'] >= 12:  # título de sección
                cerrar()
                seccion = None
                for k, v in SECCIONES.items():
                    if t.upper().startswith(k):
                        seccion = v
                        # "SANATORIOS PARA INTERNACIÓN - Ciudad de Buenos Aires"
                        if ' - ' in t:
                            zona = norm(t.split(' - ', 1)[1])
                        break
                continue
            if seccion is None:
                continue
            if ln['size'] <= 8:  # número de página / texto introductorio
                continue
            if t.startswith(FIN_BLOQUE):
                cerrar()
                cerrado = True
                continue
            if ln['bold'] and ln['size'] == 10:  # subtítulo de zona
                cerrar()
                cerrado = False  # en el interior la leyenda va ARRIBA de la lista
                zona = t
                continue
            if cerrado:
                continue
            if ln['bold']:
                # nombre (puede venir partido en 2 líneas bold seguidas)
                if actual and not actual['sedes'] and not actual['notas']:
                    actual['nombre'] = norm(actual['nombre'] + ' ' + t)
                    continue
                cerrar()
                marca = None
                for k, v in MARCAS.items():
                    if t.startswith(k):
                        marca = v
                        t = norm(t[len(k):])
                        break
                actual = {'filial': filial, 'filialNombre': filial_nombre, 'plan': plan,
                          'seccion': seccion, 'zona': zona, 'nombre': t, 'marca': marca,
                          'notas': [], 'sedes': [], 'pagina': pi}
                continue
            if actual is None:
                continue
            if ln['italic'] or (t.startswith('(') and t.endswith(')') and not actual['sedes'])                     or re.match(r'^Exclusivo plan', t, re.I):
                if actual['sedes'] and actual['sedes'][-1]['tel'] is None and not actual['sedes'][-1]['lineas']:
                    pass
                # nota puede continuar en la línea siguiente
                if actual['notas'] and not actual['notas'][-1].endswith(')'):
                    actual['notas'][-1] = norm(actual['notas'][-1] + ' ' + t)
                else:
                    actual['notas'].append(t)
                continue
            sede = actual['sedes'][-1] if actual['sedes'] else None
            if t.startswith('Tel.'):
                if sede is None:
                    sede = {'direccion': None, 'lineas': [], 'tel': None, 'email': None}
                    actual['sedes'].append(sede)
                sede['tel'] = norm(t[4:])
                continue
            if '@' in t and ' ' not in t:
                if sede:
                    sede['email'] = t
                continue
            if sede and sede['tel'] is not None and sede['email'] is None and es_cont_tel(sede['tel'], t):
                sede['tel'] = norm(sede['tel'] + ' ' + t)  # continuación del teléfono
                continue
            if sede is None or sede['tel'] is not None or sede['email'] is not None:
                sede = {'direccion': t, 'lineas': [], 'tel': None, 'email': None}
                actual['sedes'].append(sede)
            else:
                sede['lineas'].append(t)
        # fin de página: la entrada puede continuar en la siguiente
    cerrar()

    for it in items:
        for s in it['sedes']:
            s['localidad'] = ' '.join(s.pop('lineas')) or None
        # descarta "sedes" que en realidad son texto de recuadros laterales
        # (ej. "Acreditación"): sin número en la dirección y sin teléfono
        it['sedes'] = [s for s in it['sedes']
                       if s['tel'] or s['localidad'] or re.search(r'\d', s['direccion'] or '')]
    return {'filial': filial, 'filialNombre': filial_nombre, 'plan': plan,
            'vigencia': vigencia, 'items': items}


if __name__ == '__main__':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    res = [parse_pdf(p) for p in sys.argv[1:]]
    print(json.dumps(res, ensure_ascii=False, indent=1))
