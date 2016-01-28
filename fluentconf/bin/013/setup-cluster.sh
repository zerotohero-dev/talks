#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 013 - DNS Round-Robin

docker rm -f fluent_sinopia
docker rm -f fluent_web
docker rm -f fluent_bastion
docker rm -f fluent_dns

docker rm -f region_1_fluent_rabbit
docker rm -f region_1_fluent_compute_1
docker rm -f region_1_fluent_compute_2
docker rm -f region_1_fluent_app_1
docker rm -f region_1_fluent_app_2
docker rm -f region_1_fluent_load_balancer
docker rm -f region_1_fluent_redis_compute
docker rm -f region_1_fluent_redis_app

docker rm -f region_2_fluent_rabbit
docker rm -f region_2_fluent_compute_1
docker rm -f region_2_fluent_compute_2
docker rm -f region_2_fluent_app_1
docker rm -f region_2_fluent_app_2
docker rm -f region_2_fluent_load_balancer
docker rm -f region_2_fluent_redis_compute
docker rm -f region_2_fluent_redis_app

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "${DIR}"

docker run --name fluent_dns -it -d --publish 53:53/udp --publish 10000:10000 -v "${DIR}/../../containers/common/dns":/data sameersbn/bind:latest

# Private NPM Registry & Mirror (4873)
docker run -d \
-h fluent-sinopia \
--name fluent_sinopia \
-v "${DIR}/../../containers/common/npm":/sinopia/storage \
rnbwd/sinopia

# Region 1: RabbitMQ
docker run -d --hostname fluent-rabbit \
--name region_1_fluent_rabbit \
-p 15672:15672 \
rabbitmq:3-management

# Region 2: RabbitMQ
docker run -d --hostname fluent-rabbit \
--name region_2_fluent_rabbit \
-p 15673:15672 \
rabbitmq:3-management

# Region 1: Redis (Compute)
docker run -d \
-h region-1-fluent-redis-compute \
-p 9379:6379 \
--name region_1_fluent_redis_compute \
redis

# Region 1: Redis (App)
docker run -d \
-h region-1-fluent-redis-app \
-p 9380:6379 \
--name region_1_fluent_redis_app \
redis

# Region 2: Redis (Compute)
docker run -d \
-h region-2-fluent-redis-compute \
-p 9279:6379 \
--name region_2_fluent_redis_compute \
redis

# Region 2: Redis (App)
docker run -d \
-h region-2-fluent-redis-app \
-p 9280:6379 \
--name region_2_fluent_redis_app \
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

# Region 1: Compute Service (1 of 2)
docker run -d --privileged -i -t \
-h region-1-service-compute-1 \
--env CLUSTER_SIZE=1 \
--name region_1_fluent_compute_1 \
-v "${DIR}/../../containers/common/region001/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region001/data":/data \
-v "${DIR}/../../containers/013-round-robin/region001/compute001/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region001/compute001/var/log/fluent":/var/log/fluent \
--link region_1_fluent_rabbit:rabbit \
--link region_1_fluent_redis_compute:redis \
--link fluent_sinopia:npm \
--link fluent_web:web \
fluent:service-compute /bin/bash

# Region 1: Compute Service (2 of 2)
docker run -d --privileged -i -t \
--env CLUSTER_SIZE=1 \
-h region-1-service-compute-2 \
--name region_1_fluent_compute_2 \
-v "${DIR}/../../containers/common/region001/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region001/data":/data \
-v "${DIR}/../../containers/013-round-robin/region001/compute002/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region001/compute002/var/log/fluent":/var/log/fluent \
--link region_1_fluent_rabbit:rabbit \
--link region_1_fluent_redis_compute:redis \
--link fluent_sinopia:npm \
--link fluent_web:web \
fluent:service-compute /bin/bash

# Region 1: API Service (1 of 2)
docker run -d --privileged -i -t \
--env CLUSTER_SIZE=1 \
-h region-1-service-app-1 \
--name region_1_fluent_app_1 \
-v "${DIR}/../../containers/common/region001/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region001/data":/data \
-v "${DIR}/../../containers/013-round-robin/region001/service001/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region001/service001/var/log/fluent":/var/log/fluent \
--link region_1_fluent_rabbit:rabbit \
--link region_1_fluent_redis_app:redis \
--link fluent_sinopia:npm \
fluent:service-app /bin/bash

