FROM node:0.10.28
MAINTAINER Jeffrey Charles <jeffreycharles@gmail.com>

EXPOSE 80
CMD ["node", "src/run-app.js"]