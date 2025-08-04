import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',') || [];
const adminEmails = [
  process.env.ADMIN_EMAIL,
  ...(process.env.ADDITIONAL_ADMINS?.split(',') || [])
].filter(Boolean);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add more providers here (e.g., Azure AD)
  ],
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.SESSION_TIMEOUT || "3600"), // 1 hour default
  },
  callbacks: {
    async signIn({ user }) {
      // Domain-based access control
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
          if (adminEmails.includes(user.email)) {
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
