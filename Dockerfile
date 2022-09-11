FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY spammer.js ./
COPY proxyParser.js ./
COPY proxyScenarios.js ./
COPY index.js ./
COPY config.js ./

RUN npm ci
RUN touch proxy.txt

ENTRYPOINT [ "npm", "start", "--" ]

