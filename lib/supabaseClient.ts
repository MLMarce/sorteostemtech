import { createClient } from '@supabase/supabase-js';
import { Raffle, RaffleNumber, Settings, DrawHistory, AdminProfile, NumberStatus } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// ==========================================
// PROFILES & AUTH HELPERS
// ==========================================

export async function getProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as AdminProfile;
}

export async function updateProfile(userId: string, updates: Partial<AdminProfile>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }
  return true;
}

// ==========================================
// RAFFLES HELPERS
// ==========================================

export async function getActiveRaffles(): Promise<Raffle[]> {
  const { data, error } = await supabase
    .from('raffles')
    .select(`
      *,
      profiles:admin_id (full_name)
    `)
    .in('status', ['active', 'finished'])
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching active raffles:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    admin_id: item.admin_id,
    admin_name: item.profiles?.full_name || 'Organizador',
    title: item.title,
    description: item.description,
    prize: item.prize,
    image: item.image,
    banner_image: item.banner_image,
    price: Number(item.price),
    total_numbers: item.total_numbers,
    draw_date: item.draw_date,
    draw_time: item.draw_time?.slice(0, 5) || '21:00',
    status: item.status,
    primary_color: item.primary_color || '#00E5FF',
    slug: item.slug,
    live_stream_url: item.live_stream_url || '',
    created_at: item.created_at
  }));
}

