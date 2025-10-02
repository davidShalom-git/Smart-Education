// app/Component/AuthWrapper.jsx
'use client';
import { useAuth } from '@/store/Auth';
import { useEffect, useRef } from 'react';

export default function AuthWrapper({ children }) {
  const { initAuth, isInitialized } = useAuth();
  const initCalled = useRef(false);

  useEffect(() => {
    console.log('🟡 AuthWrapper useEffect triggered', { 
      initCalled: initCalled.current, 
      isInitialized 
    });
    
    if (!initCalled.current && !isInitialized) {
      console.log('🟡 Calling initAuth from AuthWrapper');
      initCalled.current = true;
      initAuth();
    }
  }, []); // Empty dependency array - only run once

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}