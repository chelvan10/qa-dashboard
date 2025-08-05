#!/bin/bash

# QE Dashboard Manual Deployment Script
# This script provides an alternative deployment method
# bypassing GitHub Actions issues

echo "🚀 Starting QE Dashboard Deployment..."

# Step 1: Verify build
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Cannot deploy."
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Step 3: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
echo "📍 This will deploy to a new Vercel URL"
echo "🔧 Manual deployment bypasses GitHub Actions issues"

# Deploy with production flag
vercel --prod

echo "✅ Deployment complete!"
echo "🎯 Your QE Dashboard should now be available at the URL shown above"
echo "📝 Update your bookmarks with the new URL"
