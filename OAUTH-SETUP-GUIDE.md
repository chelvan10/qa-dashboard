# 🔑 Google OAuth 2.0 Setup Instructions

## EXACT VALUES TO USE:

### OAuth 2.0 Client Configuration:
```
Application Type: Web application
Name: QE Dashboard Production

Authorized JavaScript Origins:
https://qa-dashboard-7xexiatsr-aris-projects-a3f8f39e.vercel.app

Authorized Redirect URIs:
https://qa-dashboard-7xexiatsr-aris-projects-a3f8f39e.vercel.app/api/auth/callback/google
```

### After Creating Credentials:
1. Copy the Client ID (looks like: 123456789-abcdef.apps.googleusercontent.com)
2. Copy the Client Secret (looks like: GOCSPX-abcdef123456)
3. Save these securely - you'll need them for Vercel

## VERCEL ENVIRONMENT VARIABLES:

Go to: https://vercel.com/aris-projects-a3f8f39e/qa-dashboard/settings/environment-variables

Add these exact variables:

```
Variable Name: NEXTAUTH_URL
Value: https://qa-dashboard-7xexiatsr-aris-projects-a3f8f39e.vercel.app
Environment: Production

Variable Name: NEXTAUTH_SECRET  
Value: wYHgJ73K8C/2xV/swwa6Hc+u4BD7QcAV3KfTl532Kmo=
Environment: Production

Variable Name: GOOGLE_CLIENT_ID
Value: [YOUR_GOOGLE_CLIENT_ID_FROM_STEP_ABOVE]
Environment: Production

Variable Name: GOOGLE_CLIENT_SECRET
Value: [YOUR_GOOGLE_CLIENT_SECRET_FROM_STEP_ABOVE]
Environment: Production

Variable Name: ADMIN_EMAIL
Value: [YOUR_EMAIL_ADDRESS]
Environment: Production

Variable Name: NODE_ENV
Value: production
Environment: Production
```

## OPTIONAL SECURITY VARIABLES:

```
Variable Name: ALLOWED_DOMAINS
Value: yourcompany.com,partnercompany.com
Environment: Production

Variable Name: RATE_LIMIT_ENABLED
Value: true
Environment: Production

Variable Name: SESSION_TIMEOUT
Value: 3600
Environment: Production
```

## TESTING CHECKLIST:

After setting up OAuth and environment variables:

1. ✅ Redeploy your Vercel app (automatic after env var changes)
2. ✅ Visit: https://qa-dashboard-7xexiatsr-aris-projects-a3f8f39e.vercel.app
3. ✅ Click "Sign in with Google"
4. ✅ Complete Google OAuth flow
5. ✅ Verify you land on the dashboard
6. ✅ Check your role assignment (Executive/Manager/Team)

## TROUBLESHOOTING:

**If you get "OAuth Error":**
- Check that redirect URI exactly matches in Google Console
- Verify Client ID/Secret are correctly set in Vercel
- Make sure OAuth consent screen is published

**If authentication works but no dashboard access:**
- Check ADMIN_EMAIL matches your Google account email
- Verify ALLOWED_DOMAINS includes your email domain
- Check Vercel function logs for errors
