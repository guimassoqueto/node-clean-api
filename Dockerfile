FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install -g npm@latest \
    && npm install \
    && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist dist/
COPY package*.json .
RUN apk update && apk add curl \
    && npm install -g npm@latest \
    && npm install --omit=dev
ENTRYPOINT [ "node" ]
CMD [ "dist/main/main.js" ]