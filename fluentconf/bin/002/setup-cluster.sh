#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 002 - Simple TCP App

docker rm -f fluent_tcp
docker rm -f fluent_bastion

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run -d --privileged --cpuset-cpus="3" -i -t \
-h service-tcp \
--name fluent_tcp \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/002-simple-app-tcp/opt/fluent":/opt/fluent \
-p 8002:8002 \
fluent:service-tcp /bin/bash

docker run -d --privileged -i -t --cpuset-cpus="0" \
-h bastion \
--name fluent_bastion \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/bastion/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers":/containers \
-p 4322:4322 \
--link fluent_tcp:app \
fluent:bastion /bin/bash

echo "Set up the cluster."
