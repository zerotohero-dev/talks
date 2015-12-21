#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run -d --privileged -i -t \
-h service-app \
-p 8005:8005 \
-p 8015:8015 \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/service/opt/fluent":/opt/fluent \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/service/var/log/fluent":/var/log/fluent \
fluent:service-app /bin/bash
