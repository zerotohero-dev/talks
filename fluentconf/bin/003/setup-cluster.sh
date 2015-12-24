#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

docker rm -f fluent_web
docker rm -f fluent_demo
docker rm -f fluent_bastion

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged -i -t -d \
-h service-static-server \
--name fluent_web \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/static-server/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/static-server/etc/nginx/sites-enabled":/etc/nginx/sites-enabled \
-v "${DIR}/../../containers/static-server/var/www":/var/www \
-p 8080:8080 \
fluent:service-static-server /bin/bash

docker run -d --privileged --cpuset-cpus="1" -i -t \
-h service-demo \
--name fluent_demo \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/003-the-real-deal/opt/fluent":/opt/fluent \
-p 8081:8081 \
-p 8003:8003 \
-p 5858:5858 \
fluent:service-demo /bin/bash

docker run -d --privileged -i -t --cpuset-cpus="0" \
-h bastion \
--name fluent_bastion \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/bastion/opt/fluent":/opt/fluent \
-p 4322:4322 \
fluent:bastion /bin/bash

echo "Set up the cluster."
