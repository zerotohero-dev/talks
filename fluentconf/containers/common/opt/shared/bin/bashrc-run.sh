#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# Init
sysctl -w net.core.somaxconn=32768

# Run the service
/opt/fluent/bin/run.sh
