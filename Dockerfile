FROM mhart/alpine-node:6

WORKDIR /app

COPY . .
RUN npm install && npm run typings && npm run dist

EXPOSE 3000
CMD [ "npm", "start" ]
