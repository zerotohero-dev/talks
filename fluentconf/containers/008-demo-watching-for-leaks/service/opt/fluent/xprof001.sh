#!/usr/bin/env bash

# This program is distributed under the terms of the MIT license:
# <https://github.com/v0lkan/talks/blob/master/LICENSE.md>
# Send your comments and suggestions to <me@volkan.io>.

# Note: This will NOT work in a container where linux perf tools is not installed!
echo "node --perf_basic_prof_only_functions /opt/fluent"
node --perf_basic_prof_only_functions /opt/fluent
