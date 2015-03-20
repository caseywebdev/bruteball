FROM node:0.12.0
ENV NODE_ENV=production
COPY . /code
WORKDIR /code
RUN bin/bootstrap
RUN rm -fr src
CMD ["bin/start"]
