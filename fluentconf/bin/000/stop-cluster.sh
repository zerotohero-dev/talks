#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 000 - Simple Restify App

docker stop fluent_restify
docker stop fluent_bastion
docker stop fluent_sinopia

echo "Stopped the cluster."
