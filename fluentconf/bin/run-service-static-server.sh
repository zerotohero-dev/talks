#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run -i -t \
-h static-server \
-v "${DIR}/../containers/service/opt/fluent":/opt/fluent \
-v "${DIR}/../containers/service/var/www":/var/www \
-v "${DIR}/../containers/common/data":/data \
-p 8088:8088 \
fluent:static-server /bin/bash
