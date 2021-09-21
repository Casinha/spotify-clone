FROM node:14.16.0-alpine3.12

ENV PORT 3000
EXPOSE 3000

WORKDIR /app

COPY ./package.json .

RUN apk update

RUN apk add --no-cache --virtual .health-check curl \
	&& apk add --no-cache --virtual .build-deps git build-base g++ \
	&& apk add --no-cache --virtual .npm-deps cairo-dev libjpeg-turbo-dev pango-dev \
    && npm install --production --silent \
    && apk del .build-deps

RUN mkdir -p ./dist
RUN mkdir -p ./node_modules

COPY ./dist ./dist

CMD node --max-old-space-size=8192 --expose-gc dist/server.js