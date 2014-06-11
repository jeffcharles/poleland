FROM ubuntu:14.04
MAINTAINER Jeffrey Charles <jeffreycharles@gmail.com>

# Install Node.js
RUN apt-get update && apt-get install -y wget
RUN /usr/bin/wget http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-x64.tar.gz -O - | tar -C /usr/local --strip-components 1 -xzf -

# Install Gulp
RUN npm install gulp@3.6.0 --global

ADD . /app
WORKDIR /app

# Install NPM dependencies
RUN npm install

EXPOSE 3000
CMD ["/usr/local/bin/node", "/app/src/run-app.js"]
