#!/bin/bash

# Meant to be used by `vagrant up`

# Make sure everything is up to date (should just be security fixes)
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get upgrade --assume-yes

# Install a recent version of Node.js
wget http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-x64.tar.gz
tar -xzf node-v0.10.24-linux-x64.tar.gz -C /usr/local --strip-components 1

# Install NPM dependencies
cd /vagrant
npm install