# Region 1: API Service (2 of 2)
docker run -d --privileged -i -t \
--env CLUSTER_SIZE=1 \
-h region-1-service-app-2 \
--name region_1_fluent_app_2 \
-v "${DIR}/../../containers/common/region001/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region001/data":/data \
-v "${DIR}/../../containers/013-round-robin/region001/service002/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region001/service002/var/log/fluent":/var/log/fluent \
--link region_1_fluent_rabbit:rabbit \
--link region_1_fluent_redis_app:redis \
--link fluent_sinopia:npm \
fluent:service-app /bin/bash

# Region 1: Load Balancer
docker run -d --privileged -i -t \
-h region-1-service-load-balancer \
--name region_1_fluent_load_balancer \
-v "${DIR}/../../containers/common/region001/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region001/data":/data \
-v "${DIR}/../../containers/013-round-robin/region001/loadbalancer/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region001/loadbalancer/var/log/fluent":/var/log/fluent \
--link region_1_fluent_app_1:app1 \
--link region_1_fluent_app_2:app2 \
--link fluent_sinopia:npm \
fluent:service-load-balancer /bin/bash

# Region 2: Compute Service (1 of 2)
docker run -d --privileged -i -t \
-h region-2-service-compute-1 \
--env CLUSTER_SIZE=1 \
--name region_2_fluent_compute_1 \
-v "${DIR}/../../containers/common/region002/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region002/data":/data \
-v "${DIR}/../../containers/013-round-robin/region002/compute001/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region002/compute001/var/log/fluent":/var/log/fluent \
--link region_2_fluent_rabbit:rabbit \
--link region_2_fluent_redis_compute:redis \
--link fluent_sinopia:npm \
--link fluent_web:web \
fluent:service-compute /bin/bash

# Region 2: Compute Service (2 of 2)
docker run -d --privileged -i -t \
-h region-2-service-compute-2 \
--env CLUSTER_SIZE=1 \
--name region_2_fluent_compute_2 \
-v "${DIR}/../../containers/common/region002/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region002/data":/data \
-v "${DIR}/../../containers/013-round-robin/region002/compute002/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region002/compute002/var/log/fluent":/var/log/fluent \
--link region_2_fluent_rabbit:rabbit \
--link region_2_fluent_redis_compute:redis \
--link fluent_sinopia:npm \
--link fluent_web:web \
fluent:service-compute /bin/bash

# Region 2: API Service (1 of 2)
docker run -d --privileged -i -t \
--env CLUSTER_SIZE=1 \
-h region-2-service-app-1 \
--name region_2_fluent_app_1 \
-v "${DIR}/../../containers/common/region002/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region002/data":/data \
-v "${DIR}/../../containers/013-round-robin/region002/service001/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region002/service001/var/log/fluent":/var/log/fluent \
--link region_2_fluent_rabbit:rabbit \
--link region_2_fluent_redis_app:redis \
--link fluent_sinopia:npm \
fluent:service-app /bin/bash

# Region 2: API Service (2 of 2)
docker run -d --privileged -i -t \
--env CLUSTER_SIZE=1 \
-h region-2-service-app-2 \
--name region_2_fluent_app_2 \
-v "${DIR}/../../containers/common/region002/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region002/data":/data \
-v "${DIR}/../../containers/013-round-robin/region002/service002/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region002/service002/var/log/fluent":/var/log/fluent \
--link region_2_fluent_rabbit:rabbit \
--link region_2_fluent_redis_app:redis \
--link fluent_sinopia:npm \
fluent:service-app /bin/bash

# Region 2: Load Balancer
docker run -d --privileged -i -t \
-h region-2-service-load-balancer \
--name region_2_fluent_load_balancer \
-v "${DIR}/../../containers/common/region002/opt/shared":/opt/shared \
-v "${DIR}/../../containers/common/region002/data":/data \
-v "${DIR}/../../containers/013-round-robin/region002/loadbalancer/opt/fluent":/opt/fluent \
-v "${DIR}/../../containers/013-round-robin/region002/loadbalancer/var/log/fluent":/var/log/fluent \
--link region_2_fluent_app_1:app1 \
--link region_2_fluent_app_2:app2 \
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
-v "${DIR}/../../containers":/containers \
--link fluent_sinopia:npm \
--link fluent_dns:dns \
-p 4322:4322 \
fluent:bastion /bin/bash

docker inspect fluent_dns | grep "\"IPAddress" > 'dns.txt'

echo "Configuring round-robin DNS…"
./setup-dns.js

echo "Set up the cluster."
