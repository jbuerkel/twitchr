FROM mhart/alpine-node:7

WORKDIR /var/app

COPY . .
RUN npm install && npm run dist && npm prune

EXPOSE 3000
CMD [ "npm", "start" ]
