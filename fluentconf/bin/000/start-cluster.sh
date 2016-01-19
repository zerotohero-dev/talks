#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 000 - Simple Restify App

docker exec -d fluent_restify node /opt/fluent

echo "Started the cluster."
