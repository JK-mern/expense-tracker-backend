FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable

FROM base as deps

COPY package.json yarn.lock .yarnrc.yml ./

COPY .yarn ./.yarn

RUN yarn install --immutable

FROM deps AS builder

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN yarn prisma generate
RUN yarn tsc

FROM deps as prod-deps

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn workspaces focus --all --production


FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable


RUN mkdir -p /app/logs && chown -R node:node /app

# Copy only necessary outputs
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY package.json ./



USER node
EXPOSE 3500
CMD ["node", "dist/server.js"]
