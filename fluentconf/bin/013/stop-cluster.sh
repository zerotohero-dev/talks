#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# 013 - DNS Round-Robin

docker stop fluent_sinopia
docker stop fluent_web
docker stop fluent_bastion
docker stop fluent_dns

docker stop region_1_fluent_rabbit
docker stop region_1_fluent_compute_1
docker stop region_1_fluent_compute_2
docker stop region_1_fluent_app_1
docker stop region_1_fluent_app_2
docker stop region_1_fluent_load_balancer
docker stop region_1_fluent_redis_compute
docker stop region_1_fluent_redis_app

docker stop region_2_fluent_rabbit
docker stop region_2_fluent_compute_1
docker stop region_2_fluent_compute_2
docker stop region_2_fluent_app_1
docker stop region_2_fluent_app_2
docker stop region_2_fluent_load_balancer
docker stop region_2_fluent_redis_compute
docker stop region_2_fluent_redis_app

echo "Stopped the cluster."
