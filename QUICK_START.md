# 🚀 TeamFlow Quick Start Guide

## Prerequisites Check

### **1. Install Required Tools**

#### **Node.js & npm**
```bash
# Check if installed
node --version  # Should be 18+
npm --version   # Should be 8+

# If not installed, download from: https://nodejs.org/
```

#### **Java & Maven**
```bash
# Check if installed
java --version  # Should be 17+
mvn --version   # Should be 3.6+

# If not installed:
# - Java: Download from https://adoptium.net/
# - Maven: Download from https://maven.apache.org/download.cgi
```

#### **AWS CLI & EB CLI**
```bash
# Install AWS CLI
# Windows: Download from https://aws.amazon.com/cli/
# Or use: pip install awscli

# Install EB CLI
pip install awsebcli

# Verify installation
aws --version
eb --version
```

### **2. Configure AWS**

```bash
# Configure AWS credentials
aws configure

# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

## **Step 2: Test Local Build**

### **Test Frontend Build**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production
npm run build:prod

# Check if build was successful
dir dist  # Should show index.html and assets/
```

### **Test Backend Build**
```bash
# Navigate to backend directory
cd backend

# Build the application
mvn clean package -DskipTests

# Check if build was successful
dir target  # Should show teamflow-backend-*.jar
```

## **Step 3: Set Up AWS Resources**

### **1. Create RDS Database**
```bash
# Create PostgreSQL RDS instance (Windows PowerShell)
aws rds create-db-instance --db-instance-identifier teamflow-db --db-instance-class db.t3.micro --engine postgres --master-username admin --master-user-password YourSecurePassword123! --allocated-storage 20 --storage-type gp2 --backup-retention-period 7 --multi-az --engine-version 14.9 --publicly-accessible --storage-encrypted
```

**Note:** Replace `YourSecurePassword123!` with a strong password.

### **2. Wait for Database Creation**
```bash
# Check database status
aws rds describe-db-instances --db-instance-identifier teamflow-db

# Wait until Status shows "available"
```

## **Step 4: Initialize Elastic Beanstalk**

### **1. Initialize EB Application**
```bash
# Navigate to project root
cd ..

# Initialize EB (replace 'your-app-name' with your preferred name)
eb init your-app-name --platform java-11 --region us-east-1
```

### **2. Create EB Environment**
```bash
# Create environment
eb create teamflow-production --instance-type t3.small --database.engine postgres --database.instance db.t3.micro --database.username admin --database.password YourSecurePassword123!
```

## **Step 5: Configure Environment Variables**

### **Get Your RDS Endpoint**
```bash
# Get RDS endpoint
aws rds describe-db-instances --db-instance-identifier teamflow-db --query 'DBInstances[0].Endpoint.Address' --output text
```

### **Set Environment Variables**
```bash
# Replace 'your-rds-endpoint' with the actual endpoint from above
# Replace 'your-app-name' with your EB application name

eb setenv SPRING_PROFILES_ACTIVE=prod DATABASE_URL=jdbc:postgresql://your-rds-endpoint:5432/teamflow DATABASE_USERNAME=admin DATABASE_PASSWORD=YourSecurePassword123! JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production VITE_API_URL=https://your-app-name.elasticbeanstalk.com/api/ VITE_DASHBOARD_URL=https://your-app-name.elasticbeanstalk.com/
```

## **Step 6: Deploy Your Application**

### **Option 1: Use Deployment Script (Recommended)**
```bash
# For Windows
.\scripts\deploy.ps1

# For Linux/Mac
./scripts/deploy.sh
```

### **Option 2: Manual Deployment**
```bash
# Build frontend
cd frontend
npm run build:prod
cd ..

# Build backend
cd backend
mvn clean package -DskipTests
cd ..

# Deploy to EB
eb deploy
```

## **Step 7: Verify Deployment**

### **Check Application Status**
```bash
# Check EB status
eb status

# Get your application URL
eb open
```

### **Test Health Endpoints**
```bash
# Test application health
curl https://your-app-name.elasticbeanstalk.com/health

# Test API health
curl https://your-app-name.elasticbeanstalk.com/api/health
```

### **View Logs**
```bash
# View recent logs
eb logs

# Follow logs in real-time
eb logs --all --stream
```

## **Step 8: Access Your Application**

### **Your Application URLs**
- **Frontend**: `https://your-app-name.elasticbeanstalk.com/`
- **API**: `https://your-app-name.elasticbeanstalk.com/api/`
- **Health Check**: `https://your-app-name.elasticbeanstalk.com/health`

### **Test User Registration**
1. Open your application URL
2. Click "Sign Up"
3. Create a test user account
4. Verify you can log in successfully

## **Troubleshooting**

### **Common Issues**

#### **1. Build Failures**
```bash
# Frontend build issues
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build:prod

# Backend build issues
cd backend
mvn clean package -DskipTests
```

#### **2. Deployment Failures**
```bash
# Check EB status
eb status

# View detailed logs
eb logs --all

# Check environment health
eb health
```

#### **3. Database Connection Issues**
```bash
# Verify RDS endpoint
aws rds describe-db-instances --db-instance-identifier teamflow-db

# Check if database is accessible
# You may need to configure security groups
```

#### **4. Environment Variable Issues**
```bash
# List current environment variables
eb printenv

# Update specific variable
eb setenv VARIABLE_NAME=new_value
```

## **Next Steps After Deployment**

### **1. Set Up Monitoring**
- Configure CloudWatch alarms
- Set up billing alerts
- Monitor application metrics

### **2. Security Hardening**
- Change default passwords
- Rotate JWT secrets
- Configure SSL certificates
- Set up proper IAM roles

### **3. Performance Optimization**
- Monitor application performance
- Optimize database queries
- Configure auto-scaling
- Set up CDN if needed

### **4. Backup Strategy**
- Configure automated RDS backups
- Set up application versioning
- Test disaster recovery procedures

## **Useful Commands**

```bash
# EB CLI
eb init                    # Initialize EB app
eb create                  # Create environment
eb deploy                  # Deploy application
eb status                  # Check status
eb logs                    # View logs
eb config                  # Edit configuration
eb terminate               # Delete environment

# AWS CLI
aws rds describe-db-instances
aws elasticbeanstalk describe-environments
aws cloudwatch get-metric-statistics

# Application
mvn clean package          # Build backend
npm run build:prod        # Build frontend
```

## **Support**

If you encounter issues:
1. Check the logs: `eb logs --all`
2. Verify environment variables: `eb printenv`
3. Test locally first
4. Review the detailed documentation in `FULL_STACK_DEPLOYMENT.md`

Your TeamFlow application should now be live on AWS! 🎉 