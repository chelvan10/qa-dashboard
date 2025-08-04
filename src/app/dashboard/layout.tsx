"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.replace("/auth/signin");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!authenticated) {
    return null;
  }
  return <>{children}</>;
}
