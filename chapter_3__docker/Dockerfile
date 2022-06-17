FROM node:latest

COPY . .

RUN npm ci

ENTRYPOINT ["node", "server.js"]