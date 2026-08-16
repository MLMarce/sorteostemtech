-- ==============================================================================
-- TEMTECH SORTEOS ONLINE - SUPABASE DATABASE SCHEMA & SEED DATA
-- ==============================================================================
-- Description: Complete SQL schema for multi-tenant SaaS raffle platform.
-- Paste this script into Supabase SQL Editor for immediate production setup.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES / ADMINS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'user')),
    subscription_plan TEXT NOT NULL DEFAULT 'gratis' CHECK (subscription_plan IN ('gratis', 'pro', 'ilimitado')),
    live_stream_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ADMIN SETTINGS TABLE (Branding & Payments per Admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    alias TEXT DEFAULT 'mp.alias.demo',
    holder TEXT DEFAULT 'Nombre Titular',
    whatsapp TEXT DEFAULT '5493510000000',
    instagram TEXT DEFAULT '@temtech.sorteos',
    facebook TEXT DEFAULT 'temtechsorteos',
    logo TEXT DEFAULT 'Temtech Sorteos',
    primary_color TEXT DEFAULT '#00E5FF',
    auto_message TEXT DEFAULT 'Hola! Reservé el número {number} para el sorteo. Adjunto mi comprobante.',
    live_stream_url TEXT DEFAULT 'https://www.youtube.com/embed/5qap5aO4i9A',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. RAFFLES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.raffles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    prize TEXT NOT NULL,
    image TEXT NOT NULL,
    banner_image TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    total_numbers INTEGER NOT NULL DEFAULT 100,
    draw_date DATE NOT NULL,
    draw_time TIME NOT NULL DEFAULT '21:00:00',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'finished')),
    primary_color TEXT DEFAULT '#00E5FF',
    slug TEXT NOT NULL UNIQUE,
    live_stream_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. RAFFLE NUMBERS / TICKETS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.raffle_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'paid', 'winner')),
    user_name TEXT,
    user_lastname TEXT,
    phone TEXT,
    reserved_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_raffle_number UNIQUE (raffle_id, number)
);

-- ------------------------------------------------------------------------------
-- 5. DRAW HISTORY TABLE (Winners Log)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.draw_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
    winner_number INTEGER NOT NULL,
    winner_name TEXT NOT NULL,
    draw_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_raffles_admin ON public.raffles(admin_id);
CREATE INDEX IF NOT EXISTS idx_raffle_numbers_raffle ON public.raffle_numbers(raffle_id);
CREATE INDEX IF NOT EXISTS idx_raffle_numbers_status ON public.raffle_numbers(status);

-- ------------------------------------------------------------------------------
-- 6. AUTOMATIC PROFILE & SETTINGS CREATION TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, subscription_plan)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Administrador'),
        'admin',
        'gratis'
    );

    INSERT INTO public.settings (user_id, holder)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Titular de Cuenta')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffle_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_history ENABLE ROW LEVEL SECURITY;

-- --- Profiles RLS ---
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- --- Settings RLS ---
CREATE POLICY "Public settings viewable by everyone" 
    ON public.settings FOR SELECT USING (true);

CREATE POLICY "Admins can update their own settings" 
    ON public.settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert their own settings" 
    ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- --- Raffles RLS ---
CREATE POLICY "Public can view active and finished raffles" 
    ON public.raffles FOR SELECT USING (true);

CREATE POLICY "Admins can insert their own raffles" 
    ON public.raffles FOR INSERT WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can update their own raffles" 
    ON public.raffles FOR UPDATE USING (auth.uid() = admin_id);

CREATE POLICY "Admins can delete their own raffles" 
    ON public.raffles FOR DELETE USING (auth.uid() = admin_id);

-- --- Raffle Numbers RLS ---
CREATE POLICY "Public can view numbers" 
    ON public.raffle_numbers FOR SELECT USING (true);

CREATE POLICY "Public can reserve numbers" 
    ON public.raffle_numbers FOR UPDATE USING (
        (status = 'available' OR status = 'reserved')
    );

CREATE POLICY "Admins can manage all numbers for their raffles" 
    ON public.raffle_numbers FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.raffles 
            WHERE raffles.id = raffle_numbers.raffle_id 
            AND raffles.admin_id = auth.uid()
        )
    );

-- --- Draw History RLS ---
CREATE POLICY "Public can view draw history" 
    ON public.draw_history FOR SELECT USING (true);

