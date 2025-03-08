FROM node:18

WORKDIR /app

# Install dos2unix and netcat for network checks
RUN apt-get update && apt-get install -y dos2unix netcat-openbsd

# First, copy only package files to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Fix line ending issues for shell scripts
RUN apt-get update && apt-get install -y dos2unix && \
    dos2unix wait-for-it.sh && \
    chmod +x wait-for-it.sh

# Run tests before starting the application
# At build time, the environment isn't automatically populated with values from your 
# .env file specified in your docker-compose service.
# The env_file property in your docker-compose.yml applies to the container at runtime. 
# When Docker builds the image (i.e. during the RUN npm test step), those environment variables are not available unless explicitly passed as build arguments.
# RUN npm test

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