FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript
# RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]