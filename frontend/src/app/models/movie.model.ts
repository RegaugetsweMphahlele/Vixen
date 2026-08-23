export interface Movie {
  id?: string;
  title: string;
  description: string;
  genre: 'Action' | 'Adventure' | 'Animation' | 'Comedy' | 'Drama' | 
          'Horror' | 'Romance' | 'Sci-Fi' | 'Thriller' | 'Documentary' | 
          'Fantasy' | 'Crime';
  year: number;
  duration_minutes: number;
  rating: number;
  poster_url: string;
  backdrop_url: string;
  director: string;
  cast: string;
  rental_price: number;
  rental_duration_hours: number;
  is_featured: boolean;
  age_rating: string;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
}

export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 
  'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 
  'Fantasy', 'Crime'
] as const;

export type Genre = typeof GENRES[number];