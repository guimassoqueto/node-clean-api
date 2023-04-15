FROM node:19-alpine as build
WORKDIR /app
COPY . .
RUN npm install -g npm@latest \
    && npm install \
    && npm run build

FROM node:19-alpine as runner
COPY --from=build /app/dist /app
COPY package*.json /app
WORKDIR /app
RUN npm install --omit=dev
ENTRYPOINT [ "node" ]
CMD [ "main/index.js" ]