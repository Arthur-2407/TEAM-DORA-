'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/hooks/useShop';
import { RARITY_CONFIG } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Briefcase, Check, Power, ShoppingBag, Sparkles } from 'lucide-react';

export default function InventoryPage() {
  const { inventory, toggleEquip } = useShop();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredInventory = inventory.filter((item) => {
    if (filterType === 'all') return true;
    return item.shop_items?.item_type === filterType;
  });

  const equippedCount = inventory.filter((i) => i.equipped).length;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={22} className="text-[var(--neon-purple)]" />
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEURAL INVENTORY
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            {inventory.length} Implants Acquired • {equippedCount} Currently Synchronized
          </p>
        </div>

        <Link href="/shop">
          <Button variant="neon" size="sm" leftIcon={<ShoppingBag size={14} />}>
            VISIT BLACK MARKET
          </Button>
        </Link>
      </div>

      {/* ── EMPTY STATE ───────────────────────────────────────────────────── */}
      {inventory.length === 0 ? (
        <div className="glass-card p-12 text-center border border-dashed border-[var(--border-subtle)] flex flex-col items-center gap-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--neon-purple)]">
            <Briefcase size={32} />
          </div>
          <div>
            <h3
              className="text-lg font-bold text-white uppercase mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              HARDWARE SLOTS UNPOPULATED
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono max-w-sm">
              You do not possess any neural implants yet. Complete directives to accumulate credits and visit the Black Market.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="md" leftIcon={<ShoppingBag size={16} />}>
              BROWSE IMPLANTS
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventory.map((item) => {
            const shopItem = item.shop_items;
            if (!shopItem) return null;
            const rarity = shopItem.rarity;
            const rarityConfig = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;

            return (
              <div
                key={item.id}
                className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border transition-all ${
                  item.equipped
                    ? 'border-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                {/* Rarity Stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    backgroundColor: rarityConfig.color,
                    boxShadow: `0 0 10px ${rarityConfig.color}`,
                  }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                      style={{
                        borderColor: `${rarityConfig.color}40`,
                        backgroundColor: `${rarityConfig.color}15`,
                      }}
                    >
                      {shopItem.icon || '📦'}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.equipped && (
                        <span className="px-2 py-0.5 rounded bg-[rgba(0,240,255,0.15)] text-[var(--neon-cyan)] text-[10px] font-mono font-bold uppercase">
                          ACTIVE
                        </span>
                      )}
                      <Badge variant="rarity" rarity={rarity} />
                    </div>
                  </div>

                  <h3
                    className="text-base font-bold text-white uppercase tracking-wider mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {shopItem.name}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed mb-4">
                    {shopItem.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    TYPE: {shopItem.item_type}
                  </span>

                  <button
                    onClick={() => toggleEquip(item.item_id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      item.equipped
                        ? 'bg-[rgba(0,240,255,0.15)] text-[var(--neon-cyan)] border border-[var(--neon-cyan)] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[rgba(255,255,255,0.2)]'
                    }`}
                  >
                    <Power size={13} />
                    <span>{item.equipped ? 'SYNCHRONIZED' : 'EQUIP'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
