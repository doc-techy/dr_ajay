import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface User {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

// Utility function to safely navigate after authentication
export const navigateAfterAuth = (router: AppRouterInstance, path: string, delay: number = 200) => {
  console.log(`🔄 Scheduling navigation to ${path} in ${delay}ms`);
  setTimeout(() => {
    console.log(`➡️ Navigating to ${path}`);
    router.push(path);
  }, delay);
};

// Check if user is fully authenticated
export const isFullyAuthenticated = (isAuthenticated: boolean, user: User | null, loading: boolean) => {
  return !loading && isAuthenticated && user && (user.is_staff || user.is_superuser);
}; 