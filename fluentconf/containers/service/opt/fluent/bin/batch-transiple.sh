#!/usr/bin/env bash

echo "Starting transpilation…"

PD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd $PD/..

find . -name "*.es" -type f -exec sh -c './bin/transpile.sh "{}"' \;

echo "Finished transpilation."
