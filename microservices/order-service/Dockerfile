FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY . .
EXPOSE 4003
ENV NODE_ENV=production ORDER_PORT=4003
CMD ["node", "server.js"]
