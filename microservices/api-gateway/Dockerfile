# Build context = raiz Cpg/ (precisa do front-end estático e do código do gateway)
FROM node:20-slim

WORKDIR /app

# Deps do gateway
COPY microservices/api-gateway/package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Código do gateway
COPY microservices/api-gateway/server.js ./

# Front-end estático servido pelo gateway
COPY index.html sw.js manifest.json react.production.min.js react-dom.production.min.js /app/frontend/

EXPOSE 3000
ENV NODE_ENV=production \
    GATEWAY_PORT=3000 \
    FRONT_DIR=/app/frontend

CMD ["node", "server.js"]
