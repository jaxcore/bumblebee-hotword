#!/bin/sh

# This bash script converts Picovoice's wasm ppn files to
# a JavaScript Uint8Array for porcupine and bumblebee
#
# Example usage:
#
# sh convert_ppn.sh ok_google_wasm.ppn

IN=$1
EXT=".js"
OUT="${IN/_wasm.ppn/$EXT}"
echo "converting $IN to $OUT"
xxd -i -g 1 $1 $OUT
sed -i'.bak' -e '1s/^.*$/module.exports = new Uint8Array([/' -e '$d' $OUT
sed -i'.bak' -e '$d' $OUT
rm "$OUT.bak"
echo "]);" >> $OUT