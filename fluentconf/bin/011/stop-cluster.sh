#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 011 - Sharing Memory

docker stop fluent_rabbit
docker stop fluent_web
docker stop fluent_compute
docker stop fluent_app
docker stop fluent_bastion
docker stop fluent_sinopia
docker stop fluent_redis_app
docker stop fluent_redis_compute

echo "Stopped the cluster."
