#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 012 - Bounce

docker exec -d fluent_compute forever /opt/fluent --abort_on_uncaught_exception
docker exec -d fluent_app forever /opt/fluent --abort_on_uncaught_exception
docker exec -d fluent_load_balancer forever /opt/fluent --abort_on_uncaught_exception

echo "Started the cluster."
