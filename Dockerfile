FROM node:20.12.2-alpine

WORKDIR /opt/nimbus

COPY package.json .
COPY yarn.lock .
RUN corepack enable

RUN apk add make cmake gcc g++ python3
RUN yarn

COPY . .
RUN yarn build

RUN apk add curl && rm -rf /var/cache/apk/*

HEALTHCHECK --interval=30s --timeout=30s --retries=5 --start-period=30s CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

CMD [ "yarn", "start" ]