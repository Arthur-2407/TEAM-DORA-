-- ═══════════════════════════════════════════════════════════════════════
-- NEXUS PROTOCOL — Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. PROFILES (extends auth.users) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1 NOT NULL,
  current_xp INTEGER DEFAULT 0 NOT NULL,
  xp_to_next_level INTEGER DEFAULT 100 NOT NULL,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  credits INTEGER DEFAULT 50 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  strength INTEGER DEFAULT 1 NOT NULL,
  intellect INTEGER DEFAULT 1 NOT NULL,
  discipline INTEGER DEFAULT 1 NOT NULL,
  vitality INTEGER DEFAULT 1 NOT NULL,
  charisma INTEGER DEFAULT 1 NOT NULL,
  creativity INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-provision profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, current_xp, level, credits)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    0,
    1,
    50
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. TASKS / MISSIONS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  description TEXT DEFAULT '',
  difficulty TEXT CHECK (difficulty IN ('trivial','easy','medium','hard','legendary')) DEFAULT 'medium' NOT NULL,
  category TEXT CHECK (category IN ('strength','intellect','discipline','vitality','charisma','creativity')) NOT NULL,
  xp_reward INTEGER NOT NULL,
  credit_reward INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE NOT NULL,
  recurrence_pattern TEXT,
  completed_at TIMESTAMPTZ,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

-- ── 3. TASK COMPLETION LOGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.task_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  xp_earned INTEGER NOT NULL,
  credits_earned INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.task_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own logs" ON public.task_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own logs" ON public.task_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── 4. SHOP ITEMS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  item_type TEXT CHECK (item_type IN ('badge','theme','avatar','title','consumable')) NOT NULL,
  price INTEGER NOT NULL,
  icon TEXT,
  rarity TEXT CHECK (rarity IN ('common','uncommon','rare','epic','legendary')) DEFAULT 'common' NOT NULL,
  metadata JSONB DEFAULT '{}' NOT NULL
);

ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view shop" ON public.shop_items FOR SELECT USING (true);

-- ── 5. USER INVENTORY ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.shop_items(id) ON DELETE CASCADE NOT NULL,
  equipped BOOLEAN DEFAULT FALSE NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own inventory" ON public.inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own inventory" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own inventory" ON public.inventory FOR UPDATE USING (auth.uid() = user_id);

-- ── 6. ACHIEVEMENTS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  xp_bonus INTEGER DEFAULT 0 NOT NULL,
  credit_bonus INTEGER DEFAULT 0 NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════
-- SERVER-SIDE FUNCTIONS (Anti-Cheat)
-- ═══════════════════════════════════════════════════════════════════════

