"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export function NavigationHeader({
  title,
  subtitle,
  showBackButton = false,
  backUrl = '/dashboard',
  backLabel = 'Back to Dashboard',
  children
}: NavigationHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(backUrl);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">{backLabel}</span>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
