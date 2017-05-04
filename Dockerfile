FROM node:7.10.0

RUN curl https://nginx.org/keys/nginx_signing.key | apt-key add - && \
    echo deb http://nginx.org/packages/mainline/debian/ jessie nginx >> \
      /etc/apt/sources.list && \
    echo deb-src http://nginx.org/packages/mainline/debian/ jessie nginx >> \
      /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y nginx

WORKDIR /code

COPY package.json /code/package.json
RUN npm install

COPY .eslintrc /code/.eslintrc
COPY .stylelintrc /code/.stylelintrc
COPY bin/build /code/bin/build
COPY etc/cogs.js /code/etc/cogs.js
COPY etc/nginx.conf /code/etc/nginx.conf
COPY src /code/src
RUN MINIFY=1 bin/build

COPY bin /code/bin
COPY etc /code/etc

ENV CLIENT_URL http://localhost
ENV KEY foo
ENV MAIL_ENABLED 0
ENV MAIL_FROM_ADDRESS info@bruteball.com
ENV MAIL_FROM_NAME Bruteball
ENV POSTGRES_URL pg://postgres:postgres@postgres/postgres
ENV REGIONS dev=http://localhost
ENV SIGNAL_URL ws://localhost:8080

ARG VERSION
ENV VERSION $VERSION

CMD ["bin/client"]
