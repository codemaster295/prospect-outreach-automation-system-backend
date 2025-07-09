# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app

# Copy only the package files needed to install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy only required source files
COPY tsconfig.json ./
COPY src ./src
COPY public ./public  # if you have one

RUN npm run build

# Stage 2: Production Image
FROM node:18 AS runner

# Create a non-root user
RUN useradd --user-group --create-home --shell /bin/false appuser

WORKDIR /app

# Copy only the built output and required runtime files
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Change ownership of all files to the non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]