-- ── Auto-create profile on signup ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Agent_' || LEFT(NEW.id::text, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Complete Task (secure XP/credit award) ─────────────────────────────
CREATE OR REPLACE FUNCTION public.complete_task(task_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  v_task RECORD;
  v_profile RECORD;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_new_xp_to_next INTEGER;
  v_leveled_up BOOLEAN := FALSE;
  v_new_credits INTEGER;
  v_streak INTEGER;
  v_longest_streak INTEGER;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Fetch & validate task
  SELECT * INTO v_task FROM public.tasks WHERE id = task_uuid AND user_id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or unauthorized';
  END IF;
  IF v_task.is_completed THEN
    RAISE EXCEPTION 'Task already completed';
  END IF;

  -- Fetch profile
  SELECT * INTO v_profile FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Streak calculation
  v_streak := v_profile.current_streak;
  v_longest_streak := v_profile.longest_streak;
  IF v_profile.last_activity_date IS NULL THEN
    v_streak := 1;
  ELSIF v_profile.last_activity_date = v_today - INTERVAL '1 day' THEN
    v_streak := v_streak + 1;
  ELSIF v_profile.last_activity_date < v_today - INTERVAL '1 day' THEN
    v_streak := 1;
  END IF;
  -- If same day, don't change streak
  IF v_profile.last_activity_date = v_today THEN
    -- no change
    NULL;
  END IF;
  IF v_streak > v_longest_streak THEN
    v_longest_streak := v_streak;
  END IF;

  -- Calculate new XP with non-linear level-up
  v_new_xp := v_profile.current_xp + v_task.xp_reward;
  v_new_level := v_profile.level;
  v_new_xp_to_next := v_profile.xp_to_next_level;

  WHILE v_new_xp >= v_new_xp_to_next LOOP
    v_new_xp := v_new_xp - v_new_xp_to_next;
    v_new_level := v_new_level + 1;
    v_new_xp_to_next := FLOOR(100 * POWER(1.5, v_new_level - 1));
    v_leveled_up := TRUE;
  END LOOP;

  v_new_credits := v_profile.credits + v_task.credit_reward;

  -- Update profile
  UPDATE public.profiles SET
    current_xp = v_new_xp,
    level = v_new_level,
    xp_to_next_level = v_new_xp_to_next,
    total_xp = total_xp + v_task.xp_reward,
    credits = v_new_credits,
    current_streak = v_streak,
    longest_streak = v_longest_streak,
    last_activity_date = v_today,
    strength = CASE WHEN v_task.category = 'strength' THEN strength + 1 ELSE strength END,
    intellect = CASE WHEN v_task.category = 'intellect' THEN intellect + 1 ELSE intellect END,
    discipline = CASE WHEN v_task.category = 'discipline' THEN discipline + 1 ELSE discipline END,
    vitality = CASE WHEN v_task.category = 'vitality' THEN vitality + 1 ELSE vitality END,
    charisma = CASE WHEN v_task.category = 'charisma' THEN charisma + 1 ELSE charisma END,
    creativity = CASE WHEN v_task.category = 'creativity' THEN creativity + 1 ELSE creativity END,
    updated_at = NOW()
  WHERE id = auth.uid();

  -- Mark task complete
  UPDATE public.tasks SET
    is_completed = TRUE,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = task_uuid;

  -- Log completion
  INSERT INTO public.task_logs (user_id, task_id, title, category, difficulty, xp_earned, credits_earned)
  VALUES (auth.uid(), task_uuid, v_task.title, v_task.category, v_task.difficulty, v_task.xp_reward, v_task.credit_reward);

  RETURN jsonb_build_object(
    'leveled_up', v_leveled_up,
    'new_level', v_new_level,
    'xp_earned', v_task.xp_reward,
    'credits_earned', v_task.credit_reward,
    'current_xp', v_new_xp,
    'xp_to_next_level', v_new_xp_to_next,
    'new_credits', v_new_credits,
    'streak', v_streak
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Purchase Item (secure credit deduction) ────────────────────────────
CREATE OR REPLACE FUNCTION public.purchase_item(item_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  v_item RECORD;
  v_profile RECORD;
  v_already_owned BOOLEAN;
BEGIN
  -- Fetch item
  SELECT * INTO v_item FROM public.shop_items WHERE id = item_uuid;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found';
  END IF;

  -- Check if already owned
  SELECT EXISTS(SELECT 1 FROM public.inventory WHERE user_id = auth.uid() AND item_id = item_uuid) INTO v_already_owned;
  IF v_already_owned THEN
    RAISE EXCEPTION 'Item already owned';
  END IF;

  -- Check credits
  SELECT * INTO v_profile FROM public.profiles WHERE id = auth.uid();
  IF v_profile.credits < v_item.price THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Deduct credits
  UPDATE public.profiles SET
    credits = credits - v_item.price,
    updated_at = NOW()
  WHERE id = auth.uid();

  -- Add to inventory
  INSERT INTO public.inventory (user_id, item_id) VALUES (auth.uid(), item_uuid);

  RETURN jsonb_build_object(
    'success', true,
    'item_name', v_item.name,
    'credits_spent', v_item.price,
    'remaining_credits', v_profile.credits - v_item.price
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════════════

-- ── Shop Items ─────────────────────────────────────────────────────────
INSERT INTO public.shop_items (name, description, item_type, price, icon, rarity) VALUES
  ('Neural Firewall',     'A basic cybernetic defense implant.',                'badge',       25,  '🛡️', 'common'),
  ('Holographic Visor',   'Displays real-time data overlays.',                  'badge',       50,  '👓', 'uncommon'),
  ('Quantum Processor',   'Enhances cognitive processing speed.',               'badge',       100, '⚡', 'rare'),
  ('Shadow Protocol',     'Cloaking module for stealth operations.',            'badge',       200, '🌑', 'epic'),
  ('Nexus Core',          'The ultimate neural enhancement.',                   'badge',       500, '💎', 'legendary'),
  ('Chrome Runner',       'Sleek chrome avatar frame.',                         'avatar',      75,  '🤖', 'uncommon'),
  ('Neon Ghost',          'Ethereal neon-outlined avatar.',                     'avatar',      150, '👻', 'rare'),
  ('Data Phantom',        'Mysterious digital entity.',                         'avatar',      300, '🌀', 'epic'),
  ('Initiate',            'Starting rank title.',                               'title',       0,   '📛', 'common'),
  ('Cyber Samurai',       'A warrior of the digital age.',                      'title',       100, '⚔️', 'rare'),
  ('Netrunner Elite',     'Master of the neural network.',                      'title',       250, '🌐', 'epic'),
  ('XP Booster Chip',     'Doubles XP for your next completed mission.',        'consumable',  50,  '💊', 'uncommon'),
  ('Credit Multiplier',   'Doubles credits for your next completed mission.',   'consumable',  75,  '💰', 'uncommon'),
  ('Midnight Theme',      'Dark purple and blue color theme.',                  'theme',       100, '🌙', 'rare'),
  ('Infrared Theme',      'Hot red and orange color theme.',                    'theme',       100, '🔥', 'rare'),
  ('Matrix Theme',        'Classic green-on-black theme.',                      'theme',       150, '🟢', 'epic')
ON CONFLICT DO NOTHING;

-- ── Achievements ───────────────────────────────────────────────────────
INSERT INTO public.achievements (name, description, icon, condition_type, condition_value, xp_bonus, credit_bonus) VALUES
  ('First Steps',         'Complete your first mission.',                 '🚀', 'tasks_completed', 1,   50,  10),
  ('Getting Started',     'Complete 5 missions.',                        '📋', 'tasks_completed', 5,   100, 25),
  ('Mission Runner',      'Complete 25 missions.',                       '🏃', 'tasks_completed', 25,  250, 50),
  ('Mission Master',      'Complete 100 missions.',                      '🏆', 'tasks_completed', 100, 500, 100),
  ('Streak Starter',      'Maintain a 3-day streak.',                    '🔥', 'streak_reached',  3,   75,  15),
  ('On Fire',             'Maintain a 7-day streak.',                    '💥', 'streak_reached',  7,   200, 40),
  ('Unstoppable',         'Maintain a 30-day streak.',                   '⚡', 'streak_reached',  30,  500, 100),
  ('Level 5',             'Reach level 5.',                              '⭐', 'level_reached',   5,   100, 25),
  ('Level 10',            'Reach level 10.',                             '🌟', 'level_reached',   10,  250, 50),
  ('Level 25',            'Reach level 25.',                             '💫', 'level_reached',   25,  500, 100),
  ('Big Spender',         'Spend 500 credits in the shop.',             '💸', 'credits_spent',   500, 200, 50),
  ('Collector',           'Own 5 items.',                                '🎒', 'items_owned',     5,   150, 30)
ON CONFLICT DO NOTHING;
