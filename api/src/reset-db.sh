#!/bin/bash

set -euo pipefail # Unofficial bash strict mode

curl -X DELETE -u poleland:poleland \
    http://10.0.0.2:8091/pools/default/buckets/poleland

curl -X POST -u poleland:poleland http://10.0.0.2:8091/pools/default/buckets \
    -d authType=none \
    -d bucketType=couchbase \
    -d name=poleland \
    -d proxyPort=11222 \
    -d ramQuotaMB=200 \
    -d replicaNumber=0

sleep 1 # Bucket create seems to need a little time after responding

node /vagrant/api/src/add-test-data.js
