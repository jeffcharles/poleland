FROM nginx:1.7.1
MAINTAINER Jeffrey Charles <jeffreycharles@gmail.com>

RUN apt-get update && apt-get install -y git-core wget
RUN wget http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-x64.tar.gz -O - | tar -C /usr/local --strip-components 1 -xzf -
RUN npm install --global --production bower@1.3.2

ADD ./nginx.conf /etc/nginx.conf
ADD ./bower.json /vagrant/ui/bower.json
ADD ./.bowerrc /vagrant/ui/.bowerrc
ADD ./static /vagrant/ui/static
RUN cd /vagrant/ui && bower install --allow-root
