#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 002 - Simple TCP App

docker exec -d fluent_tcp node /opt/fluent

echo "Started the cluster."
