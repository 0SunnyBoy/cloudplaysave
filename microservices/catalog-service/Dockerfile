FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY . .
EXPOSE 4002
ENV NODE_ENV=production CATALOG_PORT=4002
CMD ["node", "server.js"]
