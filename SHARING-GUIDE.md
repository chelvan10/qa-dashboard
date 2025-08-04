# 🚀 Secure External Sharing Guide

## Overview
This guide provides step-by-step instructions to securely deploy and share your QE Dashboard externally using Vercel with Google OAuth authentication.

## 🔐 Security Features Implemented

### Authentication & Authorization
- **Google OAuth 2.0** integration with NextAuth.js
- **Role-based access control** (Executive, Manager, Team)
- **Domain-based access restrictions**
- **Session management** with configurable timeouts
- **Secure cookie handling** with HttpOnly and Secure flags

### Security Middleware
- **Rate limiting** to prevent abuse
- **Security headers** (CSP, HSTS, X-Frame-Options, etc.)
- **Route protection** for dashboard access
- **IP-based monitoring** and logging

### Production Hardening
- **Environment variable validation**
- **HTTPS enforcement**
- **Secure session tokens**
- **Domain whitelisting**

## 📋 Prerequisites

1. **GitHub Repository**: ✅ Already created at `https://github.com/chelvan10/qa-dashboard`
2. **Google Cloud Console Account**: Required for OAuth setup
3. **Vercel Account**: For deployment hosting
4. **Domain Access**: Email domains you want to allow

## 🎯 Step-by-Step Deployment

### Step 1: Google Cloud Console Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API and Google OAuth2 API

2. **Configure OAuth Consent Screen**:
   ```
   Application Type: Web Application
   Application Name: QE Dashboard
   Authorized Domains: your-domain.vercel.app
   Scopes: email, profile, openid
   ```

3. **Create OAuth 2.0 Credentials**:
   ```
   Application Type: Web Application
   Name: QE Dashboard Production
   Authorized JavaScript Origins: https://your-domain.vercel.app
   Authorized Redirect URIs: https://your-domain.vercel.app/api/auth/callback/google
   ```

4. **Save Credentials**:
   - Copy `Client ID` and `Client Secret`
   - Keep these secure - you'll need them for Vercel

### Step 2: Vercel Deployment

1. **Deploy to Vercel**:
   ```bash
   # Option 1: Using Vercel CLI
   npm install -g vercel
   vercel --prod
   
   # Option 2: Connect GitHub repo at vercel.com
   # Go to vercel.com → Import Project → Select your GitHub repo
   ```

2. **Configure Environment Variables** in Vercel Dashboard:
   ```bash
   # Navigate to: Project Settings → Environment Variables
   
   # Required Variables:
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=generate-random-32-char-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Security Configuration:
   ADMIN_EMAIL=admin@yourcompany.com
   ADDITIONAL_ADMINS=manager1@company.com,manager2@company.com
   ALLOWED_DOMAINS=yourcompany.com,partnercompany.com
   RATE_LIMIT_ENABLED=true
   SESSION_TIMEOUT=3600
   NODE_ENV=production
   ```

### Step 3: Generate Secure Secrets

1. **Generate NEXTAUTH_SECRET**:
   ```bash
   # Run in terminal:
   openssl rand -base64 32
   # Copy the output to NEXTAUTH_SECRET
   ```

2. **Update Google OAuth Redirects**:
   - Replace `your-domain.vercel.app` with your actual Vercel domain
   - Update both in Google Cloud Console and environment variables

### Step 4: Domain and Access Configuration

1. **Configure Allowed Domains**:
   ```bash
   # In Vercel environment variables:
   ALLOWED_DOMAINS=company1.com,company2.com,partner.org
   ```

2. **Set Admin Users**:
   ```bash
   # Primary admin:
   ADMIN_EMAIL=ceo@yourcompany.com
   
   # Additional admins (executives):
   ADDITIONAL_ADMINS=cto@company.com,vp-engineering@company.com
   ```

3. **Manager Auto-Detection**:
   - Users with "manager" or "lead" in email get Manager role
   - All others get Team role
   - Customize in `/src/pages/api/auth/[...nextauth].ts`

## 🔗 Sharing Process

