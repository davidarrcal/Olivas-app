FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/web/package.json ./packages/web/

RUN npm install

COPY packages/shared/ ./packages/shared/
COPY packages/api/ ./packages/api/
COPY packages/web/ ./packages/web/

RUN cd packages/api && npx prisma generate
RUN cd packages/web && npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/packages/api/package.json ./packages/api/
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/packages/api/ ./packages/api/
COPY --from=builder /app/packages/shared/ ./packages/shared/
COPY --from=builder /app/packages/web/dist/ ./packages/web/dist/

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "packages/api/src/index.js"]