#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged -i -t -d \
-h service-static-server \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/static-server/opt/fluent":/opt/fluent \
-v "${DIR}/../containers/static-server/etc/nginx/sites-enabled":/etc/nginx/sites-enabled \
-v "${DIR}/../containers/static-server/var/www":/var/www \
-p 8080:8080 \
fluent:service-static-server /bin/bash
