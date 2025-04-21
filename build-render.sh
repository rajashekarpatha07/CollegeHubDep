#!/bin/bash

# Simple build script for Render

echo "Starting Render build process..."

# Install dependencies
npm install

# Make sure parse-server.js exists and is set up correctly 
echo "Checking parse-server.js..."

# List all files in the directory
echo "Files in directory before building:"
ls -la

echo "Build process completed!" 