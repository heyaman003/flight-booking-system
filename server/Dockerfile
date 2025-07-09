# Stage 1: Install dependencies and build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Only build in production mode
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Stage 2: Run the app
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=$NODE_ENV

# Expose the port (default 3000)
EXPOSE 3000

# Entrypoint based on NODE_ENV
CMD if [ "$NODE_ENV" = "development" ]; then npm run start:dev; else npm run start:prod; fi 