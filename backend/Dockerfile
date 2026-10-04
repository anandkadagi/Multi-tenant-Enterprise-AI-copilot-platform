# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# build tools needed for bcrypt's native bindings — only in this stage, not the final image
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# copy the already-compiled bcrypt bindings and generated Prisma client from the builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/bcrypt ./node_modules/bcrypt

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]