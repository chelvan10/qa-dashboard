# Quality Engineering Capability Dashboard

A secure, production-ready Next.js dashboard for real-time analytics and executive reporting on software quality engineering.

## 🚀 Features

### Executive Dashboard (Strategic Overview)
- **Defect Leakage Rate** - Prominent gauge chart with trend analysis
- **Test Automation Coverage** - Color-coded indicators and growth trends
- **Mean Time to Recovery (MTTR)** - Current value with trend comparison
- **Automation ROI** - Cost savings visualization

### Manager Dashboard (Operational View)
- **Test Execution Status** - Stacked bar charts by squad/application
- **Defect Trend Analysis** - New vs. closed defects tracking
- **Flaky Test Rate** - Prioritized table of problematic tests
- **Environment Health** - Uptime and resource utilization

### Team Dashboard (Actionable View)
- **CI/CD Pipeline Health** - Real-time build status indicators
- **Personal Metrics** - Defects found vs. resolved tracking
- **Time to Test Readiness** - Commit to test pipeline metrics
- **Real-time Test Execution** - Live test status updates

## 🔒 Security Features

- **OAuth2 Authentication** (Google, Azure AD)
- **Role-based Access Control** (Executive, Manager, Team)
- **Secure Session Management** with NextAuth.js
- **Environment Variable Protection**
- **HTTPS Enforcement**
- **Dependency Vulnerability Scanning**

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Charts**: Chart.js, react-chartjs-2
- **Authentication**: NextAuth.js with OAuth2
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions
- **Security**: Snyk, npm audit
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_EMAIL=admin@yourcompany.com
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Force cache refresh - Tue 05 Aug 2025 10:07:10 NZST
