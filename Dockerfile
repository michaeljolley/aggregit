FROM node

WORKDIR /app

COPY package.json .
RUN npm install --only=production

COPY . .
RUN npm run build

ENTRYPOINT [ "node", "/dist/index.js" ]