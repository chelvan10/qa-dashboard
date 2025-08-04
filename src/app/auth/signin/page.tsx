
"use client";

import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoCredentials, setDemoCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res as Record<string, ClientSafeProvider>);
    })();
  }, []);

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', {
      email: demoCredentials.email,
      password: demoCredentials.password,
      callbackUrl: '/dashboard'
    });
  };

  const setDemoUser = (email: string, password: string) => {
    setDemoCredentials({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign in to QE Dashboard</h1>
        
        {/* Demo Mode Section */}
        <div className="mb-6 border-2 border-green-200 rounded-lg p-4 bg-green-50">
          <h2 className="text-lg font-semibold mb-4 text-green-800">🚀 Demo Access (Immediate)</h2>
          
          {!showDemoForm ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setDemoUser('demo.executive@company.com', 'executive123');
                  setShowDemoForm(true);
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Demo Executive Access
              </button>
              <button
                onClick={() => {
                  setDemoUser('demo.manager@company.com', 'manager123');
                  setShowDemoForm(true);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Demo Manager Access
              </button>
              <button
                onClick={() => {
                  setDemoUser('demo.team@company.com', 'team123');
                  setShowDemoForm(true);
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                Demo Team Access
              </button>
            </div>
          ) : (
            <form onSubmit={handleDemoSignIn} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Demo email"
                  value={demoCredentials.email}
                  onChange={(e) => setDemoCredentials({...demoCredentials, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Demo password"
                  value={demoCredentials.password}
                  onChange={(e) => setDemoCredentials({...demoCredentials, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Sign in with Demo Account
              </button>
              <button
                type="button"
                onClick={() => setShowDemoForm(false)}
                className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
              >
                Back to Demo Options
              </button>
            </form>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* OAuth Providers */}
        <div className="space-y-3">
          {providers && Object.values(providers).filter(provider => provider.id !== 'credentials').map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign in with {provider.name}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Demo accounts provide immediate access to all dashboard features.</p>
          <p>No setup required!</p>
        </div>
      </div>
    </div>
  );
}
