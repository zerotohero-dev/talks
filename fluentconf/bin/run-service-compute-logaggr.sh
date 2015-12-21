#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run -d --privileged -i -t \
-h service-compute \
-p 8014:8014 \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/compute/opt/fluent":/opt/fluent \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/compute/var/log/fluent":/var/log/fluent \
fluent:service-compute /bin/bash
