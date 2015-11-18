#!/usr/bin/env bash

PD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd ${PD}/..

FILENAME=$( basename "$1" )
EXTENSION="${FILENAME##*.}"
FILENAME="${FILENAME%.*}"
DIR=$( dirname "$1" )

echo $FILENAME

babel --source-maps --out-file "$DIR/$FILENAME.js" $1
