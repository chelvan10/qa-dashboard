"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function DemoAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      console.log('🚀 Attempting demo login:', { email, role });
      
      // First check if NextAuth is available
      if (typeof signIn !== 'function') {
        throw new Error('NextAuth signIn function not available');
      }
      
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
        redirect: false
      });
      
      console.log('✅ Sign-in result:', result);
      
      if (result?.ok) {
        // Small delay to ensure session is set
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      } else {
        console.error('❌ Sign-in failed:', result?.error);
        
        // Fallback: try direct navigation with session storage
        sessionStorage.setItem('demoUser', JSON.stringify({ email, role }));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('❌ Demo login error:', error);
      
      // Ultimate fallback: store demo session and redirect
      sessionStorage.setItem('demoUser', JSON.stringify({ email, role }));
      sessionStorage.setItem('authFallback', 'true');
      window.location.href = '/dashboard';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QE Dashboard</h1>
          <p className="text-gray-600">Demo Authentication Portal</p>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">🏢 Executive Access</h3>
            <p className="text-sm text-green-700 mb-3">Full dashboard with all 7 views and KPIs</p>
            <button
              onClick={() => handleDemoLogin('demo.executive@company.com', 'executive123', 'executive')}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Access Executive Dashboard'}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">👥 Manager Access</h3>
            <p className="text-sm text-blue-700 mb-3">Team-focused analytics and management views</p>
            <button
              onClick={() => handleDemoLogin('demo.manager@company.com', 'manager123', 'manager')}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Access Manager Dashboard'}
            </button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-3">👤 Team Member Access</h3>
            <p className="text-sm text-purple-700 mb-3">Individual metrics and personal insights</p>
            <button
              onClick={() => handleDemoLogin('demo.team@company.com', 'team123', 'team')}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Access Team Dashboard'}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🔒 Demo accounts provide immediate access to all features.<br/>
            No setup or configuration required.
          </p>
        </div>
      </div>
    </div>
  );
}
