'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshToken: () => Promise<boolean>;
  getAuthHeaders: () => Record<string, string>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  // Token management utilities
  const getAccessToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  };

  const setTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  };

  const clearTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  // Refresh access token
  const refreshToken = async (): Promise<boolean> => {
    const refresh = getRefreshToken();
    if (!refresh) return false;

    try {
      const response = await fetch(`${backendUrl}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access, refresh);
        return true;
      } else {
        clearTokens();
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      setUser(null);
      return false;
    }
  };

  // Verify token and get user profile
  const verifyAndGetProfile = async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // First verify the token
      const verifyResponse = await fetch(`${backendUrl}/api/auth/token/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!verifyResponse.ok) {
        // Try to refresh token
        const refreshed = await refreshToken();
        if (!refreshed) {
          setLoading(false);
          return;
        }
      }

      // Get user profile
      const profileResponse = await fetch(`${backendUrl}/api/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setUser(userData);
      } else {
        clearTokens();
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔐 Attempting login for:', username);
      
      const response = await fetch(`${backendUrl}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📡 Login Response Status:', response.status);
      const data = await response.json();
      console.log('🔐 Login Response Data:', data);

      // Handle backend response format: {success: true, tokens: {access, refresh}, user: {...}}
      if (response.ok && data.success && data.tokens) {
        console.log('✅ Login successful, storing tokens');
        setTokens(data.tokens.access, data.tokens.refresh);
        
        // If user data is included in login response, use it directly
        if (data.user) {
          console.log('👤 User Data from login response:', data.user);
          console.log('👤 User Admin Status:', { 
            is_staff: data.user.is_staff, 
            is_superuser: data.user.is_superuser 
          });
          setUser(data.user);
          console.log('✅ Login complete - user state updated');
          console.log('🔍 Auth State After Login:', {
            isAuthenticated: !!data.user,
            isAdmin: data.user?.is_staff || data.user?.is_superuser
          });
          return { success: true };
        } else {
          // Fallback: Get user profile after successful login
          const profileResponse = await fetch(`${backendUrl}/api/auth/profile/`, {
            headers: {
              'Authorization': `Bearer ${data.tokens.access}`,
            },
          });

          console.log('👤 Profile Response Status:', profileResponse.status);

          if (profileResponse.ok) {
            const userData = await profileResponse.json();
            console.log('👤 User Data:', userData);
            console.log('👤 User Admin Status:', { 
              is_staff: userData.is_staff, 
              is_superuser: userData.is_superuser 
            });
            setUser(userData);
            console.log('✅ Login complete - user state updated');
            console.log('🔍 Auth State After Login:', {
              isAuthenticated: !!userData,
              isAdmin: userData?.is_staff || userData?.is_superuser
            });
            return { success: true };
          } else {
            console.error('❌ Failed to get user profile');
            const profileErrorData = await profileResponse.json();
            console.error('❌ Profile Error:', profileErrorData);
            return { success: false, error: 'Failed to get user profile' };
          }
        }
      }

      return { success: false, error: data.message || data.error || 'Login failed' };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    const refresh = getRefreshToken();
    
    if (refresh) {
      try {
        await fetch(`${backendUrl}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ refresh }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    clearTokens();
    setUser(null);
  };

  // Set up automatic token refresh
  useEffect(() => {
    verifyAndGetProfile();

    // Set up token refresh interval (every 50 minutes)
    const interval = setInterval(() => {
      if (getAccessToken()) {
        refreshToken();
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get auth headers utility
  const getAuthHeaders = (): Record<string, string> => {
    const token = getAccessToken();
    console.log('🔍 AuthContext - Getting headers, token exists:', !!token);
    
    if (token) {
      console.log('🎫 Token preview:', token.substring(0, 20) + '...');
      console.log('🎫 Full token length:', token.length);
    }
    
    if (!token) {
      console.error('❌ No access token available in AuthContext');
      console.error('💾 LocalStorage check:', {
        hasWindow: typeof window !== 'undefined',
        storageContent: typeof window !== 'undefined' ? localStorage.getItem('access_token') : 'SSR'
      });
      return {
        'Content-Type': 'application/json',
      };
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    console.log('📤 Headers to be sent:', {
      hasContentType: !!headers['Content-Type'],
      authHeaderStart: headers.Authorization?.substring(0, 20) + '...',
      fullAuthLength: headers.Authorization?.length
    });
    
    return headers;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.is_staff || user?.is_superuser || false,
    refreshToken,
    getAuthHeaders,
    getAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 