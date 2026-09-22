# Cartilla OSDE por zona

Genera `lib/data/cartilla-zonas/osde.json` (sanatorios para internación y centros con
guardia 24 hs, por zona y por plan) a partir de las **cartillas PDF oficiales**
de OSDE. Solo instituciones: no se extraen médicos particulares.

Actualización (mensual):

1. `bash scripts/cartilla-osde/descargar.sh /ruta/temporal/pdfs` (~1 hora; no commitear los PDF).
2. `cd scripts/cartilla-osde && python merge.py /ruta/temporal/pdfs filiales.txt ../../lib/data/cartilla-zonas/osde.json`
   (requiere `pip install pymupdf`). Revisar que `faltantes` venga vacío.
3. Revisar el diff del JSON, `npx tsc --noEmit -p .`, `npm run build`.

`filiales.txt` es el listado de provincias → filiales que usa el propio buscador
de OSDE (sacado del bundle JS de osde.com.ar/cartilla-inteligente). Si OSDE
agrega o cambia filiales, actualizarlo desde ahí.
