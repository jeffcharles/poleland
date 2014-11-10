#!/bin/bash

docker run -d --name="poleland" -p 80:80 \
    -e "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" \
    -e "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" \
    -e "DYNAMO_DB_URL=http://$(ip route | awk '/docker/ { print $NF }'):8000" \
    -e "DYNAMO_DB_PREFIX=dev" \
    poleland