### For Internal Teams
1. **Share Vercel URL**: `https://your-domain.vercel.app`
2. **Provide Instructions**:
   ```
   1. Visit the dashboard URL
   2. Click "Sign in with Google"
   3. Use your company email address
   4. Access will be granted based on your role
   ```

### For External Partners
1. **Add Partner Domain**:
   ```bash
   # Update ALLOWED_DOMAINS in Vercel:
   ALLOWED_DOMAINS=yourcompany.com,partnercompany.com,client.org
   ```

2. **Add Partner Admins** (if needed):
   ```bash
   # Update ADDITIONAL_ADMINS:
   ADDITIONAL_ADMINS=your-admins,partner-lead@partner.com
   ```

3. **Share with Instructions**:
   ```
   Dashboard Access: https://your-domain.vercel.app
   
   Requirements:
   - Must use email from authorized domain
   - Google account required
   - Access levels: Executive, Manager, Team
   ```

## 🛡️ Security Best Practices

### Access Control
- ✅ **Domain Restriction**: Only allowed email domains can access
- ✅ **Role-Based Views**: Different data based on user role
- ✅ **Session Timeouts**: Automatic logout after inactivity
- ✅ **Rate Limiting**: Prevents abuse and DDoS

### Monitoring & Logging
- ✅ **Failed Login Attempts**: Logged with IP addresses
- ✅ **Unauthorized Access**: Blocked and logged
- ✅ **Session Activity**: Tracked for security auditing

### Production Security
- ✅ **HTTPS Only**: All traffic encrypted
- ✅ **Secure Headers**: XSS, clickjacking protection
- ✅ **CSP Policy**: Content Security Policy enforced
- ✅ **No Sensitive Data**: All secrets in environment variables

## 📊 User Roles & Access Levels

### Executive Role
- **Who Gets It**: Users in `ADMIN_EMAIL` or `ADDITIONAL_ADMINS`
- **Access Level**: Full dashboard with all metrics
- **Data Visibility**: Company-wide KPIs, strategic insights

### Manager Role  
- **Who Gets It**: Emails containing "manager" or "lead"
- **Access Level**: Team management dashboards
- **Data Visibility**: Team metrics, resource allocation

### Team Role
- **Who Gets It**: All other authorized domain users
- **Access Level**: Individual and team-level metrics
- **Data Visibility**: Personal KPIs, team progress

## 🔄 Updating Access

### Adding New Users
1. **Same Domain**: Automatic access if domain is in `ALLOWED_DOMAINS`
2. **New Domain**: Add to `ALLOWED_DOMAINS` in Vercel
3. **Admin Promotion**: Add email to `ADDITIONAL_ADMINS`

### Removing Access
1. **Remove from Domain List**: Update `ALLOWED_DOMAINS`
2. **Revoke Admin**: Remove from `ADDITIONAL_ADMINS`
3. **Individual Block**: Implement user-specific blocking in auth callback

## 🚨 Emergency Procedures

### Immediate Access Revocation
1. **Disable OAuth**: Temporarily disable in Google Cloud Console
2. **Clear Sessions**: Restart Vercel deployment
3. **Block Domain**: Remove from `ALLOWED_DOMAINS`

### Security Incident Response
1. **Check Logs**: Review Vercel function logs
2. **Audit Access**: Review successful logins
3. **Update Secrets**: Rotate `NEXTAUTH_SECRET` and OAuth credentials

## 📞 Support & Maintenance

### Regular Tasks
- **Monthly**: Review access logs and user activity
- **Quarterly**: Audit user roles and permissions
- **Annually**: Rotate OAuth credentials and secrets

### Troubleshooting
- **Login Issues**: Check domain allowlist and Google OAuth config
- **Access Denied**: Verify email domain and role assignment
- **Performance**: Monitor rate limiting and session counts

## 🎉 Ready to Share!

Your QE Dashboard is now production-ready with enterprise-grade security. The sharing URL will be:

**🔗 `https://your-domain.vercel.app`**

Users simply visit the URL, sign in with Google, and get appropriate access based on their email domain and role assignment.

---

*Need help? Check the GitHub Issues or contact your development team.*
