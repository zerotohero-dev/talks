#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 009 - Private NPM

docker stop fluent_rabbit
docker stop fluent_web
docker stop fluent_compute
docker stop fluent_app
docker stop fluent_bastion
docker stop fluent_sinopia

echo "Stopped the cluster."
