# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Use public npm registry
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies (use npm install for correct platform binaries)
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
