FROM node:14-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
ENV MODE=production
COPY . .
CMD yarn vite build