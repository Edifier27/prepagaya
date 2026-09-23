"""
Control antes de publicar los precios regenerados (lo corre la tarea
programada de .github/workflows/cuadros-sssalud.yml).

Compara lib/data/precios-oficiales.json nuevo contra la versión commiteada
(git HEAD). Falla (exit 1) si algún plan:
  - cambia más de UMBRAL (%) de un mes a otro, o
  - desaparece (estaba y ya no está).
Así un cambio raro en la fuente (plan renombrado, error de carga, región
distinta) no llega a la web sin que Darío lo revise.

Escribe un resumen en data/sssalud/ultimo-control.txt (se manda por Telegram).
"""
import json, os, subprocess, sys

UMBRAL = 15.0
RAIZ = os.path.join(os.path.dirname(__file__), '..', '..')
ARCHIVO = 'lib/data/precios-oficiales.json'


def main():
    nuevo = json.load(open(os.path.join(RAIZ, ARCHIVO), encoding='utf-8'))
    try:
        viejo_txt = subprocess.check_output(['git', 'show', f'HEAD:{ARCHIVO}'], cwd=RAIZ, text=True, encoding='utf-8')
        viejo = json.loads(viejo_txt)
    except subprocess.CalledProcessError:
        viejo = {'precios': {}}

    problemas, cambios = [], []
    for prep, planes in viejo['precios'].items():
        for plan, antes in planes.items():
            ahora = nuevo['precios'].get(prep, {}).get(plan)
            if ahora is None:
                problemas.append(f'{prep}/{plan}: desapareció (antes ${antes:,})')
                continue
            dif = (ahora / antes - 1) * 100
            if abs(dif) > UMBRAL:
                problemas.append(f'{prep}/{plan}: {dif:+.1f}% (${antes:,} → ${ahora:,})')
            elif abs(dif) > 0.01:
                cambios.append(dif)

    lineas = [f"Cuadros SSSalud — período {nuevo.get('periodoTexto')} (generado {nuevo.get('generado')})"]
    if cambios:
        lineas.append(f'{len(cambios)} planes cambiaron de precio, entre {min(cambios):+.2f}% y {max(cambios):+.2f}%.')
    else:
        lineas.append('Sin cambios de precio.')
    if problemas:
        lineas.append(f'⚠ {len(problemas)} planes para revisar (no se publicó):')
        lineas += [f'  • {p}' for p in problemas[:25]]
    resumen = '\n'.join(lineas)
    open(os.path.join(RAIZ, 'data', 'sssalud', 'ultimo-control.txt'), 'w', encoding='utf-8').write(resumen)
    print(resumen)
    sys.exit(1 if problemas else 0)


if __name__ == '__main__':
    main()
