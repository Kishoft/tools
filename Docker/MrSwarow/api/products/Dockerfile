FROM node:14.4.0-alpine3.12

ENV TZ='America/Argentina/Buenos_Aires'

COPY ./products /api
COPY ./config /api

WORKDIR /api

RUN npm install
CMD node src/index.js