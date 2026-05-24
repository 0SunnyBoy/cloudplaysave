FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY . .
EXPOSE 4001
ENV NODE_ENV=production AUTH_PORT=4001
CMD ["node", "server.js"]
