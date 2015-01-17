FROM node:0.10.35-slim
WORKDIR /usr/local/src
CMD [ "node", "build/node_modules" ]
