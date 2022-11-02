FROM node:16

LABEL maintainer="dyaa@gmail.com"

WORKDIR /src

COPY package.json .
RUN npm install

COPY . /src

ENTRYPOINT ["npm", "start"]