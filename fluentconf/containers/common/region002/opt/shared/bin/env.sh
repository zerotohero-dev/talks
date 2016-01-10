#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

if [ -f /data/bastion.dat ]; then
    export IP_BASTION=$(cat /data/bastion.dat)
fi

if [ -f /data/service-restify.dat ]; then
    export IP_SERVICE_RESTIFY=$(cat /data/service-restify.dat)
fi

if [ -f /data/service-http.dat ]; then
    export IP_SERVICE_HTTP=$(cat /data/service-http.dat)
fi

if [ -f /data/service-tcp.dat ]; then
    export IP_SERVICE_TCP=$(cat /data/service-tcp.dat)
fi

if [ -f /data/service-demo.dat ]; then
    export IP_SERVICE_DEMO=$(cat /data/service-demo.dat)
fi
