FROM node:0.10.28
MAINTAINER Jeffrey Charles <jeffreycharles@gmail.com>

RUN npm install -g bower@1.3.12

COPY package.json /usr/src/node/package.json
COPY bower.json /usr/src/node/bower.json
COPY .bowerrc /usr/src/node/.bowerrc
COPY src /usr/src/node/src
COPY public /usr/src/node/public

RUN npm install --production
RUN bower install --allow-root

EXPOSE 80
CMD ["npm", "start"]
