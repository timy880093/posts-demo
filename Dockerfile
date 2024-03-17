FROM node:18-alpine

WORKDIR /app

RUN npm install -g @nestjs/cli

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

ENV PORT $PORT

EXPOSE $PORT

CMD ["npm", "run", "start:dev"]