CREATE POLICY "Only raffle owner admin can insert draw history" 
    ON public.draw_history FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.raffles 
            WHERE raffles.id = draw_history.raffle_id 
            AND raffles.admin_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- 8. SEED DATA (3 Administrators & 3 Active Raffles)
-- ------------------------------------------------------------------------------

DO $$
DECLARE
    admin1_id UUID := '00000000-0000-0000-0000-000000000001';
    admin2_id UUID := '00000000-0000-0000-0000-000000000002';
    admin3_id UUID := '00000000-0000-0000-0000-000000000003';
    
    raffle1_id UUID := '11111111-1111-1111-1111-111111111111';
    raffle2_id UUID := '22222222-2222-2222-2222-222222222222';
    raffle3_id UUID := '33333333-3333-3333-3333-333333333333';
BEGIN

    -- Insert Sample Profiles (Admins)
    INSERT INTO public.profiles (id, email, full_name, role, subscription_plan, live_stream_url)
    VALUES 
        (admin1_id, 'admin1@temtech.com', 'Marcelo Tech (Admin 1)', 'admin', 'pro', 'https://www.youtube.com/embed/5qap5aO4i9A'),
        (admin2_id, 'admin2@temtech.com', 'Valeria Gamer (Admin 2)', 'admin', 'ilimitado', 'https://www.youtube.com/embed/2g811Eo7K8U'),
        (admin3_id, 'admin3@temtech.com', 'Lucas Sorteos (Admin 3)', 'admin', 'gratis', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        live_stream_url = EXCLUDED.live_stream_url;

    -- Insert Sample Settings
    INSERT INTO public.settings (user_id, alias, holder, whatsapp, instagram, facebook, logo, primary_color, live_stream_url)
    VALUES 
        (admin1_id, 'marcelo.temtech.mp', 'Marcelo Lencina', '5493518509827', '@temtech.studio', 'temtechstudio', 'TEMTECH Tech', '#00E5FF', 'https://www.youtube.com/embed/5qap5aO4i9A'),
        (admin2_id, 'valeria.gaming.mp', 'Valeria Fernández', '5493515550199', '@valeria.gaming', 'valeriagaming', 'Valeria Gaming', '#FF0055', 'https://www.youtube.com/embed/2g811Eo7K8U'),
        (admin3_id, 'lucas.sorteos.mp', 'Lucas Gómez', '5493514440288', '@lucas.sorteos', 'lucassorteos', 'Lucas Sorteos VIP', '#10B981', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    ON CONFLICT (user_id) DO NOTHING;

    -- Insert 3 Active Sample Raffles
    INSERT INTO public.raffles (id, admin_id, title, description, prize, image, banner_image, price, total_numbers, draw_date, draw_time, status, primary_color, slug, live_stream_url)
    VALUES
        (
            raffle1_id, 
            admin1_id, 
            'Gran Sorteo PlayStation 5 Slim 1TB', 
            '¡Participá por la nueva PlayStation 5 Slim 1TB con 2 controles DualSense! Transmisión en vivo oficial desde el canal del creador Marcelo Tech.',
            'PlayStation 5 Slim 1TB + 2 Joysticks',
            'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
            5000.00,
            100,
            '2026-08-25',
            '21:00:00',
            'active',
            '#00E5FF',
            'ps5-slim-1tb-marcelo',
            'https://www.youtube.com/embed/5qap5aO4i9A'
        ),
        (
            raffle2_id, 
            admin2_id, 
            'Sorteo Exclusivo iPhone 15 Pro Max 256GB', 
            '¡Llévate el iPhone 15 Pro Max Titán Natural nuevo en caja sellada! Sorteo en directo por Twitch y YouTube por Valeria Gamer.',
            'iPhone 15 Pro Max 256GB',
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80',
            8500.00,
            100,
            '2026-08-28',
            '22:00:00',
            'active',
            '#FF0055',
            'iphone-15-pro-max-valeria',
            'https://www.youtube.com/embed/2g811Eo7K8U'
        ),
        (
            raffle3_id, 
            admin3_id, 
            'Sorteo Moto Honda Wave 110cc 0km', 
            '¡Ganá una Moto Honda Wave 110cc 0km recién sacada de concesionaria! Transmisión en vivo comandada por Lucas Sorteos.',
            'Moto Honda Wave 110cc 0km',
            'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80',
            12000.00,
            100,
            '2026-09-01',
            '20:00:00',
            'active',
            '#10B981',
            'honda-wave-110-lucas',
            'https://www.youtube.com/embed/dQw4w9WgXcQ'
        )
    ON CONFLICT (id) DO NOTHING;

    -- Generate Numbers for Raffle 1
    FOR i IN 1..100 LOOP
        INSERT INTO public.raffle_numbers (raffle_id, number, status, user_name, user_lastname, phone, paid_at, reserved_at)
        VALUES (
            raffle1_id,
            i,
            CASE 
                WHEN i IN (3, 7, 12, 18, 22, 28, 35, 44, 53, 62, 75, 89, 98) THEN 'paid'
                WHEN i IN (5, 9, 14, 21, 33, 47, 60, 79, 91) THEN 'reserved'
                ELSE 'available'
            END,
            CASE WHEN i IN (3, 7, 12, 18, 22, 28, 35, 44, 53, 62, 75, 89, 98) THEN 'Carlos' WHEN i IN (5, 9, 14, 21, 33, 47, 60, 79, 91) THEN 'Marcelo' ELSE NULL END,
            CASE WHEN i IN (3, 7, 12, 18, 22, 28, 35, 44, 53, 62, 75, 89, 98) THEN 'Gómez' WHEN i IN (5, 9, 14, 21, 33, 47, 60, 79, 91) THEN 'Lencina' ELSE NULL END,
            CASE WHEN i IN (3, 7, 12, 18, 22, 28, 35, 44, 53, 62, 75, 89, 98, 5, 9, 14, 21, 33, 47, 60, 79, 91) THEN '3515550199' ELSE NULL END,
            CASE WHEN i IN (3, 7, 12, 18, 22, 28, 35, 44, 53, 62, 75, 89, 98) THEN NOW() ELSE NULL END,
            CASE WHEN i IN (5, 9, 14, 21, 33, 47, 60, 79, 91) THEN NOW() ELSE NULL END
        )
        ON CONFLICT (raffle_id, number) DO NOTHING;
    END LOOP;

    -- Generate Numbers for Raffle 2
    FOR i IN 1..100 LOOP
        INSERT INTO public.raffle_numbers (raffle_id, number, status, user_name, user_lastname, phone, paid_at, reserved_at)
        VALUES (
            raffle2_id,
            i,
            CASE 
                WHEN i IN (1, 10, 20, 30, 40, 50, 60, 70, 80, 90) THEN 'paid'
                WHEN i IN (4, 15, 26, 37, 48, 59) THEN 'reserved'
                ELSE 'available'
            END,
            CASE WHEN i IN (1, 10, 20, 30, 40, 50, 60, 70, 80, 90) THEN 'Lucía' WHEN i IN (4, 15, 26, 37, 48, 59) THEN 'Mateo' ELSE NULL END,
            CASE WHEN i IN (1, 10, 20, 30, 40, 50, 60, 70, 80, 90) THEN 'Ríos' WHEN i IN (4, 15, 26, 37, 48, 59) THEN 'Alvarez' ELSE NULL END,
            CASE WHEN i IN (1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 4, 15, 26, 37, 48, 59) THEN '3514440288' ELSE NULL END,
            CASE WHEN i IN (1, 10, 20, 30, 40, 50, 60, 70, 80, 90) THEN NOW() ELSE NULL END,
            CASE WHEN i IN (4, 15, 26, 37, 48, 59) THEN NOW() ELSE NULL END
        )
        ON CONFLICT (raffle_id, number) DO NOTHING;
    END LOOP;

    -- Generate Numbers for Raffle 3
    FOR i IN 1..100 LOOP
        INSERT INTO public.raffle_numbers (raffle_id, number, status, user_name, user_lastname, phone, paid_at, reserved_at)
        VALUES (
            raffle3_id,
            i,
            CASE 
                WHEN i IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26) THEN 'paid'
                WHEN i IN (3, 5, 7, 9, 11, 13) THEN 'reserved'
                ELSE 'available'
            END,
            CASE WHEN i IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26) THEN 'Agustín' WHEN i IN (3, 5, 7, 9, 11, 13) THEN 'Sofia' ELSE NULL END,
            CASE WHEN i IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26) THEN 'Torres' WHEN i IN (3, 5, 7, 9, 11, 13) THEN 'Sosa' ELSE NULL END,
            CASE WHEN i IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 3, 5, 7, 9, 11, 13) THEN '3519998877' ELSE NULL END,
            CASE WHEN i IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26) THEN NOW() ELSE NULL END,
            CASE WHEN i IN (3, 5, 7, 9, 11, 13) THEN NOW() ELSE NULL END
        )
        ON CONFLICT (raffle_id, number) DO NOTHING;
    END LOOP;

END $$;
