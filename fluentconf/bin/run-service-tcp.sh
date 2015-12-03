#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged --cpuset-cpus="3" -i -t \
-h service-tcp \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/002-simple-app-tcp/opt/fluent":/opt/fluent \
-p 8002:8002 \
fluent:service-tcp /bin/bash
