FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY bomber.js ./
COPY index.js ./

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm install

ENTRYPOINT [ "npm", "start", "--" ]

