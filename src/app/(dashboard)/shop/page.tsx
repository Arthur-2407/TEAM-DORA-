'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/hooks/useShop';
import { useAuth } from '@/context/AuthContext';
import { RARITY_CONFIG, type ItemType, type Rarity } from '@/lib/constants';
import type { ShopItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Coins, Check, Lock, Sparkles, Filter } from 'lucide-react';

export default function ShopPage() {
  const { items, inventory, buyItem } = useShop();
  const { profile } = useAuth();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const credits = profile?.credits ?? 0;

  const ownedItemIds = useMemo(() => {
    return new Set(inventory.map((inv) => inv.item_id));
  }, [inventory]);

  const filteredItems = useMemo(() => {
    if (selectedType === 'all') return items;
    return items.filter((item) => item.item_type === selectedType);
  }, [items, selectedType]);

  const handleBuy = async (item: ShopItem) => {
    if (purchasingId) return;
    setPurchasingId(item.id);
    try {
      await buyItem(item);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── HEADER & BALANCE ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag size={22} className="text-amber-400" />
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              RPG ITEM SHOP
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Spend hard-earned Quest Gold on character headwear, sanctum themes, titles, and stat potions.
          </p>
        </div>

        {/* Gold Balance Display */}
        <div className="p-3 sm:px-5 sm:py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-amber-400/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">ADVENTURER PURSE</p>
            <p className="text-lg font-bold font-mono text-amber-300">
              {credits.toLocaleString()} GOLD 💰
            </p>
          </div>
        </div>
      </div>

      {/* ── FILTER TABS ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
        <span className="text-[var(--text-muted)] text-[11px] uppercase flex items-center gap-1 shrink-0">
          <Filter size={12} /> CATEGORY:
        </span>

        {[
          { key: 'all', label: 'All Wares' },
          { key: 'avatar', label: '🧢 Headwear & Gear' },
          { key: 'theme', label: '🌌 Sanctum Themes' },
          { key: 'badge', label: '🏆 Crests & Badges' },
          { key: 'consumable', label: '🪄 Stat Potions' },
          { key: 'title', label: '📜 Titles' },
        ].map((tab) => {
          const isSelected = selectedType === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`px-3 py-1.5 rounded-lg border text-xs uppercase font-bold shrink-0 transition-all ${
                isSelected
                  ? 'border-[var(--neon-gold)] bg-[rgba(255,215,0,0.15)] text-white shadow-[0_0_12px_rgba(255,215,0,0.25)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── ITEMS GRID ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isOwned = ownedItemIds.has(item.id);
          const canAfford = credits >= item.price;
          const isPurchasing = purchasingId === item.id;
          const rarityConfig = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;

          return (
            <div
              key={item.id}
              className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border transition-all ${
                isOwned
                  ? 'border-[var(--border-subtle)] bg-[rgba(15,15,22,0.6)]'
                  : 'border-[var(--border-subtle)] hover:border-[var(--border-neon)]'
              }`}
              style={{
                boxShadow: isOwned ? 'none' : `0 0 20px ${rarityConfig.color}10`,
              }}
            >
              {/* Rarity Accent Top Line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  backgroundColor: rarityConfig.color,
                  boxShadow: `0 0 10px ${rarityConfig.color}`,
                }}
              />

              <div>
                {/* Top Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                    style={{
                      borderColor: `${rarityConfig.color}40`,
                      backgroundColor: `${rarityConfig.color}15`,
                    }}
                  >
                    {item.icon || '📦'}
                  </div>
                  <Badge variant="rarity" rarity={item.rarity} />
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold text-white uppercase tracking-wider mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-[var(--neon-gold)]">
                  <Coins size={14} />
                  <span>{item.price} ₡</span>
                </div>

                {isOwned ? (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[rgba(0,255,136,0.1)] text-[var(--neon-green)] border border-[rgba(0,255,136,0.2)] font-mono text-xs font-bold">
                    <Check size={13} />
                    <span>OWNED</span>
                  </span>
                ) : (
                  <Button
                    variant={canAfford ? 'neon' : 'secondary'}
                    size="sm"
                    disabled={!canAfford || isPurchasing}
                    isLoading={isPurchasing}
                    onClick={() => handleBuy(item)}
                    leftIcon={canAfford ? <Sparkles size={13} /> : <Lock size={13} />}
                  >
                    {canAfford ? 'PURCHASE' : 'LOCKED'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
