'use client';

import React, { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { MissionCard } from '@/components/missions/MissionCard';
import { CreateMissionModal } from '@/components/missions/CreateMissionModal';
import { LevelUpOverlay } from '@/components/effects/LevelUpOverlay';
import { Button } from '@/components/ui/Button';
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG, type Category, type Difficulty } from '@/lib/constants';
import type { Task } from '@/lib/types';
import {
  Crosshair,
  Plus,
  Search,
  CheckCircle2,
  ListFilter,
  Sparkles,
} from 'lucide-react';

export default function MissionsPage() {
  const { tasks, completeTask, deleteTask, createTask, updateTask, levelUpData, closeLevelUp } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

      // Difficulty
      const matchesDifficulty = selectedDifficulty === 'all' || t.difficulty === selectedDifficulty;

      // Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && !t.is_completed) ||
        (statusFilter === 'completed' && t.is_completed);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [tasks, searchQuery, selectedCategory, selectedDifficulty, statusFilter]);

  const pendingCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsCreateOpen(true);
  };

  const handleModalSubmit = async (
    data: Omit<Task, 'id' | 'user_id' | 'is_completed' | 'completed_at' | 'created_at' | 'updated_at'>
  ) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Level Up Celebration */}
      <LevelUpOverlay
        isOpen={levelUpData.isOpen}
        newLevel={levelUpData.newLevel}
        onClose={closeLevelUp}
      />

      {/* Create / Edit Modal */}
      <CreateMissionModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        initialMission={editingTask}
      />

      {/* ── HEADER & ACTIONS ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crosshair size={22} className="text-[var(--neon-cyan)]" />
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              MISSION TERMINAL
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            {pendingCount} Active Directives • {completedCount} Targets Cleared
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setEditingTask(null);
            setIsCreateOpen(true);
          }}
        >
          INITIALIZE MISSION
        </Button>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ──────────────────────────────────────── */}
      <div className="glass-card p-4 flex flex-col gap-3 border border-[var(--border-subtle)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search objectives, directives, protocols..."
              className="input-neon pl-9 text-xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex rounded-lg bg-[var(--bg-tertiary)] p-1 border border-[var(--border-subtle)] font-mono text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-[var(--neon-cyan)] text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              ALL ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === 'pending'
                  ? 'bg-[var(--neon-cyan)] text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              ACTIVE ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === 'completed'
                  ? 'bg-[var(--neon-cyan)] text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              CLEARED ({completedCount})
            </button>
          </div>
        </div>

        {/* Categories & Difficulty Badges Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs font-mono scrollbar-none">
          <span className="text-[var(--text-muted)] text-[11px] uppercase flex items-center gap-1 shrink-0">
            <ListFilter size={12} /> PATHWAY:
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full border text-[11px] uppercase font-bold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'border-[var(--neon-cyan)] bg-[rgba(0,240,255,0.15)] text-[var(--neon-cyan)]'
                : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            All Pathways
          </button>

          {(Object.keys(CATEGORY_CONFIG) as Category[]).map((catKey) => {
            const cat = CATEGORY_CONFIG[catKey];
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(isSelected ? 'all' : catKey)}
                className={`px-2.5 py-1 rounded-full border text-[11px] uppercase font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-[var(--neon-cyan)] bg-[rgba(0,240,255,0.15)] text-white shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MISSIONS GRID ─────────────────────────────────────────────────── */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card p-12 text-center border border-dashed border-[var(--border-subtle)] flex flex-col items-center gap-4 my-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)]">
            <Crosshair size={28} />
          </div>
          <div>
            <h3
              className="text-lg font-bold text-white uppercase mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NO DIRECTIVES LOCATED
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono max-w-sm">
              {searchQuery || selectedCategory !== 'all' || statusFilter !== 'all'
                ? 'No missions match your current filter parameters. Reset filters to view all.'
                : 'Your directive board is empty. Deploy your first objective to start accumulating XP.'}
            </p>
          </div>
          <Button
            variant="neon"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setStatusFilter('all');
              setIsCreateOpen(true);
            }}
          >
            CREATE DIRECTIVE
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onComplete={completeTask}
              onDelete={deleteTask}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
