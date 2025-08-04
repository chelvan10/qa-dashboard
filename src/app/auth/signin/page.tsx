
import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res as Record<string, ClientSafeProvider>);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Sign in to QE Dashboard</h1>
      <div className="space-y-4">
        {providers && Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            onClick={() => signIn(provider.id)}
            className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Sign in with {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}
