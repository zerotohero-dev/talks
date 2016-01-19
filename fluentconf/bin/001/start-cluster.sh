#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 001 - Simple HTTP App

docker exec -d fluent_http node /opt/fluent

echo "Started the cluster."
