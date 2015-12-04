#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

ifconfig | awk '/inet addr/{print substr($2,6)}' | grep 172 > /data/service-static-server.dat

echo "[${HOSTNAME}] Initialized successfully."
echo "[${HOSTNAME}] Warming up the engines… Please wait…"
service nginx start
echo "[${HOSTNAME}] Started NGINX."
