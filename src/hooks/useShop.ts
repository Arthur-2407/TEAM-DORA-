'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { ShopItem, InventoryItem } from '@/lib/types';

const INITIAL_SHOP_ITEMS: ShopItem[] = [
  { id: 'item-1', name: 'Iron Warrior Helm', description: 'Heavy forged helmet radiating physical endurance.', item_type: 'avatar', price: 40, icon: '🪖', rarity: 'common', metadata: {} },
  { id: 'item-2', name: 'Archmage Wizard Hat', description: 'Pointed celestial hat steeped in arcane study.', item_type: 'avatar', price: 75, icon: '🧙', rarity: 'uncommon', metadata: {} },
  { id: 'item-3', name: 'Scholar Monocle', description: 'Magnifies deep focus and code clarity.', item_type: 'badge', price: 90, icon: '🧐', rarity: 'uncommon', metadata: {} },
  { id: 'item-4', name: 'Commander Tactical Compass', description: 'Unwavering guide for routines and time management.', item_type: 'badge', price: 120, icon: '🧭', rarity: 'rare', metadata: {} },
  { id: 'item-5', name: 'Druid Cloak of Vitality', description: 'Woven from forest leaves for restorative sleep.', item_type: 'badge', price: 160, icon: '🍃', rarity: 'rare', metadata: {} },
  { id: 'item-6', name: 'Bard Feather Cap', description: 'Charismatic headwear for sparkling conversation.', item_type: 'avatar', price: 110, icon: '🎩', rarity: 'rare', metadata: {} },
  { id: 'item-7', name: 'Artisan Beret', description: 'Inspires vibrant artistic canvas masterpieces.', item_type: 'avatar', price: 130, icon: '🎨', rarity: 'rare', metadata: {} },
  { id: 'item-8', name: 'Elixir of Deep Focus', description: 'Consumable brew granting +25% XP yield.', item_type: 'consumable', price: 60, icon: '🧪', rarity: 'uncommon', metadata: {} },
  { id: 'item-9', name: 'Golden Honey Mead', description: 'Tavern draught for instant morale & streak protection.', item_type: 'consumable', price: 80, icon: '🍯', rarity: 'uncommon', metadata: {} },
  { id: 'item-10', name: 'Tavern Hearth Theme', description: 'Warm amber glow and crackling cozy fire ambiance.', item_type: 'theme', price: 200, icon: '🔥', rarity: 'epic', metadata: {} },
  { id: 'item-11', name: 'Arcane Starlight Theme', description: 'Mystic celestial sky outside your study window.', item_type: 'theme', price: 220, icon: '🌌', rarity: 'epic', metadata: {} },
  { id: 'item-12', name: 'Champion of Reality', description: 'Legendary title for masters of life gamification.', item_type: 'title', price: 400, icon: '👑', rarity: 'legendary', metadata: {} },
];

const DEMO_INVENTORY_KEY = 'nexus_demo_inventory_v1';

const INITIAL_DEMO_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    user_id: 'demo-agent-007',
    item_id: 'item-1',
    equipped: true,
    purchased_at: new Date(Date.now() - 86400000).toISOString(),
    shop_items: INITIAL_SHOP_ITEMS[0],
  },
];

export function useShop() {
  const [items, setItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isDemo, profile, updateDemoProfile, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const supabase = createClient();
  const configured = isSupabaseConfigured();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo || !configured || !user) {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(DEMO_INVENTORY_KEY);
          if (stored) {
            setInventory(JSON.parse(stored));
          } else {
            setInventory(INITIAL_DEMO_INVENTORY);
            localStorage.setItem(DEMO_INVENTORY_KEY, JSON.stringify(INITIAL_DEMO_INVENTORY));
          }
        }
        setItems(INITIAL_SHOP_ITEMS);
      } else {
        const { data: shopData, error: shopErr } = await supabase.from('shop_items').select('*');
        if (!shopErr && shopData && shopData.length > 0) {
          setItems(shopData);
        } else {
          setItems(INITIAL_SHOP_ITEMS);
        }

        const { data: invData, error: invErr } = await supabase
          .from('inventory')
          .select('*, shop_items(*)')
          .eq('user_id', user.id);

        if (invErr) {
          console.warn('Supabase inventory query failed (tables may not exist yet) — using local inventory:', invErr.message);
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(DEMO_INVENTORY_KEY);
            setInventory(stored ? JSON.parse(stored) : INITIAL_DEMO_INVENTORY);
          }
        } else {
          setInventory(invData || []);
        }
      }
    } catch (err) {
      console.error('Error loading shop/inventory:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isDemo, configured]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const buyItemLocally = (item: ShopItem) => {
    updateDemoProfile((prev) => ({
      ...prev,
      credits: prev.credits - item.price,
    }));

    const newInvItem: InventoryItem = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'demo-agent-007',
      item_id: item.id,
      equipped: false,
      purchased_at: new Date().toISOString(),
      shop_items: item,
    };

    const updatedInv = [newInvItem, ...inventory];
    setInventory(updatedInv);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_INVENTORY_KEY, JSON.stringify(updatedInv));
    }

    addToast({
      type: 'purchase',
      title: 'Acquisition Successful!',
      description: `Purchased ${item.name} for ${item.price} ₡. Added to inventory.`,
    });
    return true;
  };

  const buyItem = async (item: ShopItem) => {
    const credits = profile?.credits ?? 0;
    if (credits < item.price) {
      addToast({
        type: 'error',
        title: 'Transaction Declined',
        description: `Insufficient credits. You need ${item.price - credits} ₡ more.`,
      });
      return false;
    }

    const isOwned = inventory.some((i) => i.item_id === item.id);
    if (isOwned) {
      addToast({
        type: 'error',
        title: 'Already Synchronized',
        description: 'You already possess this neural implant.',
      });
      return false;
    }

    if (isDemo || !configured || !user) {
      return buyItemLocally(item);
    }

    try {
      const { error } = await supabase.rpc('purchase_item', { item_uuid: item.id });
      if (error) {
        if (
          error.code === 'PGRST202' ||
          error.code === 'PGRST205' ||
          error.code === '42883' ||
          error.code === '42P01'
        ) {
          console.warn('purchase_item RPC not found in Supabase — processing purchase locally:', error.message);
          return buyItemLocally(item);
        }
        throw error;
      }

      await refreshProfile();
      await loadData();

      addToast({
        type: 'purchase',
        title: 'Hardware Acquired!',
        description: `${item.name} installed into your neural inventory.`,
      });
      return true;
    } catch (err: unknown) {
      addToast({
        type: 'error',
        title: 'Purchase Error',
        description: err instanceof Error ? err.message : 'Transaction failed.',
      });
      return false;
    }
  };

  const toggleEquip = (itemId: string) => {
    const updated = inventory.map((inv) =>
      inv.item_id === itemId ? { ...inv, equipped: !inv.equipped } : inv
    );
    setInventory(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_INVENTORY_KEY, JSON.stringify(updated));
    }

    const item = updated.find((i) => i.item_id === itemId);
    addToast({
      type: 'success',
      title: item?.equipped ? 'Implant Synchronized' : 'Implant Detached',
    });

    if (isDemo || !configured || !user) {
      return;
    }

    // Remote update attempt
    supabase
      .from('inventory')
      .update({ equipped: item?.equipped })
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .then(({ error }: { error: unknown }) => {
        if (error) {
          console.warn('Could not sync implant state with remote DB:', error);
        }
      });
  };

  return {
    items,
    inventory,
    loading,
    buyItem,
    toggleEquip,
    refreshShop: loadData,
  };
}
