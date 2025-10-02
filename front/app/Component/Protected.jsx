// app/Component/ProtectedRoute.jsx
'use client';
import { useAuth } from '@/store/Auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/signup',
  showLoader = true 
}) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🟠 ProtectedRoute state check:', { 
      isInitialized, 
      isLoading, 
      isAuthenticated 
    });
    
    // Only redirect if auth is fully initialized and user is not authenticated
    if (isInitialized && !isLoading && !isAuthenticated) {
      console.log('🟠 Redirecting to:', redirectTo);
      router.push(redirectTo);    
    }
  }, [isInitialized, isLoading, isAuthenticated, router, redirectTo]);

  // Show loading while auth is being initialized
  if (!isInitialized || isLoading) {
    return showLoader ? (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    ) : null;
  }

  // If not authenticated after initialization, show redirecting message
  if (!isAuthenticated) {
    return showLoader ? (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting...</p>
        </div>
      </div>
    ) : null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}