'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  targetPath?: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function BackButton({ 
  targetPath = '/dashboard', 
  label = 'Back to Dashboard',
  className = '',
  showIcon = true 
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (targetPath) {
      router.push(targetPath);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 
        text-sm font-medium text-gray-700 bg-white 
        border border-gray-300 rounded-lg shadow-sm 
        hover:bg-gray-50 hover:text-gray-900 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        transition-colors duration-200
        ${className}
      `}
    >
      {showIcon && (
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
}

// Floating back button for overlays
export function FloatingBackButton({ 
  targetPath = '/dashboard',
  position = 'top-left' 
}: { 
  targetPath?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const router = useRouter();

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const handleBack = () => {
    router.push(targetPath);
  };

  return (
    <button
      onClick={handleBack}
      className={`
        fixed ${positionClasses[position]} z-50
        w-12 h-12 bg-white rounded-full shadow-lg
        flex items-center justify-center
        text-gray-600 hover:text-gray-900 hover:bg-gray-50
        border border-gray-200
        transition-all duration-200 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      title="Back to Dashboard"
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
    </button>
  );
}
