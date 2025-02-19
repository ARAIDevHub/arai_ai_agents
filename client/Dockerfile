FROM node:18

WORKDIR /app

# Install dos2unix and netcat for network checks
RUN apt-get update && apt-get install -y dos2unix netcat-openbsd

# First, copy only package files to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy wait-for-it script and ensure it's executable
COPY wait-for-it.sh /usr/local/bin/
RUN dos2unix /usr/local/bin/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

# We don't need to COPY . . here since we're using volumes in docker-compose.yml

EXPOSE 5173

# Add environment variable to skip prompt
ENV CHOKIDAR_USEPOLLING=true

# Use a simpler approach with basic network checks
CMD ["sh", "-c", "\
    echo 'Waiting for Node.js server...' && \
    until nc -z arai-node-server 3001; do sleep 1; done && \
    echo 'Node.js server is up!' && \
    echo 'Waiting for Python API...' && \
    until nc -z arai-python-api 8080; do sleep 1; done && \
    echo 'Python API is up!' && \
    npm run dev"] 