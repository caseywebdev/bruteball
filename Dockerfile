FROM node:0.12.7
ENV \
  NODE_ENV=production \
  PORT=80 \
  POSTGRES_URL=postgres://postgres:postgres@postgres/postgres \
  AWS_ACCESS_KEY_ID=123 \
  AWS_SECRET_ACCESS_KEY=456
COPY . /code
WORKDIR /code
RUN bin/bootstrap
RUN rm -fr src
EXPOSE 80
CMD ["bin/start"]
