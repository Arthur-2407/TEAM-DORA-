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

// Local Storage Keys
const LOCAL_USERS_STORAGE_KEY = 'nexus_local_users_v2';
const DEMO_PROFILE_STORAGE_KEY = 'nexus_demo_profile_v2';

export const getUserProfileKey = (userId: string) => `nexus_profile_${userId}`;

interface LocalUserRecord {
  id: string;
  email: string;
  password: string;
  username: string;
  created_at: string;
}

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

function getLocalUsers(): LocalUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: LocalUserRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(users));
}

function createInitialUserProfile(userId: string, username: string): Profile {
  return {
    id: userId,
    username: username.trim(),
    avatar_url: null,
    level: 1,
    current_xp: 0,
    xp_to_next_level: 100,
    total_xp: 0,
    credits: 50,
    current_streak: 1,
    longest_streak: 1,
    last_activity_date: new Date().toISOString().split('T')[0],
    strength: 1,
    intellect: 1,
    discipline: 1,
    vitality: 1,
    charisma: 1,
    creativity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

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
          username: 'OPERATIVE',
        });
      }
    } catch (e) {
      console.warn('Could not fetch remote profile:', e);
      setProfile((prev) => prev || {
        ...INITIAL_DEMO_PROFILE,
        id: userId,
        username: 'OPERATIVE',
      });
    }
  }, [configured, supabase]);

  const refreshProfile = useCallback(async () => {
    if (typeof window === 'undefined') return;

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

    if (!configured && user) {
      const stored = localStorage.getItem(getUserProfileKey(user.id));
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
  }, [user, fetchProfile, isDemo, configured]);

  const updateDemoProfile = useCallback((updater: (prev: Profile) => Profile) => {
    setProfile((prev) => {
      const base = prev || (isDemo ? INITIAL_DEMO_PROFILE : createInitialUserProfile(user?.id || 'unknown', user?.user_metadata?.username || 'OPERATIVE'));
      const updated = updater(base);
      if (typeof window !== 'undefined') {
        if (isDemo || !user) {
          localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(updated));
        } else {
          localStorage.setItem(getUserProfileKey(user.id), JSON.stringify(updated));
        }
      }
      return updated;
    });
  }, [isDemo, user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. If Supabase is NOT configured, handle local storage vault & demo
    if (!configured) {
      const demoActive = localStorage.getItem('nexus_demo_active') === 'true';
      const activeUserId = localStorage.getItem('nexus_active_user_id');

      if (demoActive) {
        document.cookie = 'nexus_demo_active=true; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'nexus_auth_session=; path=/; max-age=0; SameSite=Lax';
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

      if (activeUserId) {
        const users = getLocalUsers();
        const found = users.find((u) => u.id === activeUserId);
        if (found) {
          document.cookie = 'nexus_auth_session=true; path=/; max-age=2592000; SameSite=Lax';
          document.cookie = 'nexus_demo_active=; path=/; max-age=0; SameSite=Lax';
          setIsDemo(false);
          const profKey = getUserProfileKey(found.id);
          const stored = localStorage.getItem(profKey);
          let loadedProf: Profile;
          if (stored) {
            try {
              loadedProf = JSON.parse(stored);
            } catch {
              loadedProf = createInitialUserProfile(found.id, found.username);
            }
          } else {
            loadedProf = createInitialUserProfile(found.id, found.username);
            localStorage.setItem(profKey, JSON.stringify(loadedProf));
          }
          setProfile(loadedProf);
          setUser({
            id: found.id,
            email: found.email,
            user_metadata: { username: found.username },
            app_metadata: {},
            aud: 'authenticated',
            created_at: found.created_at,
          } as unknown as User);
          setLoading(false);
          return;
        } else {
          // Stale user ID
          localStorage.removeItem('nexus_active_user_id');
          document.cookie = 'nexus_auth_session=; path=/; max-age=0; SameSite=Lax';
        }
      }

      // Unauthenticated state
      setIsDemo(false);
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    // 2. Initialize Supabase session on mount when configured
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
  }, [configured]);

  const signUp = async (email: string, password: string, username: string) => {
    const trimmedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedUsername) {
      return { error: 'Callsign / Codename is required.' };
    }

    if (password.length < 6) {
      return { error: 'Decryption passkey must be at least 6 characters.' };
    }

    // Local Vault Mode
    if (!configured) {
      const existing = getLocalUsers();
      if (existing.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return { error: `An operative with identifier "${email.trim()}" is already enlisted.` };
      }

      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser: LocalUserRecord = {
        id: userId,
        email: normalizedEmail,
        password,
        username: trimmedUsername,
        created_at: new Date().toISOString(),
      };

      saveLocalUsers([...existing, newUser]);

      const newProf = createInitialUserProfile(userId, trimmedUsername);
      if (typeof window !== 'undefined') {
        localStorage.setItem(getUserProfileKey(userId), JSON.stringify(newProf));
        localStorage.setItem('nexus_active_user_id', userId);
        localStorage.removeItem('nexus_demo_active');
        document.cookie = 'nexus_auth_session=true; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'nexus_demo_active=; path=/; max-age=0; SameSite=Lax';
      }

      setIsDemo(false);
      setProfile(newProf);
      setUser({
        id: userId,
        email: normalizedEmail,
        user_metadata: { username: trimmedUsername },
        app_metadata: {},
        aud: 'authenticated',
        created_at: newUser.created_at,
      } as unknown as User);

      return { error: null };
    }

    // Supabase Cloud Mode
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: trimmedUsername },
      },
    });

    if (error) {
      return { error: error.message };
    }

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
          username: trimmedUsername,
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
    const normalizedEmail = email.trim().toLowerCase();

    // Local Vault Mode
    if (!configured) {
      const existing = getLocalUsers();
      const matched = existing.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!matched) {
        return {
          error: `No operative found with identifier "${email.trim()}". Please verify your credentials or enlist a new operative.`,
        };
      }

      if (matched.password !== password) {
        return { error: 'Decryption passkey invalid. Access denied.' };
      }

      // Successful local authentication
      const profKey = getUserProfileKey(matched.id);
      let prof: Profile;
      const storedProf = typeof window !== 'undefined' ? localStorage.getItem(profKey) : null;
      if (storedProf) {
        try {
          prof = JSON.parse(storedProf);
        } catch {
          prof = createInitialUserProfile(matched.id, matched.username);
        }
      } else {
        prof = createInitialUserProfile(matched.id, matched.username);
        if (typeof window !== 'undefined') {
          localStorage.setItem(profKey, JSON.stringify(prof));
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('nexus_active_user_id', matched.id);
        localStorage.removeItem('nexus_demo_active');
        document.cookie = 'nexus_auth_session=true; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'nexus_demo_active=; path=/; max-age=0; SameSite=Lax';
      }

      setIsDemo(false);
      setProfile(prof);
      setUser({
        id: matched.id,
        email: matched.email,
        user_metadata: { username: matched.username },
        app_metadata: {},
        aud: 'authenticated',
        created_at: matched.created_at,
      } as unknown as User);

      return { error: null };
    }

    // Supabase Cloud Mode
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const loginAsDemo = async () => {
    setIsDemo(true);
    let prof = INITIAL_DEMO_PROFILE;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexus_active_user_id');
      localStorage.setItem('nexus_demo_active', 'true');
      document.cookie = 'nexus_demo_active=true; path=/; max-age=2592000; SameSite=Lax';
      document.cookie = 'nexus_auth_session=; path=/; max-age=0; SameSite=Lax';

      const stored = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
      if (stored) {
        try {
          prof = JSON.parse(stored);
        } catch {
          prof = INITIAL_DEMO_PROFILE;
        }
      } else {
        localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PROFILE));
      }
    }

    setProfile(prof);
    setUser(STATIC_DEMO_USER);
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexus_demo_active');
      localStorage.removeItem('nexus_active_user_id');
      document.cookie = 'nexus_demo_active=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'nexus_auth_session=; path=/; max-age=0; SameSite=Lax';
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
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      window.location.href = `${basePath}/login`;
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
