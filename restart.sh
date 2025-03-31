#!/bin/bash

# Kill any running Node.js processes
echo "Stopping running processes..."
pkill -f "node" || true

# Clean the cache
echo "Cleaning Next.js cache..."
rm -rf .next/cache

# Restart the dev server
echo "Starting dev server..."
npm run dev 