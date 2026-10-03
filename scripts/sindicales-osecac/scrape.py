"""Delegaciones de OSECAC (Obra Social de Empleados de Comercio) por todo el país.

Fuente: el buscador público "Nuestras Delegaciones" del sitio oficial, que
pega a un endpoint propio sin login ni captcha:

  GET https://www.osecac.org.ar/Delegaciones/TablaDelegacion?tp=0&prov=&loc=&provNombre=

Devuelve un fragmento de HTML (no JSON) con todas las Delegaciones, Agencias,
Sub-Agencias y Corresponsalías del país en un solo pedido (confirmado
inspeccionando la red real del buscador oficial, 1-oct-2026; "tp=0" trae
todos los tipos, sin necesidad de pedir por provincia). Cada entrada trae
nombre, dirección, teléfono, horario y a veces email/WhatsApp; las
Delegaciones además traen lat/lon en el atributo data-assigned-id del link
"Ver en el mapa" ("lat/lon/NOMBRE"); las Agencias/Sub-Agencias declaran de
qué Delegación dependen pero no siempre tienen coordenadas propias.

IMPORTANTE (1-oct-2026): pedir "tp=0" con prov/provNombre VACÍOS devuelve la
lista cortada a mitad de Buenos Aires (~43 entidades, confirmado comparando
con el pedido filtrado por Córdoba, que trae entidades que el pedido sin
filtro ni siquiera llega a listar) — hay que pedir provincia por provincia.
El parámetro `prov`/`provNombre` es el nombre de la provincia tal cual lo
tipea el buscador, sin tilde (ej. "Cordoba", "Tucuman"), confirmado
inspeccionando la red real del buscador oficial.

LÍMITE CONOCIDO: Buenos Aires (la provincia con más delegaciones) sigue
devolviendo el mismo tope (~43 entidades) aunque se filtre por provincia —
el límite parece ser del lado del servidor y no se pudo evitar con el
parámetro `prov` solo. Probar con `loc` (localidad) si hace falta completarla
más adelante; por ahora queda marcada como parcial en vez de inventar el resto.

Uso:
  python scrape.py descargar ../../data/osecac
  python scrape.py generar ../../data/osecac ../../lib/data/sindicales-zonas/osecac.json
"""
import json, os, re, sys, time, urllib.parse, urllib.request

API = 'https://www.osecac.org.ar/Delegaciones/TablaDelegacion?tp=0&prov={prov}&loc=&provNombre={prov}&_={ts}'
UA = {'User-Agent': 'Mozilla/5.0 (PrepagaYa; datos publicos de delegaciones OSECAC)'}

# Sin tilde, tal cual los acepta el buscador oficial (confirmado con "Cordoba").
PROVINCIAS = [
    'Buenos Aires', 'Capital Federal', 'Catamarca', 'Chaco', 'Chubut', 'Cordoba',
    'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquen', 'Rio Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago Del Estero',
    'Tierra Del Fuego', 'Tucuman',
]


def descargar(raw_dir):
    os.makedirs(raw_dir, exist_ok=True)
    for prov in PROVINCIAS:
        url = API.format(prov=urllib.parse.quote(prov), ts=int(time.time() * 1000))
        req = urllib.request.Request(url, headers=UA)
        for intento in range(4):
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    html = r.read().decode('utf-8', errors='replace')
                destino = os.path.join(raw_dir, f'{prov.lower().replace(" ", "-")}.html')
                with open(destino, 'w', encoding='utf-8') as f:
                    f.write(html)
                print(f'OK {prov} → {destino} ({len(html)} caracteres)', flush=True)
                break
            except Exception as e:
                print(f'  reintento {intento + 1} ({prov}): {e}', file=sys.stderr)
                time.sleep(5 * (intento + 1))
        else:
            raise RuntimeError(f'No se pudo descargar la provincia {prov}')
        time.sleep(1)


CAMPOS = {
    'direccion': r'<strong>Dirección:</strong>\s*([^<]*?)\s*</li>',
    'telefono': r'<strong>Teléfono:</strong>\s*([^<]*?)\s*</li>',
    'email_whatsapp': r'<strong>Email\s*/\s*WhatsApp:</strong>\s*([^<]*?)\s*</li>',
    'horario': r'<strong>Horario:</strong>\s*([^<]*?)\s*</li>',
    'delegacion_padre': r'<strong>Delegación:</strong>\s*([^<]*?)\s*</li>',
}


def parsear(html):
    # Cada entrada arranca con "<h3> Tipo: NOMBRE </h3>"; re.split con grupos
    # devuelve [antes, tipo1, nombre1, cuerpo1, tipo2, nombre2, cuerpo2, ...].
    partes = re.split(r'<h3>\s*([^<:]+?):\s*([^<]+?)\s*</h3>', html)
    entidades = []
    for i in range(1, len(partes) - 2, 3):
        tipo, nombre, cuerpo_y_resto = partes[i], partes[i + 1], partes[i + 2]
        # El "cuerpo" de esta entrada es todo hasta el próximo <h3> (que ya
        # quedó cortado por el split): basta con buscar los campos ahí nomás,
        # pero cuerpo_y_resto en realidad ya incluye solo hasta el próximo
        # separador porque re.split corta justo en cada <h3>.
        cuerpo = cuerpo_y_resto
        entidad = {'tipo': tipo.strip(), 'nombre': nombre.strip()}
        for campo, patron in CAMPOS.items():
            m = re.search(patron, cuerpo)
            if m and m.group(1).strip():
                entidad[campo] = re.sub(r'\s+', ' ', m.group(1)).strip()
        m_geo = re.search(r"data-assigned-id=\"(-?\d+\.\d+)/(-?\d+\.\d+)/([^\"]*)\"", cuerpo)
        if m_geo:
            entidad['lat'] = float(m_geo.group(1))
            entidad['lon'] = float(m_geo.group(2))
        entidades.append(entidad)
    return entidades


def generar(raw_dir, destino):
    entidades = []
    vistos = set()  # (tipo, nombre, direccion) — Agencias/Sub-Agencias pueden repetirse si el buscador las cruza en más de una provincia
    for prov in PROVINCIAS:
        archivo = os.path.join(raw_dir, f'{prov.lower().replace(" ", "-")}.html')
        if not os.path.exists(archivo):
            print(f'  falta el archivo de {prov}, se salteó', file=sys.stderr)
            continue
        with open(archivo, encoding='utf-8') as f:
            html = f.read()
        for e in parsear(html):
            clave = (e['tipo'], e['nombre'], e.get('direccion', ''))
            if clave in vistos:
                continue
            vistos.add(clave)
            e['provincia'] = prov
            entidades.append(e)
    if not entidades:
        raise RuntimeError('El parser no encontró ninguna entidad — revisar si cambió el HTML del sitio')
    tipos = {}
    for e in entidades:
        tipos[e['tipo']] = tipos.get(e['tipo'], 0) + 1
    salida = {
        'fuente': 'OSECAC (Obra Social de Empleados de Comercio) — buscador oficial de delegaciones, osecac.org.ar/Delegaciones',
        'descargado': time.strftime('%Y-%m-%d'),
        'total': len(entidades),
        'porTipo': tipos,
        'provinciasParciales': ['Buenos Aires'],
        'notaProvinciasParciales': 'El buscador oficial limita la cantidad de resultados por pedido; Buenos Aires tiene más delegaciones de las que devuelve aunque se filtre por esa provincia sola.',
        'entidades': entidades,
    }
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, 'w', encoding='utf-8') as f:
        json.dump(salida, f, ensure_ascii=False, indent=2)
    print(f'OK → {destino}: {len(entidades)} entidades {tipos}')


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    comando = sys.argv[1]
    if comando == 'descargar':
        descargar(sys.argv[2])
    elif comando == 'generar':
        generar(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
        sys.exit(1)
