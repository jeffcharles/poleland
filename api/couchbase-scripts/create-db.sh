#!/bin/bash

set -euo pipefail

bucket='poleland'
port='11222'
if [ $# -eq 2 ]; then
    bucket="$1"
    port="$2"
elif [ $# -ne 0 ]; then
    echo 'Pass 0 or 2 arguments' 1>&2
    exit 1
fi

curl -X POST -u poleland:poleland http://10.0.0.2:8091/pools/default/buckets \
    -d authType=none \
    -d bucketType=couchbase \
    -d name=$bucket \
    -d proxyPort=$port \
    -d ramQuotaMB=200 \
    -d replicaNumber=0

sleep 1 # Bucket create seems to need a little time after responding

curl -X PUT -H 'Content-Type: application/json' \
    http://10.0.0.2:8092/$bucket/_design/polls \
    -d @/vagrant/api/couchbase-scripts/design_docs/polls.json
