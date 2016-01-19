#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 000 - Simple Restify App

docker rm -f fluent_restify
docker rm -f fluent_bastion
docker rm -f fluent_sinopia

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Private NPM Registry & Mirror
docker run -d \
-h fluent-sinopia \
--name fluent_sinopia \
-v "${DIR}/../../containers/common/npm":/sinopia/storage \
rnbwd/sinopia

docker run -d --privileged --cpuset-cpus="1" -i -t \
-h service-restify \
--name fluent_restify \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/000-simple-app-restify/opt/fluent":/opt/fluent \
-p 8000:8000 \
fluent:service-restify /bin/bash

docker run -d --privileged -i -t --cpuset-cpus="0" \
-h bastion \
--name fluent_bastion \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/bastion/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers":/containers \
--link fluent_restify:app \
--link fluent_sinopia:npm \
-p 4322:4322 \
fluent:bastion /bin/bash

echo "Set up the cluster."
