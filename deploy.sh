#!/bin/bash

# QE Dashboard Deployment Script
# This script helps with quick deployment and setup

set -e

echo "🚀 QE Dashboard Deployment Helper"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Generate a secure NextAuth secret
echo "🔐 Generating secure NextAuth secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "Make sure to set these environment variables in Vercel dashboard:"
echo ""
echo "NEXTAUTH_URL=https://your-domain.vercel.app"
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "GOOGLE_CLIENT_ID=your-google-client-id"
echo "GOOGLE_CLIENT_SECRET=your-google-client-secret"
echo "ADMIN_EMAIL=admin@yourcompany.com"
echo "ALLOWED_DOMAINS=yourcompany.com"
echo "RATE_LIMIT_ENABLED=true"
echo "SESSION_TIMEOUT=3600"
echo "NODE_ENV=production"
echo ""

read -p "Press Enter to continue with deployment..."

# Run Vercel deployment
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update Google OAuth redirect URIs with your Vercel domain"
echo "2. Set environment variables in Vercel dashboard"
echo "3. Test authentication with your admin email"
echo "4. Share the URL with authorized users"
echo ""
echo "📖 See SHARING-GUIDE.md for detailed instructions"
