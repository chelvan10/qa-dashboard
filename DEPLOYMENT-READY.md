# 🚀 YOUR QE DASHBOARD DEPLOYMENT GUIDE

## 📝 Your Generated Secrets

**NextAuth Secret (SAVE THIS):**
```
wYHgJ73K8C/2xV/swwa6Hc+u4BD7QcAV3KfTl532Kmo=
```

## 🌐 Quick Deployment Steps

### Step 1: Deploy to Vercel (Web Interface - RECOMMENDED)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Sign up/Login with your GitHub account

2. **Import Your Repository:**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repo: `chelvan10/qa-dashboard`
   - Click "Import"

3. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 2: Set Environment Variables in Vercel

In the Vercel dashboard, go to **Project Settings → Environment Variables** and add:

```bash
# Required Variables
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=wYHgJ73K8C/2xV/swwa6Hc+u4BD7QcAV3KfTl532Kmo=
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_EMAIL=your-email@company.com

# Security Configuration (Optional but Recommended)
ALLOWED_DOMAINS=yourcompany.com,partnercompany.com
ADDITIONAL_ADMINS=manager1@company.com,cto@company.com
RATE_LIMIT_ENABLED=true
SESSION_TIMEOUT=3600
NODE_ENV=production
```

### Step 3: Set Up Google OAuth

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing

2. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Enable "Google+ API" and "Google OAuth2 API"

3. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Application name: "QE Dashboard"
   - Authorized domains: `your-vercel-domain.vercel.app`
   - Scopes: email, profile, openid

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: Web application
   - Name: QE Dashboard Production
   - Authorized JavaScript origins: `https://your-vercel-domain.vercel.app`
   - Authorized redirect URIs: `https://your-vercel-domain.vercel.app/api/auth/callback/google`

5. **Save Credentials:**
   - Copy the Client ID and Client Secret
   - Add them to Vercel environment variables

### Step 4: Deploy and Test

1. **Trigger Deployment:**
   - In Vercel dashboard, go to "Deployments"
   - Click "Redeploy" to apply environment variables

2. **Get Your Final URL:**
   - Your dashboard will be available at: `https://your-vercel-domain.vercel.app`
   - Vercel will provide a unique domain like: `qa-dashboard-xyz123.vercel.app`

3. **Test Authentication:**
   - Visit your URL
   - Click "Sign in with Google"
   - Use an email from your allowed domains
   - Verify you get appropriate role access

## 🔗 Alternative: Deploy via CLI (If web interface doesn't work)

If you prefer CLI deployment:

```bash
# Login to Vercel (this will open browser)
npx vercel login

# Deploy to production
npx vercel --prod

# Set environment variables
npx vercel env add NEXTAUTH_URL
npx vercel env add NEXTAUTH_SECRET
npx vercel env add GOOGLE_CLIENT_ID
npx vercel env add GOOGLE_CLIENT_SECRET
npx vercel env add ADMIN_EMAIL
npx vercel env add ALLOWED_DOMAINS
npx vercel env add RATE_LIMIT_ENABLED
npx vercel env add NODE_ENV

# Redeploy with new environment variables
npx vercel --prod
```

## 🎯 What Happens After Deployment

1. **You get a Vercel URL** like: `https://qa-dashboard-abc123.vercel.app`
2. **Users can access** by visiting the URL and signing in with Google
3. **Access is controlled** by domain whitelist and role assignment
4. **Different views** based on user roles (Executive/Manager/Team)

## 🔐 Security Features Active

- ✅ Google OAuth 2.0 authentication
- ✅ Domain-based access control
- ✅ Role-based dashboard views
- ✅ Rate limiting protection
- ✅ Secure session management
- ✅ HTTPS enforcement
- ✅ Security headers protection

## 📞 Next Steps After Deployment

1. **Test with your admin email** to verify executive access
2. **Test with team emails** to verify role assignment
3. **Share the URL** with authorized users
4. **Monitor access** through Vercel dashboard

## 🚨 Important Notes

- **Update the NEXTAUTH_URL** in Vercel environment variables with your actual domain
- **Add your actual Google OAuth credentials** from Google Cloud Console
- **Set your admin email** to get executive dashboard access
- **Configure allowed domains** to control who can access

Your dashboard will be **production-ready** and **secure** for external sharing once deployed!
