# TeamFlow Backend Deployment Script for Windows
param(
    [string]$Environment = "production"
)

Write-Host "🚀 Starting TeamFlow Backend deployment..." -ForegroundColor Green

# Check if EB CLI is installed
try {
    $ebVersion = eb --version
    Write-Host "✅ EB CLI found: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ EB CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "pip install awsebcli" -ForegroundColor Yellow
    exit 1
}

# Check if Maven is installed
try {
    $mvnVersion = mvn --version
    Write-Host "✅ Maven found" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven not found. Please install it first:" -ForegroundColor Red
    Write-Host "Download from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    exit 1
}

# Build backend
Write-Host "📦 Building backend..." -ForegroundColor Yellow
cd backend
mvn clean package -DskipTests

# Check if build was successful
if (-not (Test-Path "target/teamflow-backend-*.jar")) {
    Write-Host "❌ Backend build failed - JAR file not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend build completed" -ForegroundColor Green
cd ..

# Deploy to Elastic Beanstalk
Write-Host "🌐 Deploying to Elastic Beanstalk..." -ForegroundColor Yellow
eb deploy

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌍 Your backend should be available at: https://your-app.elasticbeanstalk.com/api" -ForegroundColor Cyan 