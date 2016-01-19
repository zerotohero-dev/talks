#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

ifconfig | awk '/inet addr/{print substr($2,6)}' | grep 172 > /data/bastion.dat

# TODO: try using --dns option instead.
# maybe `resolve dns` in etc/resolve.conf will help.
cp /data/resolv.conf /etc/
echo "set up dns!"

echo "[${HOSTNAME}] Initialized bastion."
cd /opt/fluent/

