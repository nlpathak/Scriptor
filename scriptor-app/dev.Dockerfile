# base image
FROM node:12.2.0-alpine

COPY . /app
WORKDIR /app

VOLUME /app

RUN npm install --silent

EXPOSE 3000


# start app
CMD ["npm", "start"]