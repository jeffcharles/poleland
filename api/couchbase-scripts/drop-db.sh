#!/bin/bash

set -euo pipefail

bucket='poleland'
if [ $# -eq 1 ]; then
    bucket="$1"
fi

existsStatusCode=$(curl -s -o /dev/null -w "%{http_code}" http://10.0.0.2:8091/pools/default/buckets/$bucket)
if [ $existsStatusCode -eq 200 ]; then
    curl -X DELETE -u poleland:poleland \
        http://10.0.0.2:8091/pools/default/buckets/$bucket
fi
