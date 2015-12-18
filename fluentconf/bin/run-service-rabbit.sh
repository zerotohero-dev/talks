#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

docker run -d \
-p 4369:4369 \
-p 5671:5671 \
-p 5672:5672 \
-p 15671:15671 \
-p 15672:15672 \
-p 25672:25672 \
--hostname fluent-rabbit rabbitmq:3-management
