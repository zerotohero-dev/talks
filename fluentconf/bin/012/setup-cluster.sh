#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

docker rm -f fluent_sinopia
docker rm -f fluent_rabbit
docker rm -f fluent_redis_compute
docker rm -f fluent_redis_app
docker rm -f fluent_redis_bastion
docker rm -f fluent_web
docker rm -f fluent_compute_1
docker rm -f fluent_compute_2
docker rm -f fluent_app_1
docker rm -f fluent_app_2
docker rm -f fluent_load_balancer
docker rm -f fluent_bastion

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "${DIR}"

# Private NPM Registry & Mirror (4873)
docker run -d \
-h fluent-sinopia \
--name fluent_sinopia \
-v "${DIR}/../../containers/common/npm":/sinopia/storage \
rnbwd/sinopia

# RabbitMQ
docker run -d \
-h fluent-rabbit \
--name fluent_rabbit \
-p 15671:15671 \
-p 15672:15672 \
-p 25672:25672 \
rabbitmq:3-management

# Redis (Compute)
docker run -d \
-h fluent-redis-compute \
-p 9379:6379 \
--name fluent_redis_compute \
redis

# Redis (App)
docker run -d \
-h fluent-redis-app \
-p 9380:6379 \
--name fluent_redis_app \
redis

# Redis (Bastion)
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

# Compute Service (1 of 2)
docker run -d --privileged -i -t \
-h service-compute-1 \
--name fluent_compute_1 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/012-bounce/compute001/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/012-bounce/compute001/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_sinopia:npm \
--link fluent_web:web \
--link fluent_redis_compute:redis \
fluent:service-compute /bin/bash

# Compute Service (2 of 2)
docker run -d --privileged -i -t \
-h service-compute-2 \
--name fluent_compute_2 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/012-bounce/compute002/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/012-bounce/compute002/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_sinopia:npm \
--link fluent_web:web \
--link fluent_redis_compute:redis \
fluent:service-compute /bin/bash

# API Service (1 of 2)
docker run -d --privileged -i -t \
-h service-app-1 \
--name fluent_app_1 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/012-bounce/service001/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/012-bounce/service001/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_sinopia:npm \
--link fluent_redis_app:redis \
fluent:service-app /bin/bash

# API Service (2 of 2)
docker run -d --privileged -i -t \
-h service-app-2 \
--name fluent_app_2 \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/012-bounce/service002/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/012-bounce/service002/var/log/fluent":/var/log/fluent \
--link fluent_rabbit:rabbit \
--link fluent_sinopia:npm \
--link fluent_redis_app:redis \
fluent:service-app /bin/bash

# Load Balancer
docker run -d --privileged -i -t \
-h service-load-balancer \
--name fluent_load_balancer \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/012-bounce/loadbalancer/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/012-bounce/loadbalancer/var/log/fluent":/var/log/fluent \
--link fluent_app_1:app1 \
--link fluent_app_2:app2 \
--link fluent_sinopia:npm \
fluent:service-load-balancer /bin/bash

# Bastion
docker run -d --privileged -i -t \
-h bastion \
--name fluent_bastion \
-v "${DIR}/../../containers/common/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/data":/data \
-v "${DIR}/../../containers/common/local-modules":/locals \
-v "${DIR}/../../containers/bastion/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/bastion/var/log/fluent":/var/log/fluent \
--link fluent_load_balancer:app \
--link fluent_sinopia:npm \
--link fluent_redis_bastion:redis \
-p 4322:4322 \
fluent:bastion /bin/bash

echo "Set up the cluster."
