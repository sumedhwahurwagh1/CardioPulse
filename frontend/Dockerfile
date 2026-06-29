# Stage 1: Build static React SPA
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./
RUN npm ci

# Copy code and build
COPY . .
ENV VITE_API_URL=http://localhost:8000
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:1.25-alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
