#!/bin/bash

# TeamFlow Frontend Deployment Script
set -e

echo "🚀 Starting TeamFlow deployment..."

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Please install it first:"
    echo "pip install awsebcli"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
npm run build:prod

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Frontend build completed"

# Deploy to Elastic Beanstalk
echo "🌐 Deploying to Elastic Beanstalk..."
eb deploy

echo "✅ Deployment completed!"
echo "🌍 Your app should be available at: https://your-app.elasticbeanstalk.com" 