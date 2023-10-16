FROM node:14

# WORKDIR /usr/src/app
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install mongoose @types/mongoose

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
