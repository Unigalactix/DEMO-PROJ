# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY Frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY Frontend/ ./

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS final

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY Frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create a non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G appuser appuser && \
    chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]