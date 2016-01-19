#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

curl -X "POST" "http://app:8003/api/v1/graph" \
    -H "Content-Type: application/graphql" \
    -d '{
    urls(tag: "tech")
}'

