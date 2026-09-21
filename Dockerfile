FROM node:24 AS build-stage
WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY ./ .
RUN npm run build

FROM nginx AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# Generates env.js from VITE_* env vars at container start
COPY ./40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh
