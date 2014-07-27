#!/bin/bash

set -euo pipefail

curl -X PUT -H 'Content-Type: application/json' \
    http://10.0.0.2:8092/poleland/_design/polls \
    -d @/vagrant/api/design_docs/polls.json
