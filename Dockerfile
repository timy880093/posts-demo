FROM node:18-alpine

WORKDIR /usr/src/app

#COPY . .
COPY package*.json ./

RUN npm install --frozen-lockfile

ENV PORT $PORT

EXPOSE $PORT

CMD ["npm", "run", "start:dev"]