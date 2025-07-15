# TeamFlow Frontend Deployment Script for Windows
param(
    [string]$Environment = "production"
)

Write-Host "🚀 Starting TeamFlow deployment..." -ForegroundColor Green

# Check if EB CLI is installed
try {
    $ebVersion = eb --version
    Write-Host "✅ EB CLI found: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ EB CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "pip install awsebcli" -ForegroundColor Yellow
    exit 1
}

# Build frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
npm run build:prod

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed - dist directory not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build completed" -ForegroundColor Green

# Deploy to Elastic Beanstalk
Write-Host "🌐 Deploying to Elastic Beanstalk..." -ForegroundColor Yellow
eb deploy

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌍 Your app should be available at: https://your-app.elasticbeanstalk.com" -ForegroundColor Cyan 