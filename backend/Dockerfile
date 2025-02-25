FROM node:16-alpine

# Add package management
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with specific npm version
RUN npm install -g npm@8.19.4 && \
    npm install --production

# Copy application
COPY . .

# Use non-root user
USER node

EXPOSE 3002
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
