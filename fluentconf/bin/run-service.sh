#!/usr/bin/env bash

DIR="$( cd "$( dirname "../${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged --cpuset-cpus="0" -i -t -v "${DIR}/containers/service/opt/fluent":/opt/fluent fluent:service /bin/bash
