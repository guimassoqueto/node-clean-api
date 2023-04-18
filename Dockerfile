FROM node:19-alpine as build
WORKDIR /app
COPY . .
RUN npm install -g npm@latest \
    && npm install \
    && npm run build

FROM node:19-alpine
WORKDIR /app
COPY --from=build /app/dist dist/
COPY package*.json .
RUN apk update && apk add curl \
    && npm install -g npm@latest \
    && npm install --production
ENTRYPOINT [ "node" ]
CMD [ "dist/main/index.js" ]