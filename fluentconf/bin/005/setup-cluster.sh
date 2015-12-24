#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker rm -f fluent_rabbit
docker rm -f fluent_web
docker rm -f fluent_compute
docker rm -f fluent_app
docker rm -f fluent_bastion

docker run -d \
-h service-rabbit \
--name fluent_rabbit \
-p 4369:4369 \
-p 5671:5671 \
-p 5672:5672 \
-p 15671:15671 \
-p 15672:15672 \
-p 25672:25672 \
rabbitmq:3-management

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

docker run -d --privileged -i -t \
-h service-compute \
--name fluent_compute \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/005-demo-split-compute/compute/opt/fluent":/opt/fluent \
fluent:service-compute /bin/bash

docker run -d --privileged -i -t \
-h service-app \
--name fluent_app \
-p 8003:8003 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/005-demo-split-compute/service/opt/fluent":/opt/fluent \
fluent:service-app /bin/bash

docker run -d --privileged -i -t \
-h bastion \
--name fluent_bastion \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/bastion/opt/fluent":/opt/fluent \
fluent:bastion /bin/bash

echo "Set up the cluster."
