#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "../${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged --cpuset-cpus="1" -i -t \
-v "${DIR}/containers/service/opt/fluent":/opt/fluent \
-v "${DIR}/containers/common/data":/data \
fluent:service-restify /bin/bash
