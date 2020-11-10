FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

USER node

COPY . .

EXPOSE 8081

ENTRYPOINT ["node","app"]

