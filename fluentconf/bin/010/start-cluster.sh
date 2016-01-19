#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 010 - Cluster

docker exec -d fluent_compute forever /usr/bin/node --abort_on_uncaught_exception /opt/fluent
docker exec -d fluent_app forever /usr/bin/node --abort_on_uncaught_exception /opt/fluent

echo "Started the cluster."
