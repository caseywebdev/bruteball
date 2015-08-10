FROM node:0.12.7
ENV \
  PORT=80 \
  POSTGRES_URL=postgres://postgres:postgres@postgres/postgres \
  AWS_ACCESS_KEY_ID=123 \
  AWS_SECRET_ACCESS_KEY=456 \
  MINIFY=1
COPY . /code
WORKDIR /code
RUN make install
EXPOSE 80
CMD ["make", "start"]
