FROM node:9.3.0-alpine

ENV CONTAINERPILOT_VERSION='3.4.3'

RUN \
  apk --no-cache add curl make g++ nginx python && \
  mkdir -p /run/nginx && \
  curl -fLsS https://github.com/joyent/containerpilot/releases/download/$CONTAINERPILOT_VERSION/containerpilot-$CONTAINERPILOT_VERSION.tar.gz | \
    tar xz -C /usr/local/bin

WORKDIR /code

COPY package.json ./
RUN npm install --no-save

COPY .eslintrc .stylelintrc ./
COPY bin/build ./bin/
COPY etc/cogs.js etc/nginx.conf ./etc/
COPY src/client src/client
COPY src/shared src/shared
RUN MINIFY='1' bin/build

COPY bin bin
COPY etc etc
COPY src src

ARG VERSION
ENV \
  CLIENT_URL='http://localhost' \
  COMMAND='client' \
  CONSUL_SERVICE_NAME='bruteball' \
  CONSUL_SERVICE_TAGS='' \
  CONSUL_URL='' \
  CONTAINERPILOT='/code/etc/containerpilot.json5.gotmpl' \
  MAIL_ENABLED='0' \
  MAIL_FROM_ADDRESS='bruteball@example.com' \
  MAIL_FROM_NAME='Bruteball' \
  POSTGRES_URL='pg://postgres:postgres@postgres/postgres' \
  REGIONS='dev=http://localhost' \
  SIGNAL_URL='ws://localhost:8080' \
  VERSION="$VERSION" \
  WATCH='0'

CMD ["containerpilot"]
