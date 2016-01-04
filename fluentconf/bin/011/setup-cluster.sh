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
docker rm -f fluent_redis_bastion

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "${DIR}"

# Private NPM Registry & Mirror
docker run -d \
-h fluent-sinopia \
--name fluent_sinopia \
-v "${DIR}/../../containers/common/npm":/sinopia/storage \
rnbwd/sinopia
# -p 4873:4873

# RabbitMQ
docker run -d \
-h fluent-rabbit \
--name fluent_rabbit \
-p 15671:15671 \
-p 15672:15672 \
-p 25672:25672 \
rabbitmq:3-management
# -p 4369:4369 \
# -p 5671:5671 \
# -p 5672:5672 \

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
docker run -d \
-h fluent-redis-bastion \
-p 9381:6379 \
--name fluent_redis_bastion \
redis


# Simulates “the Internet”
docker run --privileged -i -t -d \
-h service-static-server \
--name fluent_web \
-p 9090:8080 \
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
-p 9005:8005 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/011-sharing-memory/service/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/011-sharing-memory/service/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_sinopia:npm \
--link fluent_redis_app:redis \
fluent:service-app /bin/bash

docker run -d --privileged -i -t \
-h bastion \
--name fluent_bastion \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/common/local-modules":/locals \
-v "${DIR}/../../containers/bastion/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/bastion/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_web:web \
--link fluent_compute:compute \
--link fluent_app:app \
--link fluent_sinopia:npm \
--link fluent_redis_bastion:redis \
-p 4322:4322 \
fluent:bastion /bin/bash

echo "Set up the cluster."
