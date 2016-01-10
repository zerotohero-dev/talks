#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

docker exec -d region_1_fluent_compute_1 \
/usr/bin/forever -o /var/log/fluent/forever-region_1_fluent_compute_1.log start /opt/fluent/index.js

docker exec -d region_1_fluent_compute_2 \
/usr/bin/forever -o /var/log/fluent/forever-region_1_fluent_compute_2.log start /opt/fluent/index.js

docker exec -d region_1_fluent_app_1 \
/usr/bin/forever -o /var/log/fluent/forever-region_1_fluent_app_1.log start /opt/fluent/index.js

docker exec -d region_1_fluent_app_2 \
/usr/bin/forever -o /var/log/fluent/forever-region_1_fluent_app_2.log start /opt/fluent/index.js

docker exec -d region_1_fluent_load_balancer \
/usr/bin/forever -o /var/log/fluent/forever-region_1_fluent_load_balancer.log start /opt/fluent/index.js

docker exec -d region_2_fluent_compute_1 \
/usr/bin/forever -o /var/log/fluent/forever-region_2_fluent_compute_1.log start /opt/fluent/index.js

docker exec -d region_2_fluent_compute_2 \
/usr/bin/forever -o /var/log/fluent/forever-region_2_fluent_compute_2.log start /opt/fluent/index.js

docker exec -d region_2_fluent_app_1 \
/usr/bin/forever -o /var/log/fluent/forever-region_2_fluent_app_1.log start /opt/fluent/index.js

docker exec -d region_2_fluent_app_2 \
/usr/bin/forever -o /var/log/fluent/forever-region_2_fluent_app_2.log start /opt/fluent/index.js

docker exec -d region_2_fluent_load_balancer \
/usr/bin/forever -o /var/log/fluent/forever-region_2_fluent_load_balancer.log start /opt/fluent/index.js

echo "Started the cluster."
