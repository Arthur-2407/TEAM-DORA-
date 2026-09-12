'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG, type Category, type Difficulty } from '@/lib/constants';
import type { Task } from '@/lib/types';
import { Zap, Coins, Plus, Check } from 'lucide-react';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mission: Omit<Task, 'id' | 'user_id' | 'is_completed' | 'completed_at' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialMission?: Task | null;
}

export function CreateMissionModal({
  isOpen,
  onClose,
  onSubmit,
  initialMission,
}: CreateMissionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('discipline');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMission) {
      setTitle(initialMission.title);
      setDescription(initialMission.description || '');
      setCategory(initialMission.category);
      setDifficulty(initialMission.difficulty);
      setDueDate(initialMission.due_date ? initialMission.due_date.split('T')[0] : '');
      setIsRecurring(initialMission.is_recurring);
    } else {
      setTitle('');
      setDescription('');
      setCategory('discipline');
      setDifficulty('medium');
      setDueDate('');
      setIsRecurring(false);
    }
    setError(null);
  }, [initialMission, isOpen]);

  const diffConfig = DIFFICULTY_CONFIG[difficulty];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Mission title is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        category,
        difficulty,
        xp_reward: diffConfig.xp,
        credit_reward: diffConfig.credits,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? 'daily' : null,
        due_date: dueDate || null,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialMission ? 'RECONFIGURE RPG QUEST' : 'COMMISSION NEW QUEST'}
      subtitle="Define real-life quest objective, character attribute pathway, and Gold rewards."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-lg bg-[rgba(255,51,102,0.15)] border border-[#ff3366] text-[#ff3366] text-xs font-mono">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Quest Objective <span className="text-[var(--neon-cyan)]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Complete 45-minute Strength Workout"
            className="input-neon text-sm"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Quest Details (Optional)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Sub-tasks, repetition goals, or study focus points..."
            className="input-neon text-sm resize-none"
          />
        </div>

        {/* Category / Attribute Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Neural Pathway (Attribute Growth)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((catKey) => {
              const cat = CATEGORY_CONFIG[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  type="button"
                  key={catKey}
                  onClick={() => setCategory(catKey)}
                  className={`p-2 rounded-xl flex items-center gap-2 border text-left transition-all ${
                    isSelected
                      ? 'border-[var(--neon-cyan)] bg-[rgba(0,240,255,0.15)] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                      {cat.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Difficulty Tier
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diffKey) => {
              const diff = DIFFICULTY_CONFIG[diffKey];
              const isSelected = difficulty === diffKey;
              return (
                <button
                  type="button"
                  key={diffKey}
                  onClick={() => setDifficulty(diffKey)}
                  style={{
                    borderColor: isSelected ? diff.color : 'var(--border-subtle)',
                    backgroundColor: isSelected ? `${diff.color}25` : 'var(--bg-tertiary)',
                    color: isSelected ? diff.color : 'var(--text-secondary)',
                    boxShadow: isSelected ? `0 0 10px ${diff.color}40` : 'none',
                  }}
                  className="py-2 px-1 text-center rounded-lg border text-[11px] font-mono font-bold uppercase transition-all"
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Reward Preview */}
        <div className="p-3 rounded-xl bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.2)] flex items-center justify-between font-mono text-xs">
          <span className="text-[var(--text-secondary)]">Quest Yield:</span>
          <div className="flex items-center gap-4">
            <span className="text-[var(--neon-cyan)] font-bold flex items-center gap-1">
              <Zap size={14} /> +{diffConfig.xp} XP
            </span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Coins size={14} /> +{diffConfig.credits} GOLD
            </span>
          </div>
        </div>

        {/* Due Date & Recurring */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-neon text-xs"
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--neon-cyan)] cursor-pointer"
              />
              <span>Daily Recurring Protocol</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={initialMission ? <Check size={16} /> : <Plus size={16} />}
          >
            {initialMission ? 'Save Changes' : 'Initialize Mission'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
