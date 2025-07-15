#!/bin/bash

# TeamFlow Elastic Beanstalk Setup Script
set -e

echo "🔧 Setting up Elastic Beanstalk for TeamFlow..."

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Please install it first:"
    echo "pip install awsebcli"
    exit 1
fi

# Initialize EB application (if not already done)
if [ ! -f ".elasticbeanstalk/config.yml" ]; then
    echo "📝 Initializing Elastic Beanstalk application..."
    eb init teamflow-app --platform java-11 --region us-east-1
fi

# Create environment
echo "🌍 Creating Elastic Beanstalk environment..."
eb create teamflow-production --instance-type t3.small --single-instance

echo "✅ Setup completed!"
echo "📋 Next steps:"
echo "1. Update .ebextensions/02_environment.config with your actual domain"
echo "2. Run: ./scripts/deploy.sh" 