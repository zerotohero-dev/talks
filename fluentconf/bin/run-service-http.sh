#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged --cpuset-cpus="2" -i -t \
-h service-http \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/001-simple-app-http/opt/fluent":/opt/fluent \
-p 8001:8001 \
fluent:service-http /bin/bash
