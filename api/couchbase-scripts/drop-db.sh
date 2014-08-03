#!/bin/bash

set -euo pipefail

bucket='poleland'
if [ $# -eq 1 ]; then
    bucket="$1"
fi

curl -X DELETE -u poleland:poleland \
    http://10.0.0.2:8091/pools/default/buckets/$bucket
