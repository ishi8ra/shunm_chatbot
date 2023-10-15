FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY src/index.html /usr/src/app/src/index.html

RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/index.js"]
