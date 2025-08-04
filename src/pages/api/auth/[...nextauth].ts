import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the User type to include role
declare module "next-auth" {
  interface User {
    role?: string;
  }
}

const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',') || [];
const adminEmails = [
  process.env.ADMIN_EMAIL,
  ...(process.env.ADDITIONAL_ADMINS?.split(',') || [])
].filter(Boolean);

// Check if we're in demo mode (missing OAuth credentials)
const isDemoMode = !process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your-google-client-id';

export default NextAuth({
  providers: [
    // Demo mode provider for testing
    ...(isDemoMode ? [
      CredentialsProvider({
        id: "demo",
        name: "Demo Login",
        credentials: {
          role: { label: "Role", type: "select", options: ["executive", "manager", "team"] }
        },
        async authorize(credentials) {
          // Demo users for testing
          const demoUsers = {
            executive: { id: "1", email: "executive@qedemo.com", name: "Executive User", role: "executive" },
            manager: { id: "2", email: "manager@qedemo.com", name: "Manager User", role: "manager" },
            team: { id: "3", email: "team@qedemo.com", name: "Team User", role: "team" }
          };
          
          const role = credentials?.role as keyof typeof demoUsers;
          return demoUsers[role] || null;
        }
      })
    ] : []),
    
    // Google OAuth provider (only if credentials are properly configured)
    ...(!isDemoMode ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    ] : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.SESSION_TIMEOUT || "3600"), // 1 hour default
  },
  callbacks: {
    async signIn({ user }) {
      // In demo mode, always allow sign in
      if (isDemoMode) {
        return true;
      }
      
      // Domain-based access control for OAuth
      if (allowedDomains.length > 0 && user.email) {
        const emailDomain = user.email.split('@')[1];
        if (!allowedDomains.includes(emailDomain)) {
          console.log(`Access denied for domain: ${emailDomain}`);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        
        // Enhanced role assignment
        if (user?.email) {
          // In demo mode, use the role from user object
          if (isDemoMode && user.role) {
            token.role = user.role;
          } else if (adminEmails.includes(user.email)) {
            token.role = "executive";
          } else if (user.email.includes("manager") || user.email.includes("lead")) {
            token.role = "manager";
          } else {
            token.role = "team";
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
