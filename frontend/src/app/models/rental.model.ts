export interface Rental {
  id?: string;
  user_id: string;
  movie_id: string;
  movie_title: string;
  movie_poster: string;
  rental_start: string;
  rental_expiry: string;
  status: 'active' | 'expired' | 'cart';
  amount_paid: number;
  rental_duration_hours: number;
}