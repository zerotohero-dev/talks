#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

ifconfig | awk '/inet addr/{print substr($2,6)}' | grep 172 > /data/service-region-002-load-balancer.dat

echo "[${HOSTNAME}] Initialized successfully."