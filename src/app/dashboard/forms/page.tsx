'use client';

import React from 'react';
import { FormRouter } from '@/components/forms/FormRouter';

export default function FormsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Data Forms
              </h1>
              <p className="text-gray-600 mt-2">
                Configure data inputs for all dashboard components. Support for both manual form data and real-time external integrations.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-800 font-medium">
                    Forms Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Router Component */}
      <FormRouter />
    </div>
  );
}
