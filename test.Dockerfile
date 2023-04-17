FROM node:19-alpine as build
WORKDIR /app
COPY . .
RUN npm install -g npm@latest \
    && npm install \
    && npm run build
EXPOSE 8000
CMD ["node", "dist/main/index.js"]
