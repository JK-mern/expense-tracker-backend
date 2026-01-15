FROM node:20-alpine AS builder

WORKDIR /expense-tracker-backend

RUN corepack enable

ENV YARN_NODE_LINKER=node-modules

COPY package.json yarn.lock ./

COPY .yarnrc.yml ./

COPY prisma ./prisma

RUN yarn install --frozen-lockfile

RUN yarn  prisma generate

COPY . .

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /expense-tracker-backend

RUN corepack enable

ENV NODE_ENV=''
ENV PORT=''
ENV DATABASE_URL=''
ENV DIRECT_URL=''
ENV SUPABASE_URL=''
ENV SUPABASE_SERVICE_ROLE_KEY=''


ENV YARN_NODE_LINKER=node-modules

COPY package.json yarn.lock ./

COPY .yarnrc.yml ./

RUN yarn workspaces focus --all --production 

COPY --from=builder /expense-tracker-backend/dist ./dist
COPY --from=builder /expense-tracker-backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /expense-tracker-backend/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /expense-tracker-backend/prisma ./prisma


EXPOSE 3500

CMD ["node", "dist/server.js"]
