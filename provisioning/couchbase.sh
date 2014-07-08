#!/bin/bash

export DEBIAN_FRONTEND=noninteractive
apt-get -qy update
apt-get -qy upgrade
wget -q http://packages.couchbase.com/releases/2.2.0/couchbase-server-community_2.2.0_x86_64.deb
dpkg -i couchbase-server-community_2.2.0_x86_64.deb
