#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "../${BASH_SOURCE[0]}" )" && pwd )"

docker run --privileged -i -t --cpuset-cpus="0" \
-v "${DIR}/containers/bastion/opt/fluent":/opt/fluent \
-v "${DIR}/containers/common/data":/data \
fluent:bastion /bin/bash