export async function getRaffleById(id: string): Promise<Raffle | null> {
  const { data, error } = await supabase
    .from('raffles')
    .select(`
      *,
      profiles:admin_id (full_name)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching raffle by id:', error);
    return null;
  }

  return {
    id: data.id,
    admin_id: data.admin_id,
    admin_name: data.profiles?.full_name || 'Organizador',
    title: data.title,
    description: data.description,
    prize: data.prize,
    image: data.image,
    banner_image: data.banner_image,
    price: Number(data.price),
    total_numbers: data.total_numbers,
    draw_date: data.draw_date,
    draw_time: data.draw_time?.slice(0, 5) || '21:00',
    status: data.status,
    primary_color: data.primary_color || '#00E5FF',
    slug: data.slug,
    live_stream_url: data.live_stream_url || '',
    created_at: data.created_at
  };
}

export async function getAdminRaffles(adminId: string): Promise<Raffle[]> {
  const { data, error } = await supabase
    .from('raffles')
    .select(`
      *,
      profiles:admin_id (full_name)
    `)
    .eq('admin_id', adminId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching admin raffles:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    admin_id: item.admin_id,
    admin_name: item.profiles?.full_name || 'Organizador',
    title: item.title,
    description: item.description,
    prize: item.prize,
    image: item.image,
    banner_image: item.banner_image,
    price: Number(item.price),
    total_numbers: item.total_numbers,
    draw_date: item.draw_date,
    draw_time: item.draw_time?.slice(0, 5) || '21:00',
    status: item.status,
    primary_color: item.primary_color || '#00E5FF',
    slug: item.slug,
    live_stream_url: item.live_stream_url || '',
    created_at: item.created_at
  }));
}

export async function checkCanCreateRaffle(adminId: string, subscriptionPlan: string): Promise<{ canCreate: boolean; message?: string }> {
  if (subscriptionPlan === 'ilimitado') {
    return { canCreate: true };
  }

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data, error } = await supabase
    .from('raffles')
    .select('id, created_at')
    .eq('admin_id', adminId)
    .gte('created_at', firstDayOfMonth);

  if (error) {
    console.error('Error checking raffle limit:', error);
    return { canCreate: true };
  }

  const monthlyCount = data ? data.length : 0;

  if (subscriptionPlan === 'gratis' && monthlyCount >= 1) {
    return {
      canCreate: false,
      message: 'Has alcanzado el límite de 1 sorteo mensual para el plan Gratis. Actualiza a Pro o Ilimitado para crear más.'
    };
  }

  if (subscriptionPlan === 'pro' && monthlyCount >= 5) {
    return {
      canCreate: false,
      message: 'Has alcanzado el límite de 5 sorteos mensuales para el plan Pro. Actualiza al plan Ilimitado.'
    };
  }

  return { canCreate: true };
}

export async function createRaffle(raffleData: Omit<Raffle, 'id' | 'created_at'>): Promise<Raffle | null> {
  const { data, error } = await supabase
    .from('raffles')
    .insert({
      admin_id: raffleData.admin_id,
      title: raffleData.title,
      description: raffleData.description,
      prize: raffleData.prize,
      image: raffleData.image,
      banner_image: raffleData.banner_image,
      price: raffleData.price,
      total_numbers: raffleData.total_numbers,
      draw_date: raffleData.draw_date,
      draw_time: raffleData.draw_time,
      status: raffleData.status,
      primary_color: raffleData.primary_color,
      slug: raffleData.slug,
      live_stream_url: raffleData.live_stream_url || '',
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating raffle:', error);
    return null;
  }

  // Generate numbers for this raffle
  const total = Number(raffleData.total_numbers) || 100;
  const numbersBatch = [];
  for (let i = 1; i <= total; i++) {
    numbersBatch.push({
      raffle_id: data.id,
      number: i,
      status: 'available',
    });
  }

  const { error: numbersError } = await supabase
    .from('raffle_numbers')
    .insert(numbersBatch);

  if (numbersError) {
    console.error('Error generating raffle numbers in batch:', numbersError);
  }

  return {
    id: data.id,
    admin_id: data.admin_id,
    admin_name: raffleData.admin_name,
    title: data.title,
    description: data.description,
    prize: data.prize,
    image: data.image,
    banner_image: data.banner_image,
    price: Number(data.price),
    total_numbers: data.total_numbers,
    draw_date: data.draw_date,
    draw_time: data.draw_time?.slice(0, 5) || '21:00',
    status: data.status,
    primary_color: data.primary_color,
    slug: data.slug,
    live_stream_url: data.live_stream_url,
    created_at: data.created_at
  };
}

export async function updateRaffle(id: string, updates: Partial<Raffle>): Promise<boolean> {
  const { error } = await supabase
    .from('raffles')
    .update({
      title: updates.title,
      description: updates.description,
      prize: updates.prize,
      image: updates.image,
      banner_image: updates.banner_image,
      price: updates.price,
      draw_date: updates.draw_date,
      draw_time: updates.draw_time,
      status: updates.status,
      primary_color: updates.primary_color,
      live_stream_url: updates.live_stream_url,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating raffle:', error);
    return false;
  }
  return true;
}

export async function deleteRaffle(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('raffles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting raffle:', error);
    return false;
  }
  return true;
}

// ==========================================
// RAFFLE NUMBERS HELPERS
// ==========================================

export async function getRaffleNumbers(raffleId: string): Promise<RaffleNumber[]> {
  const { data, error } = await supabase
    .from('raffle_numbers')
    .select('*')
    .eq('raffle_id', raffleId)
    .order('number', { ascending: true });

  if (error || !data) {
    console.error('Error fetching raffle numbers:', error);
    return [];
  }

  return data as RaffleNumber[];
}

export async function reserveNumber(
  raffleId: string, 
  number: number, 
  userData: { name: string; lastname: string; phone: string }
): Promise<boolean> {
  const { data, error } = await supabase
    .from('raffle_numbers')
    .update({
      status: 'reserved',
      user_name: userData.name,
      user_lastname: userData.lastname,
      phone: userData.phone,
      reserved_at: new Date().toISOString()
    })
    .eq('raffle_id', raffleId)
    .eq('number', number)
    .eq('status', 'available')
    .select();

  if (error || !data || data.length === 0) {
    console.error('Error reserving number or already taken:', error);
    return false;
  }
  return true;
}

export async function updateNumberStatus(
  raffleId: string,
  number: number,
  status: NumberStatus,
  userData?: { name?: string; lastname?: string; phone?: string }
): Promise<boolean> {
  const updatePayload: any = {
    status,
  };

  if (status === 'available') {
    updatePayload.user_name = null;
    updatePayload.user_lastname = null;
    updatePayload.phone = null;
    updatePayload.reserved_at = null;
    updatePayload.paid_at = null;
  } else {
    if (userData?.name !== undefined) updatePayload.user_name = userData.name;
    if (userData?.lastname !== undefined) updatePayload.user_lastname = userData.lastname;
    if (userData?.phone !== undefined) updatePayload.phone = userData.phone;
    if (status === 'paid') updatePayload.paid_at = new Date().toISOString();
    if (status === 'reserved') updatePayload.reserved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('raffle_numbers')
    .update(updatePayload)
    .eq('raffle_id', raffleId)
    .eq('number', number);

  if (error) {
    console.error('Error updating number status:', error);
    return false;
  }
  return true;
}

// ==========================================
// SETTINGS HELPERS
// ==========================================

export async function getSettingsByUserId(userId: string): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    alias: data.alias || '',
    holder: data.holder || '',
    whatsapp: data.whatsapp || '',
    instagram: data.instagram || '',
    facebook: data.facebook || '',
    logo: data.logo || 'TEMTECH Sorteos',
    primary_color: data.primary_color || '#00E5FF',
    auto_message: data.auto_message || 'Hola. Reservé el número {number}. Adjunto comprobante.',
    live_stream_url: data.live_stream_url || ''
  };
}

export async function getSettingsByRaffleAdmin(raffleId: string): Promise<Settings | null> {
  const { data: raffle, error: rError } = await supabase
    .from('raffles')
    .select('admin_id')
    .eq('id', raffleId)
    .single();

  if (rError || !raffle) return null;
  return getSettingsByUserId(raffle.admin_id);
}

export async function saveSettings(userId: string, settingsData: Settings): Promise<boolean> {
  const { error } = await supabase
    .from('settings')
    .upsert({
      user_id: userId,
      alias: settingsData.alias,
      holder: settingsData.holder,
      whatsapp: settingsData.whatsapp,
      instagram: settingsData.instagram,
      facebook: settingsData.facebook,
      logo: settingsData.logo,
      primary_color: settingsData.primary_color,
      auto_message: settingsData.auto_message,
      live_stream_url: settingsData.live_stream_url,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error saving settings:', error);
    return false;
  }
  return true;
}

// ==========================================
// DRAW HISTORY & WINNER
// ==========================================

export async function getDrawHistory(raffleId: string): Promise<DrawHistory[]> {
  const { data, error } = await supabase
    .from('draw_history')
    .select('*')
    .eq('raffle_id', raffleId)
    .order('draw_date', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as DrawHistory[];
}

export async function recordDrawWinner(
  raffleId: string, 
  winnerNumber: number, 
  winnerName: string, 
  videoUrl?: string
): Promise<DrawHistory | null> {
  // 1. Insert in draw_history
  const { data, error } = await supabase
    .from('draw_history')
    .insert({
      raffle_id: raffleId,
      winner_number: winnerNumber,
      winner_name: winnerName,
      draw_date: new Date().toISOString(),
      video_url: videoUrl || ''
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error inserting draw winner:', error);
    return null;
  }

  // 2. Mark raffle as finished
  await supabase
    .from('raffles')
    .update({ status: 'finished' })
    .eq('id', raffleId);

  // 3. Mark number as winner
  await supabase
    .from('raffle_numbers')
    .update({ status: 'winner' })
    .eq('raffle_id', raffleId)
    .eq('number', winnerNumber);

  return data as DrawHistory;
}
