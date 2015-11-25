#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

export IP_BASTION=$(cat /data/bastion.dat)
export IP_SERVICE_RESTIFY=$(cat /data/service-restify.dat)
export IP_SERVICE_HTTP=$(cat /data/service-http.dat)
export IP_SERVICE_TCP=$(cat /data/service-tcp.dat)
