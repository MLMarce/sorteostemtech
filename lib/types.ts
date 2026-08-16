export type NumberStatus = 'available' | 'reserved' | 'paid' | 'winner';

export type RaffleStatus = 'draft' | 'active' | 'finished';

export type SubscriptionPlan = 'gratis' | 'pro' | 'ilimitado';

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  subscription_plan: SubscriptionPlan;
  live_stream_url?: string;
  created_at?: string;
}

export interface Raffle {
  id: string;
  admin_id?: string;
  admin_name?: string;
  title: string;
  description: string;
  prize: string;
  image: string;
  banner_image?: string;
  price: number;
  total_numbers: number;
  draw_date: string; // ISO or YYYY-MM-DD
  draw_time: string;
  status: RaffleStatus;
  primary_color: string;
  slug: string;
  live_stream_url?: string;
  created_at: string;
}

export interface RaffleNumber {
  id: string;
  raffle_id: string;
  number: number;
  status: NumberStatus;
  user_name?: string;
  user_lastname?: string;
  phone?: string;
  reserved_at?: string;
  paid_at?: string;
}

export interface Settings {
  alias: string;
  holder: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  logo: string;
  primary_color: string;
  auto_message: string;
  live_stream_url?: string;
}

export interface DrawHistory {
  id: string;
  raffle_id: string;
  winner_number: number;
  winner_name: string;
  draw_date: string;
  video_url?: string;
}

