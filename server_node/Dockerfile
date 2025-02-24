FROM node:18

WORKDIR /app

# Install build essentials (if needed for other native modules)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies (no native rebuild is needed now)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]