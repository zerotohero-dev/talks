#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged --cpuset-cpus="1" -i -t \
-h service-demo \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/004-demo-w-instrumentation/opt/fluent":/opt/fluent \
-p 8081:8081 \
-p 8003:8003 \
-p 5858:5858 \
fluent:service-demo /bin/bash