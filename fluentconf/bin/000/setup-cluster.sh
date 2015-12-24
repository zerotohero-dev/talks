#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

docker rm -f fluent_restify
docker rm -f fluent_bastion

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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
-p 4322:4322 \
fluent:bastion /bin/bash

echo "Set up the cluster."
