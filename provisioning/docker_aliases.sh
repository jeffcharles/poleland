#!/bin/bash

alias do-node="sudo docker run -v /vagrant:/usr/src/node --net=host \
    -e 'AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID' \
    -e 'AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY' \
    -e 'DYNAMO_DB_PREFIX=$DYNAMO_DB_PREFIX' \
    -it node:0.10.28"
