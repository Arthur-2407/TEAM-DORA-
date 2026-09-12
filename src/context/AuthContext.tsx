'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isDemo: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  loginAsDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateDemoProfile: (updater: (prev: Profile) => Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILE_STORAGE_KEY = 'nexus_demo_profile_v1';

const INITIAL_DEMO_PROFILE: Profile = {
  id: 'demo-agent-007',
  username: 'K41-CYPHER',
  avatar_url: null,
  level: 3,
  current_xp: 85,
  xp_to_next_level: 225,
  total_xp: 335,
  credits: 140,
  current_streak: 4,
  longest_streak: 7,
  last_activity_date: new Date().toISOString().split('T')[0],
  strength: 4,
  intellect: 6,
  discipline: 5,
  vitality: 3,
  charisma: 4,
  creativity: 5,
  created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

const STATIC_DEMO_USER: User = {
  id: 'demo-agent-007',
  email: 'cypher@nexus.net',
  user_metadata: { username: 'K41-CYPHER' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00.000Z',
} as unknown as User;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const supabase = createClient();
  const configured = isSupabaseConfigured();

  const fetchProfile = useCallback(async (userId: string) => {
    if (!configured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      } else if (error) {
        console.warn('Could not fetch remote profile:', error.message || error);
        setProfile((prev) => prev || {
          ...INITIAL_DEMO_PROFILE,
          id: userId,
          username: 'K41-CYPHER',
        });
      }
    } catch (e) {
      console.warn('Could not fetch remote profile:', e);
      setProfile((prev) => prev || {
        ...INITIAL_DEMO_PROFILE,
        id: userId,
        username: 'K41-CYPHER',
      });
    }
  }, [configured, supabase]);

  const refreshProfile = useCallback(async () => {
    if (isDemo) {
      const stored = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
      return;
    }
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile, isDemo]);

  const updateDemoProfile = useCallback((updater: (prev: Profile) => Profile) => {
    setProfile((prev) => {
      const base = prev || INITIAL_DEMO_PROFILE;
      const updated = updater(base);
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    // 1. Check demo mode in localStorage first
    if (typeof window !== 'undefined') {
      const demoActive = localStorage.getItem('nexus_demo_active') === 'true';
      if (demoActive) {
        document.cookie = 'nexus_demo_active=true; path=/; max-age=2592000; SameSite=Lax';
        setIsDemo(true);
        const stored = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
        if (stored) {
          try {
            setProfile(JSON.parse(stored));
          } catch {
            setProfile(INITIAL_DEMO_PROFILE);
          }
        } else {
          setProfile(INITIAL_DEMO_PROFILE);
          localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PROFILE));
        }
        setUser(STATIC_DEMO_USER);
        setLoading(false);
        return;
      }
    }

    // 2. Fallback to demo mode if Supabase not configured and not on an auth page
    if (!configured) {
      const isAuthPage = typeof window !== 'undefined' && 
        (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/signup'));
      if (!isAuthPage) {
        if (typeof window !== 'undefined') {
          document.cookie = 'nexus_demo_active=true; path=/; max-age=2592000; SameSite=Lax';
        }
        setIsDemo(true);
        setProfile(INITIAL_DEMO_PROFILE);
        setUser(STATIC_DEMO_USER);
      }
      setLoading(false);
      return;
    }

    // 3. Initialize Supabase session on mount
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          if (event === 'SIGNED_IN') {
            setTimeout(() => fetchProfile(newSession.user.id), 500);
          } else {
            await fetchProfile(newSession.user.id);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const signUp = async (email: string, password: string, username: string) => {
    if (!configured) {
      // Demo signup
      const newProf: Profile = {
        ...INITIAL_DEMO_PROFILE,
        username,
        level: 1,
        current_xp: 0,
        xp_to_next_level: 100,
        total_xp: 0,
        credits: 50,
        current_streak: 1,
      };
      setProfile(newProf);
      localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(newProf));
      localStorage.setItem('nexus_demo_active', 'true');
      document.cookie = 'nexus_demo_active=true; path=/; max-age=2592000; SameSite=Lax';
      setIsDemo(true);
      setUser({
        id: 'demo-agent-007',
        email,
        user_metadata: { username },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Check if session was returned or email confirmation is pending
    if (data.user && !data.session) {
      return {
        error: null,
        message: 'Account created! If email confirmation is enabled in your Supabase project, please check your inbox to confirm your account before logging in.',
      };
    }

    if (data.user && data.session) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username,
          current_xp: 0,
          level: 1,
          credits: 50,
        }, { onConflict: 'id' });
      } catch (err) {
        console.warn('Direct profile creation note:', err);
      }
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (!configured) {
      await loginAsDemo();
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const loginAsDemo = async () => {
    setIsDemo(true);
    const stored = typeof window !== 'undefined' ? localStorage.getItem(DEMO_PROFILE_STORAGE_KEY) : null;
    const prof = stored ? JSON.parse(stored) : INITIAL_DEMO_PROFILE;
    setProfile(prof);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_demo_active', 'true');
      localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(prof));
      document.cookie = 'nexus_demo_active=true; path=/; max-age=2592000; SameSite=Lax';
    }
    setUser({
      ...STATIC_DEMO_USER,
      user_metadata: { username: prof.username },
    });
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexus_demo_active');
      document.cookie = 'nexus_demo_active=; path=/; max-age=0; SameSite=Lax';
    }
    setIsDemo(false);
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout error:', err);
      }
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isDemo,
        signUp,
        signIn,
        loginAsDemo,
        signOut,
        refreshProfile,
        updateDemoProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
