# Dockerfile for Development environment
FROM node:22-alpine AS dev

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install Dependencies
COPY package.json .
COPY pnpm-lock.yaml ./
RUN pnpm install

# Copy the entire project
COPY . .

ENV NODE_ENV=development
EXPOSE 3000

CMD [ "pnpm", "dev" ]
