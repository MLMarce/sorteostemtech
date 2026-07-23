export type NumberStatus = 'available' | 'reserved' | 'paid' | 'winner';

export type RaffleStatus = 'draft' | 'active' | 'finished';

export interface Raffle {
  id: string;
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
}

export interface DrawHistory {
  id: string;
  raffle_id: string;
  winner_number: number;
  winner_name: string;
  draw_date: string;
  video_url?: string;
}
