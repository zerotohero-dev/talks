#!/usr/bin/env bash

docker exec -d fluent_compute forever /opt/fluent
docker exec -d fluent_app forever /opt/fluent
docker exec -d fluent_web /bin/bash

echo "Started the cluster."
