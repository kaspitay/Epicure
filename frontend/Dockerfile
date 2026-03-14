# Frontend Dockerfile
FROM node:20 AS builder

WORKDIR /app

# Use public npm registry
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies (use npm install to get correct platform binaries)
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
