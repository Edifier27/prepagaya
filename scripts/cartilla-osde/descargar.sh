#!/usr/bin/env bash
# Descarga las cartillas PDF oficiales de OSDE (una por filial y plan) desde
# el mismo endpoint que usa el botón "Descargar cartilla" de
# osde.com.ar/cartilla-inteligente. El servidor limita a ~15 pedidos por
# ventana, por eso va de a uno con pausa. Tarda ~1 hora (≈200 PDFs).
# Uso: bash scripts/cartilla-osde/descargar.sh <carpeta_destino>
set -u
DEST="${1:?carpeta destino}"
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DEST"
FILIALES=$(grep -oE "codFilial:[0-9]+" "$DIR/filiales.txt" | cut -d: -f2 | sort -un)
for f in $FILIALES; do
  ff=$(printf "%02d" "$f")
  for p in 21 31 41 45 51 70; do   # 210, 310, 410, 450, 510, Flux
    out="$DEST/Cartilla${ff}_${p}.pdf"
    if [ -s "$out" ] && head -c 4 "$out" | grep -q "%PDF"; then continue; fi
    code=$(curl -s -m 240 -o "$out" -w "%{http_code}" "https://www.osde.com.ar/cartilla-inteligente/downloadPDF/Cartilla${ff}_${p}.pdf")
    echo "$ff $p $code"
    [ "$code" = "200" ] || rm -f "$out"
    sleep 5
  done
done
