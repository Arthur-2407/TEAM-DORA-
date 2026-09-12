'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { calculateLevelUp } from '@/lib/xp';
import type { Task, CompleteTaskResponse } from '@/lib/types';

const DEMO_TASKS_KEY = 'nexus_demo_tasks_v1';

const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    user_id: 'demo-agent-007',
    title: 'Complete 30-Minute Bodyweight & Iron Workout',
    description: 'Calisthenics, pushups, dumbbell press, and mobility stretches in the training hall.',
    category: 'strength',
    difficulty: 'hard',
    xp_reward: 100,
    credit_reward: 20,
    is_completed: false,
    is_recurring: true,
    recurrence_pattern: 'daily',
    completed_at: null,
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    user_id: 'demo-agent-007',
    title: 'Complete 1 Hour of Coding Practice & Algorithms',
    description: 'Solve 2 problems, study architecture patterns, read software engineering docs.',
    category: 'intellect',
    difficulty: 'hard',
    xp_reward: 100,
    credit_reward: 20,
    is_completed: false,
    is_recurring: false,
    recurrence_pattern: null,
    completed_at: null,
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    user_id: 'demo-agent-007',
    title: 'Bio-Sync: 8 Hours Restorative Sleep & 2L Hydration',
    description: 'Screen-off 30m before bed, herbal tea, mindful rest for circadian alignment.',
    category: 'vitality',
    difficulty: 'easy',
    xp_reward: 50,
    credit_reward: 10,
    is_completed: true,
    is_recurring: true,
    recurrence_pattern: 'daily',
    completed_at: new Date(Date.now() - 3600000).toISOString(),
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-4',
    user_id: 'demo-agent-007',
    title: 'Deep Focus Block: 90 Minutes Distraction-Free Routine',
    description: 'Close social media tabs, organize daily quest board, finish core milestone.',
    category: 'discipline',
    difficulty: 'medium',
    xp_reward: 80,
    credit_reward: 15,
    is_completed: false,
    is_recurring: true,
    recurrence_pattern: 'daily',
    completed_at: null,
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-5',
    user_id: 'demo-agent-007',
    title: 'Reach Out to a Friend & Share Meaningful Conversation',
    description: 'Reignite social connection, catch up over tea or voice call, practice active listening.',
    category: 'charisma',
    difficulty: 'easy',
    xp_reward: 50,
    credit_reward: 10,
    is_completed: false,
    is_recurring: false,
    recurrence_pattern: null,
    completed_at: null,
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-6',
    user_id: 'demo-agent-007',
    title: 'Sketch, Write, or Compose for 30 Minutes',
    description: 'Unconstrained creative sandbox: journal entry, digital illustration, or musical chords.',
    category: 'creativity',
    difficulty: 'medium',
    xp_reward: 80,
    credit_reward: 15,
    is_completed: false,
    is_recurring: true,
    recurrence_pattern: 'daily',
    completed_at: null,
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  const { user, isDemo, profile, refreshProfile, updateDemoProfile } = useAuth();
  const { addToast } = useToast();
  const supabase = createClient();
  const configured = isSupabaseConfigured();

  // Load tasks
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo || !configured || !user) {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(DEMO_TASKS_KEY);
          if (stored) {
            setTasks(JSON.parse(stored));
          } else {
            setTasks(INITIAL_DEMO_TASKS);
            localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
          }
        }
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          // Gracefully fall back to demo tasks when tables don't exist
          if (error.code === 'PGRST205' || error.code === '42P01') {
            console.warn('Supabase tables not found — falling back to local demo mode. Run the migration SQL in supabase/migrations/001_initial_schema.sql');
            if (typeof window !== 'undefined') {
              const stored = localStorage.getItem(DEMO_TASKS_KEY);
              if (stored) {
                setTasks(JSON.parse(stored));
              } else {
                setTasks(INITIAL_DEMO_TASKS);
                localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
              }
            }
            return;
          }
          throw error;
        }
        setTasks(data || []);
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isDemo, configured]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create Task
  const createTask = async (
    taskData: Omit<Task, 'id' | 'user_id' | 'is_completed' | 'completed_at' | 'created_at' | 'updated_at'>
  ) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      user_id: user?.id || 'demo-agent-007',
      is_completed: false,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic UI
    setTasks((prev) => [newTask, ...prev]);

    if (isDemo || !configured || !user) {
      if (typeof window !== 'undefined') {
        const current = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]');
        localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify([newTask, ...current]));
      }
      addToast({
        type: 'success',
        title: 'Mission Uploaded',
        description: `Objective "${newTask.title}" added to active queue.`,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: user.id,
            title: newTask.title,
            description: newTask.description,
            difficulty: newTask.difficulty,
            category: newTask.category,
            xp_reward: newTask.xp_reward,
            credit_reward: newTask.credit_reward,
            is_recurring: newTask.is_recurring,
            recurrence_pattern: newTask.recurrence_pattern,
            due_date: newTask.due_date,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST205' || error.code === '42P01') {
          console.warn('Tasks table not found in Supabase — mission stored locally');
          if (typeof window !== 'undefined') {
            const current: Task[] = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]');
            localStorage.setItem(
              DEMO_TASKS_KEY,
              JSON.stringify([newTask, ...current.filter((t: Task) => t.id !== newTask.id)])
            );
          }
          addToast({
            type: 'success',
            title: 'Mission Initialized (Local)',
            description: 'Stored in local memory cache.',
          });
          return;
        }
        throw error;
      }
      if (data) {
        setTasks((prev) => prev.map((t) => (t.id === newTask.id ? data : t)));
      }
      addToast({
        type: 'success',
        title: 'Mission Initialized',
        description: `Objective recorded securely in the Neural Grid.`,
      });
    } catch (err: unknown) {
      // Revert optimistic update on failure
      setTasks((prev) => prev.filter((t) => t.id !== newTask.id));
      addToast({
        type: 'error',
        title: 'Upload Failed',
        description: err instanceof Error ? err.message : 'Could not synchronize with grid.',
      });
      throw err;
    }
  };

  // Update Task
  const updateTask = async (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );

    if (isDemo || !configured || !user) {
      if (typeof window !== 'undefined') {
        const current: Task[] = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]');
        const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
        localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(updated));
      }
      addToast({ type: 'success', title: 'Mission Parameters Updated' });
      return;
    }

    try {
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (error) {
        if (error.code === 'PGRST205' || error.code === '42P01') {
          if (typeof window !== 'undefined') {
            const current: Task[] = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]');
            const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
            localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(updated));
          }
          addToast({ type: 'success', title: 'Mission Parameters Updated (Local)' });
          return;
        }
        throw error;
      }
      addToast({ type: 'success', title: 'Mission Synced with Grid' });
    } catch (err: unknown) {
      loadTasks();
      addToast({
        type: 'error',
        title: 'Sync Failed',
        description: err instanceof Error ? err.message : 'Update rejected.',
      });
    }
  };

  // Local progression calculation helper
  const executeLocalProgression = (task: Task) => {
    if (typeof window !== 'undefined') {
      const current: Task[] = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]');
      const updated = current.map((t) =>
        t.id === task.id ? { ...t, is_completed: true, completed_at: new Date().toISOString() } : t
      );
      localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(updated));
    }

    if (profile) {
      const levelCalc = calculateLevelUp(
        profile.level,
        profile.current_xp,
        profile.xp_to_next_level,
        task.xp_reward
      );

      const categoryKey = task.category;

      updateDemoProfile((prev) => ({
        ...prev,
        level: levelCalc.level,
        current_xp: levelCalc.currentXp,
        xp_to_next_level: levelCalc.xpToNextLevel,
        total_xp: prev.total_xp + task.xp_reward,
        credits: prev.credits + task.credit_reward,
        current_streak: prev.current_streak + 1,
        longest_streak: Math.max(prev.longest_streak, prev.current_streak + 1),
        [categoryKey]: (prev[categoryKey] || 1) + 1,
      }));

      addToast({
        type: 'xp',
        title: `+${task.xp_reward} XP & +${task.credit_reward} ₡`,
        description: `${task.category.toUpperCase()} attribute amplified!`,
      });

      if (levelCalc.leveledUp) {
        setLevelUpData({ isOpen: true, newLevel: levelCalc.level });
        addToast({
          type: 'levelup',
          title: `SYSTEM UPGRADE: LEVEL ${levelCalc.level}!`,
          description: 'New permissions and Black Market items unlocked!',
          duration: 7000,
        });
      }
    }
  };

  // Complete Task
  const completeTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.is_completed) return;

    // Optimistic UI state
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, is_completed: true, completed_at: new Date().toISOString() } : t
      )
    );

    if (isDemo || !configured || !user) {
      executeLocalProgression(task);
      return;
    }

    try {
      // Supabase RPC Anti-Cheat Call
      const { data, error } = await supabase.rpc('complete_task', { task_uuid: id });
      if (error) {
        if (
          error.code === 'PGRST202' ||
          error.code === 'PGRST205' ||
          error.code === '42883' ||
          error.code === '42P01'
        ) {
          console.warn('complete_task RPC or tasks table missing in Supabase, using local progression:', error.message);
          executeLocalProgression(task);
          return;
        }
        throw error;
      }

      const res = data as CompleteTaskResponse;
      await refreshProfile();

      addToast({
        type: 'xp',
        title: `+${res.xp_earned} XP & +${res.credits_earned} ₡`,
        description: 'Synchronized with Neural Core.',
      });

      if (res.leveled_up) {
        const lvl = res.new_level;
        setLevelUpData({ isOpen: true, newLevel: lvl });
        addToast({
          type: 'levelup',
          title: `SYSTEM UPGRADE: LEVEL ${lvl}!`,
          description: 'Rank elevated! Check inventory.',
          duration: 7000,
        });
      }
    } catch (err: unknown) {
      loadTasks();
      addToast({
        type: 'error',
        title: 'Completion Verification Failed',
        description: err instanceof Error ? err.message : 'Error completing mission.',
      });
    }
  };

  // Delete Task
  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (isDemo || !configured || !user) {
      if (typeof window !== 'undefined') {
        const current: Task[] = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]');
        localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(current.filter((t) => t.id !== id)));
      }
      addToast({ type: 'success', title: 'Mission Aborted' });
      return;
    }

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        if (error.code === 'PGRST205' || error.code === '42P01') {
          if (typeof window !== 'undefined') {
            const current: Task[] = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || '[]');
            localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(current.filter((t) => t.id !== id)));
          }
          addToast({ type: 'success', title: 'Mission Expunged (Local)' });
          return;
        }
        throw error;
      }
      addToast({ type: 'success', title: 'Mission Expunged' });
    } catch (err: unknown) {
      loadTasks();
      addToast({
        type: 'error',
        title: 'Abort Failed',
        description: err instanceof Error ? err.message : 'Could not remove mission.',
      });
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    levelUpData,
    closeLevelUp: () => setLevelUpData((prev) => ({ ...prev, isOpen: false })),
    refreshTasks: loadTasks,
  };
}
