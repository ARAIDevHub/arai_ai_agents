#!/bin/bash

# Function to start a server and log its output
start_server() {
    local server_name=$1
    local command=$2
    local log_file="${server_name}.log"

    echo "Starting ${server_name}..."
    nohup $command > $log_file 2>&1 &
    echo "${server_name} started with PID $!"
}

# Start the Node.js server
start_server "server_node" "node path/to/your/node/server.js"

# Start the Python server
start_server "server_python" "python3 path/to/your/python/server.py"

# Start the client server
start_server "client_server" "npm start --prefix path/to/your/client"

echo "All servers started." 