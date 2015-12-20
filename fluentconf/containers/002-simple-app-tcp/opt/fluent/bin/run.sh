#!/usr/bin/env bash

ifconfig | awk '/inet addr/{print substr($2,6)}' | grep 172 > /data/service-tcp.dat

echo "[${HOSTNAME}] Initialized successfully."
cd /opt/fluent/
