#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# Remove former containers first:
docker rm -f fluent_rabbit
docker rm -f fluent_static
docker rm -f fluent_app
docker rm -f fluent_compute
docker rm -f fluent_bastion

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "${DIR}"

# RabbitMQ
docker run -d \
-p 15671:15671 \
-p 15672:15672 \
-p 25672:25672 \
--name fluent_rabbit \
--hostname fluent-rabbit rabbitmq:3-management
# -p 4369:4369 \
# -p 5671:5671 \
# -p 5672:5672 \

# Simulates “the Internet”
docker run --privileged -i -t -d \
-h service-static-server \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/static-server/opt/fluent":/opt/fluent \
-v "${DIR}/../containers/static-server/etc/nginx/sites-enabled":/etc/nginx/sites-enabled \
-v "${DIR}/../containers/static-server/var/www":/var/www \
--name fluent_static \
fluent:service-static-server /bin/bash
# -p 8080:8080 \

# The API Service
docker run -d --privileged -i -t \
-h service-app \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/service/opt/fluent":/opt/fluent \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/service/var/log/fluent":/var/log/fluent \
--name fluent_app \
--link fluent_rabbit:rabbit \
--link fluent_static:web \
fluent:service-app /bin/bash
# -p 8005:8005 \
# -p 8015:8015 \

# The Compute Service
docker run -d --privileged -i -t \
-h service-compute \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/compute/opt/fluent":/opt/fluent \
-v "${DIR}/../containers/006-demo-eventbus-logaggr/compute/var/log/fluent":/var/log/fluent \
--name fluent_compute \
--link fluent_rabbit:rabbit \
--link fluent_static:web \
fluent:service-compute /bin/bash
# -p 8014:8014 \

docker run -d --privileged -i -t --cpuset-cpus="0" \
-h bastion \
-v "${DIR}/../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../containers/common/data":/data \
-v "${DIR}/../containers/bastion/opt/fluent":/opt/fluent \
--link fluent_rabbit:rabbit \
--link fluent_static:web \
--link fluent_compute:compute \
--link fluent_app:app \
--name fluent_bastion \
-p 4322:4322 \
fluent:bastion /bin/bash

echo "All done!"
