#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

docker rm -f fluent_rabbit
docker rm -f fluent_web
docker rm -f fluent_compute
docker rm -f fluent_app
docker rm -f fluent_bastion
docker rm -f fluent_sinopia
docker rm -f fluent_redis_compute
docker rm -f fluent_redis_app

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "${DIR}"

# Private NPM Registry & Mirror
docker run -d \
-h fluent-sinopia \
--name fluent_sinopia \
-v "${DIR}/../../containers/common/npm":/sinopia/storage \
rnbwd/sinopia

# RabbitMQ
docker run -d --hostname fluent-rabbit \
--name fluent_rabbit \
-p 15672:15672 \
rabbitmq:3-management

# Redis
docker run -d \
-h fluent-redis-compute \
-p 9379:6379 \
--name fluent_redis_compute \
redis
docker run -d \
-h fluent-redis-app \
-p 9380:6379 \
--name fluent_redis_app \
redis

# Simulates “the Internet”
docker run --privileged -i -t -d \
-h service-static-server \
--name fluent_web \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/static-server/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/static-server/etc/nginx/sites-enabled":/etc/nginx/sites-enabled \
-v "${DIR}/../../containers/static-server/var/www":/var/www \
fluent:service-static-server /bin/bash

# The Compute Service
docker run -d --privileged -i -t \
-h service-compute \
--name fluent_compute \
--env CLUSTER_SIZE=2 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/011-sharing-memory/compute/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/011-sharing-memory/compute/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_sinopia:npm \
--link fluent_web:web \
--link fluent_redis_compute:redis \
fluent:service-compute /bin/bash

# The API Service
docker run -d --privileged -i -t \
-h service-app \
--name fluent_app \
--env CLUSTER_SIZE=2 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/011-sharing-memory/service/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/011-sharing-memory/service/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_sinopia:npm \
--link fluent_redis_app:redis \
-p 8003:8003 \
fluent:service-app /bin/bash

docker run -d --privileged -i -t \
-h bastion \
--name fluent_bastion \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/common/local-modules":/locals \
-v "${DIR}/../../containers/bastion/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/bastion/var/log/fluent":/var/log/fluent \
--link fluent_compute:compute \
--link fluent_app:app \
--link fluent_sinopia:npm \
-p 4322:4322 \
fluent:bastion /bin/bash

echo "Set up the cluster."
