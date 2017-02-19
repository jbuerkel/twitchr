FROM mhart/alpine-node:7

WORKDIR /var/app

COPY . .
RUN npm install && npm run dist

EXPOSE 3000
CMD [ "npm", "start" ]
