# TeamFlow Elastic Beanstalk Setup Script for Windows
param(
    [string]$Region = "us-east-1",
    [string]$Platform = "java-11"
)

Write-Host "🔧 Setting up Elastic Beanstalk for TeamFlow..." -ForegroundColor Green

# Check if EB CLI is installed
try {
    $ebVersion = eb --version
    Write-Host "✅ EB CLI found: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ EB CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "pip install awsebcli" -ForegroundColor Yellow
    exit 1
}

# Initialize EB application (if not already done)
if (-not (Test-Path ".elasticbeanstalk/config.yml")) {
    Write-Host "📝 Initializing Elastic Beanstalk application..." -ForegroundColor Yellow
    eb init teamflow-app --platform $Platform --region $Region
} else {
    Write-Host "✅ Elastic Beanstalk already initialized" -ForegroundColor Green
}

# Create environment
Write-Host "🌍 Creating Elastic Beanstalk environment..." -ForegroundColor Yellow
eb create teamflow-production --instance-type t3.small --single-instance

Write-Host "✅ Setup completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .ebextensions/02_environment.config with your actual domain" -ForegroundColor Yellow
Write-Host "2. Run: .\scripts\deploy.ps1" -ForegroundColor Yellow 