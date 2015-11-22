#!/usr/bin/env bash

DIR="$( cd "$( dirname "../${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged -i -t -v "${DIR}/containers/bastion/opt/fluent":/opt/fluent fluent:bastion /bin/bash
