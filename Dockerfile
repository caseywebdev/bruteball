FROM node:8.4.0-alpine

ENV \
  CONSUL_TEMPLATE_VERSION='0.19.0' \
  CONTAINERPILOT_VERSION='3.3.4'

RUN \
  apk --no-cache add curl libc6-compat nginx python && \
  curl -fLsS https://releases.hashicorp.com/consul-template/$CONSUL_TEMPLATE_VERSION/consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.tgz | \
    tar xz -C /usr/local/bin && \
  curl -fLsS https://github.com/joyent/containerpilot/releases/download/$CONTAINERPILOT_VERSION/containerpilot-$CONTAINERPILOT_VERSION.tar.gz | \
    tar xz -C /usr/local/bin

WORKDIR /code

COPY package.json ./
RUN npm install

COPY .eslintrc .stylelintrc ./
COPY bin/build ./bin/
COPY src src
RUN MINIFY='1' bin/build

COPY bin bin
COPY etc etc

ARG VERSION
ENV \
  CLIENT_URL='http://localhost' \
  CONTAINERPILOT='/code/etc/containerpilot.json.gotmpl' \
  KEY='foo' \
  MAIL_ENABLED='0' \
  MAIL_FROM_ADDRESS='info@bruteball.com' \
  MAIL_FROM_NAME='Bruteball' \
  POSTGRES_URL='pg://postgres:postgres@postgres/postgres' \
  REGIONS='dev=http://localhost' \
  SIGNAL_URL='ws://localhost:8080' \
  VERSION="$VERSION"

CMD ["containerpilot"]
