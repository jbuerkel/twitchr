FROM mhart/alpine-node:7
LABEL maintainer "buerkelj@gmail.com"

WORKDIR /var/app
RUN addgroup -S twitchr && \
    adduser -SG twitchr twitchr && \
    chown twitchr:twitchr /var/app

USER twitchr

COPY . .
RUN npm install && \
    npm run dist && \
    npm prune

EXPOSE 3000
CMD [ "npm", "start" ]
