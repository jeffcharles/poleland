#!/bin/bash

set -euo pipefail # Unofficial bash strict mode
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$DIR/drop-db.sh

$DIR/create-db.sh

node $DIR/add-test-data.js
