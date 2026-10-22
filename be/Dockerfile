FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./

COPY --chown=node:node . .
RUN mkdir -p /app/uploads && chown node:node /app/uploads

EXPOSE 5000

USER node

CMD ["npm", "start"]
