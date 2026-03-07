#!/bin/bash
set -e

# Grain Installation Script
# https://grain.dev

echo "Installing Grain..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js first."
    exit 1
fi

# Install grain globally
npm install -g grain

echo "Grain installed successfully!"
echo "Try running 'grain --help' to get started."
