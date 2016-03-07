#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

echo "ab -n 10 -c 2 http://app:8003/benchmark/get-tags"
ab -n 10 -c 2 http://app:8003/benchmark/get-tags | grep "per second"
