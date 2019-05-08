FROM mhart/alpine-node:10

WORKDIR /usr/src/app

COPY package.json ./

# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ python yarn

RUN yarn install

COPY . .

#Expose port and start application
EXPOSE 8080
CMD [ "yarn", "run", "start" ]
