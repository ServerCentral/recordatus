FROM node:9-alpine

WORKDIR /home/node/app
COPY . .

RUN npm install

CMD npm run start