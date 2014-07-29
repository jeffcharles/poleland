#!/bin/bash

set -euo pipefail

curl -X DELETE -u poleland:poleland \
    http://10.0.0.2:8091/pools/default/buckets/poleland
