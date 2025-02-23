FROM node:18

WORKDIR /app

# Install build essentials for bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild bcrypt specifically
RUN npm install --legacy-peer-deps
RUN npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

# Build TypeScript
# RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]