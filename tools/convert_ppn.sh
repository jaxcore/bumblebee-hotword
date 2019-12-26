#!/bin/sh

# convert ppn files to Uint8Array for porcupine wasm

xxd -i -g 1 $1 $2