FROM nginx:alpine

ENV PORT=4200
EXPOSE $PORT 80

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY /build .