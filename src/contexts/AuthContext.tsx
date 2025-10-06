import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Subscription } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string, options?: { receiveTips?: boolean }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  continueAsGuest: () => void;
  socialLogin: (provider: 'google' | 'facebook') => Promise<{ success: boolean; message: string }>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google and Facebook App IDs (replace with env vars in real apps)
  const GOOGLE_CLIENT_ID = '419183498411-aco9polgjn5va01kbg3legvvmq6ibq1h.apps.googleusercontent.com';
  const FACEBOOK_APP_ID = '839782072858430';

  // Dynamically load external SDK scripts once
  const loadScript = (src: string, id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.body.appendChild(script);
    });
  };

  // Initialize Google Identity Services token client (popup flow)
  const getGoogleToken = async (): Promise<{ token: string; profile?: { name?: string; email?: string; picture?: string } } | null> => {
    // Load Google Identity Services
    await loadScript('https://accounts.google.com/gsi/client', 'google-oauth');
    const google = (window as any).google;
    if (!google || !GOOGLE_CLIENT_ID) return null;

    return new Promise((resolve) => {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: (response: any) => {
          if (!response || !response.access_token) {
            resolve(null);
            return;
          }
          (async () => {
            try {
              const userInfoResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              });
              const userInfo = await userInfoResp.json();
              resolve({
                token: response.access_token,
                profile: {
                  name: userInfo.name,
                  email: userInfo.email,
                  picture: userInfo.picture
                }
              });
            } catch {
              resolve({ token: response.access_token });
            }
          })();
        }
      });
      tokenClient.requestAccessToken();
    });
  };

  // Initialize Facebook SDK and prompt login
  const getFacebookToken = async (): Promise<{ token: string; profile?: { name?: string; email?: string; picture?: string } } | null> => {
    if (!FACEBOOK_APP_ID) return null;
    // Load Facebook SDK if not already loaded
    if (!(window as any).FB) {
      await loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-jssdk');
      await new Promise<void>((resolve) => {
        (window as any).fbAsyncInit = function () {
          (window as any).FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: false,
            version: 'v18.0'
          });
          resolve();
        };
        // If FB loads after setting fbAsyncInit, it will call it automatically
        if ((window as any).FB) {
          (window as any).FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: false,
            version: 'v18.0'
          });
          resolve();
        }
      });
    }

    const FB = (window as any).FB;
    if (!FB) return null;

    return new Promise((resolve) => {
      FB.login(
        (response: any) => {
          if (response.status !== 'connected' || !response.authResponse?.accessToken) {
            resolve(null);
            return;
          }
          const accessToken = response.authResponse.accessToken as string;
          try {
            FB.api('/me', { fields: 'name,email,picture' }, (profileResp: any) => {
              resolve({
                token: accessToken,
                profile: {
                  name: profileResp?.name,
                  email: profileResp?.email,
                  picture: profileResp?.picture?.data?.url
                }
              });
            });
          } catch {
            resolve({ token: accessToken });
          }
        },
        { scope: 'public_profile,email' }
      );
    });
  };

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app, this would be an API call
      if (email === 'demo@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          name: 'Demo User',
          email: email,
          avatarUrl: '',
          preferences: {
            theme: 'light',
            notifications: true,
            emailNotifications: true
          },
          subscription: {
            id: 'sub_1',
            plan: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            billingCycle: 'monthly',
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 0,
            userCount: 1,
            autoRenew: true
          }
        };
        
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, options?: { receiveTips?: boolean }): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app, this would be an API call
      if (email && password && name) {
        const user: User = {
          id: Date.now().toString(),
          name: name,
          email: email,
          avatarUrl: '',
          preferences: {
            theme: 'light',
            notifications: true,
            emailNotifications: true
          },
          subscription: {
            id: 'sub_1',
            plan: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            billingCycle: 'monthly',
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 0,
            userCount: 1,
            autoRenew: true
          }
        };
        // Optionally store marketing preference locally for demo purposes
        if (options?.receiveTips) {
          // no-op persistence stub for now
        }
        
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, message: 'Account created successfully' };
      } else {
        return { success: false, message: 'Please fill in all fields' };
      }
    } catch (error) {
      return { success: false, message: 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      avatarUrl: '',
      preferences: {
        theme: 'light',
        notifications: true,
        emailNotifications: true
      },
      subscription: {
        id: 'sub_guest',
        plan: 'free',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 0,
        userCount: 1,
        autoRenew: true
      }
    };
    
    setCurrentUser(guestUser);
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
  };

  const socialLogin = async (provider: 'google' | 'facebook'): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      let tokenData: { token: string; profile?: { name?: string; email?: string; picture?: string } } | null = null;
      if (provider === 'google') {
        tokenData = await getGoogleToken();
      } else if (provider === 'facebook') {
        tokenData = await getFacebookToken();
      }

      if (!tokenData || !tokenData.token) {
        return { success: false, message: `${provider} login was cancelled or failed` };
      }

      // In a real app, send tokenData.token to your backend for verification.
      const user: User = {
        id: Date.now().toString(),
        name: tokenData.profile?.name || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: tokenData.profile?.email || `user@${provider}.com`,
        avatarUrl: tokenData.profile?.picture || '',
        provider: provider,
        preferences: {
          theme: 'light',
          notifications: true,
          emailNotifications: true
        },
        subscription: {
          id: 'sub_1',
          plan: 'free',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          billingCycle: 'monthly',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 0,
          userCount: 1,
          autoRenew: true
        }
      };

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, message: `Login with ${provider} successful` };
    } catch (error) {
      return { success: false, message: `${provider} login failed. Please try again.` };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email) {
        return { success: true, message: 'Password reset link sent to your email' };
      } else {
        return { success: false, message: 'Please enter a valid email address' };
      }
    } catch (error) {
      return { success: false, message: 'Failed to send reset link. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (token && newPassword) {
        return { success: true, message: 'Password reset successfully' };
      } else {
        return { success: false, message: 'Invalid token or password' };
      }
    } catch (error) {
      return { success: false, message: 'Password reset failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && otp === '123456') { // Mock OTP
        return { success: true, message: 'OTP verified successfully' };
      } else {
        return { success: false, message: 'Invalid OTP' };
      }
    } catch (error) {
      return { success: false, message: 'OTP verification failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email) {
        return { success: true, message: 'OTP resent to your email' };
      } else {
        return { success: false, message: 'Please enter a valid email address' };
      }
    } catch (error) {
      return { success: false, message: 'Failed to resend OTP. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    signup,
    logout,
    continueAsGuest,
    socialLogin,
    updateUser,
    forgotPassword,
    resetPassword,
    verifyOTP,
    resendOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
