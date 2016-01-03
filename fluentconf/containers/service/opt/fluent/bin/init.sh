#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "${DIR}/.."

sysctl -w net.core.somaxconn=32768

ifconfig | awk '/inet addr/{print substr($2,6)}' | grep 172 > /data/"${1}".dat
