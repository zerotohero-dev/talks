#!/usr/bin/env bash

# vim /etc/bash.bashrc

INJECTED_RUNNER="/opt/shared/bin/bashrc-run.sh"
if [ -f "${INJECTED_RUNNER}" ]; then
    "${INJECTED_RUNNER}"
fi
alias setenv="source /opt/shared/bin/env.sh"
