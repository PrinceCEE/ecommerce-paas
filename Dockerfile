FROM node:18-alpine AS base

# development stage
FROM base AS development 
ARG APP
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV} 
WORKDIR /usr/src/app 
COPY package.json yarn.lock ./ 
RUN yarn install
COPY . . 
RUN yarn run build ${APP} 

# production stage
FROM base AS production 
ARG APP 
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV} 
WORKDIR /usr/src/app 
COPY package.json yarn.lock ./
RUN yarn install --production
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/protos ./protos
 
# Add an env to save ARG
ENV APP_MAIN_FILE=dist/apps/${APP}/main 
CMD node ${APP_MAIN_FILE}