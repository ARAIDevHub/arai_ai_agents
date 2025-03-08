#!/usr/bin/env bash

# Script to run React client tests in Docker with proper cleanup

# Navigate to project root
cd "$(dirname "$0")/.."

# Clean up any orphaned containers first
echo "Cleaning up any orphaned containers..."
docker-compose down --remove-orphans

# Build and run the tests
echo "Building and running client tests..."
docker-compose up --build react_client_tests

# Clean up after tests
echo "Cleaning up after tests..."
docker-compose down --remove-orphans

echo "Test run complete!" 