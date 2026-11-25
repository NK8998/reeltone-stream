FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS source
COPY package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node eslint.config.mjs next.config.ts tsconfig.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node data ./data

FROM source AS development
RUN chown node:node /app
USER node
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

FROM source AS build
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/data ./data
USER node
EXPOSE 3000
CMD ["node", "server.js"]
