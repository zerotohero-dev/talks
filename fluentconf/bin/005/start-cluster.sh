#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 005 - Demo (Split App and Compute Nodes)

docker exec -d fluent_app node /opt/fluent
docker exec -d fluent_compute node /opt/fluent

echo "Started the cluster."
