#!/bin/bash

set -euo pipefail

sudo docker restart poleland-api-container
sudo docker restart poleland-ui-container
sudo docker restart poleland-routing-container
