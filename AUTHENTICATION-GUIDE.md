# QE Dashboard Authentication Guide

## Demo Mode Access (Immediate Access)

Your QE Dashboard now includes **demo mode authentication** for immediate access to all dashboard features. No Google OAuth setup required!

### Demo User Credentials

Use these credentials to sign in and test the dashboard:

#### Executive Access (Full Dashboard)
- **Email**: `demo.executive@company.com`  
- **Password**: `executive123`
- **Role**: Executive (access to all 7 dashboard views)

#### Manager Access (Team Level)
- **Email**: `demo.manager@company.com`  
- **Password**: `manager123`
- **Role**: Manager (team-focused views)

#### Team Member Access (Individual Level)
- **Email**: `demo.team@company.com`  
- **Password**: `team123`
- **Role**: Team Member (personal metrics)

## How to Sign In

1. **Go to your dashboard**: https://qa-dashboard-ii2di2z25-aris-projects-a3f8f39e.vercel.app
2. **Click "Sign in"**
3. **Select "Sign in with Demo Account"** (new option)
4. **Enter one of the demo credentials above**
5. **Access your comprehensive QE dashboard!**

## Dashboard Features Available

Once signed in, you'll have access to:

✅ **Summary Dashboard** - Executive overview with Top 10 KPIs  
✅ **QE Capability Dashboard** - Organizational capability assessment  
✅ **Non-Prod Environments** - Environment health monitoring  
✅ **Functional Testing** - Test coverage and execution metrics  
✅ **Test Automation** - Automation coverage and ROI  
✅ **Performance Testing** - Load testing and performance metrics  
✅ **Security Testing** - Security scanning and vulnerability management  

## Production OAuth Setup (Optional)

For production use with real Google accounts, configure these environment variables:

```bash
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
```

The demo mode will automatically disable when real OAuth credentials are provided.

## Troubleshooting

- **Can't see sign-in options?** Clear browser cache and refresh
- **Demo mode not working?** Ensure you're using the exact credentials above
- **Dashboard not loading?** Check that you're signed in and have the correct role

## Support

The dashboard is now fully deployed and ready for immediate use with demo authentication!
