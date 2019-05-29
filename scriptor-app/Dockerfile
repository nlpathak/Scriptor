# base image
FROM node:12.2.0-alpine

COPY . /app
WORKDIR /app
RUN npm install --silent

EXPOSE 3000

VOLUME /app

# start app
CMD ["npm", "start"]