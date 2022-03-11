FROM node:14-alpine as base
WORKDIR /home/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

FROM base as build
COPY . .
RUN yarn build

FROM node:14-alpine as prod
WORKDIR /home/app
COPY package.json yarn.lock ./
COPY --from=base /home/app/node_modules /home/app/node_modules
COPY --from=build /home/app/dist/ ./
CMD [ "node", "index.js" ]