'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  // Auto logout after inactivity
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    if (user) {
      inactivityTimer = setTimeout(() => {
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
        });
        signOut();
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleUserActivity = () => {
      resetInactivityTimer();
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Initial setup of timer
    resetInactivityTimer();
    
    return () => {
      // Clean up event listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      
      // Clear the timeout
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [user]);

  useEffect(() => {
    async function getInitialSession() {
      setLoading(true);
      
      try {
        // Get session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        setSession(session);
        setUser(session?.user || null);
        
        // If user exists, fetch profile
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    }
    
    getInitialSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (loading) return;
    
    const isAuthRoute = pathname?.startsWith('/(auth)') || 
                        pathname === '/login' || 
                        pathname === '/register' ||
                        pathname === '/forgot-password' ||
                        pathname === '/reset-password';
    
    if (!user && !isAuthRoute && pathname !== '/') {
      router.push('/login');
    } else if (user && isAuthRoute) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  async function fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Fetch user profile after successful sign in
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      
      router.push('/');
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function signUp(email: string, password: string, userData: any) {
    try {
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Create user profile in the database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            organization: userData.organization,
            organization_country: userData.organizationCountry,
            organization_sector: userData.organizationSector,
            avatar_url: null,
          });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Consider deleting the auth user if profile creation fails
          throw profileError;
        }
        
        // Fetch the created profile
        await fetchUserProfile(data.user.id);
      }
      
      router.push('/');
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      router.push('/login');
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function updateProfile(data: any) {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Update auth metadata if needed
      if (data.first_name || data.last_name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            first_name: data.first_name || profile?.first_name,
            last_name: data.last_name || profile?.last_name,
          },
        });
        
        if (authError) {
          throw authError;
        }
      }
      
      // Update profile in database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('user_id', user.id);
      
      if (profileError) {
        throw profileError;
      }
      
      // Refresh profile data
      await fetchUserProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Password update failed",
        description: error.message || "An error occurred while updating your password.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function updateEmail(email: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        email,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Email update initiated",
        description: "Please check your new email for a confirmation link.",
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: "Email update failed",
        description: error.message || "An error occurred while updating your email.",
        variant: "destructive",
      });
      throw error;
    }
  }

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    updateEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}