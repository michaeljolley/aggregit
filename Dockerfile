FROM grpc/node:1.0

WORKDIR /app

COPY package.json .
RUN npm install --only=production

COPY . .
RUN npm run build

ENTRYPOINT [ "node", "/dist/index.js" ]