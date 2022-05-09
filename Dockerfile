FROM node:16-alpine as builder
WORKDIR /frontend
COPY ./package.json /frontend
RUN npm install -g expo-cli
RUN npm install
COPY . .
RUN expo build:web

FROM nginx
COPY --from=builder /frontend/web-build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf