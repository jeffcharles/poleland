#!/bin/bash

set -euo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"

$DIR/drop-tables.js
$DIR/create-tables.js
$DIR/add-test-data.js
