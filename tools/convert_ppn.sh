#!/bin/sh

# convert ppn files to Uint8Array for porcupine wasm
# expects files named *_wasm.ppn, outputs .js

IN=$1
EXT=".js"
OUT="${IN/_wasm.ppn/$EXT}"
xxd -i -g 1 $1 $OUT
sed -i'.bak' -e '1s/^.*$/module.exports = new Uint8Array([/' -e '$d' $OUT
sed -i'.bak' -e '$d' $OUT
rm "$OUT.bak"
echo "]);" >> $OUT