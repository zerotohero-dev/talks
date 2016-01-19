#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 007 - Node.JS as a Service

docker exec -d fluent_compute forever /opt/fluent
docker exec -d fluent_app forever /opt/fluent

echo "Started the cluster."
