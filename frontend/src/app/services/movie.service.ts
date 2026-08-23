import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private API_URL = 'https://vixen-film-vault.base44.app/api';
  private cache: Movie[] = [];

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    // Return cached data if available
    if (this.cache.length > 0) {
      return of(this.cache);
    }
    
    return this.http.get<Movie[]>(`${this.API_URL}/movies`)
      .pipe(
        tap(movies => this.cache = movies),
        catchError(() => {
          // Return sample movies on error
          const sampleMovies = this.getSampleMovies();
          this.cache = sampleMovies;
          return of(sampleMovies);
        })
      );
  }

  getFeaturedMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.API_URL}/movies/featured`)
      .pipe(
        catchError(() => {
          const sampleMovies = this.getSampleMovies();
          return of(sampleMovies.filter(m => m.is_featured));
        })
      );
  }

  getMovie(id: string): Observable<Movie> {
    // Check cache first
    const cached = this.cache.find(m => m.id === id);
    if (cached) {
      return of(cached);
    }
    
    return this.http.get<Movie>(`${this.API_URL}/movies/${id}`)
      .pipe(
        catchError(() => {
          const sample = this.getSampleMovies().find(m => m.id === id);
          return of(sample || this.getSampleMovies()[0]);
        })
      );
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.API_URL}/movies`, movie);
  }

  updateMovie(id: string, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.API_URL}/movies/${id}`, movie);
  }

  deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/movies/${id}`);
  }

  private getSampleMovies(): Movie[] {
    return [
      { id: '1', title: 'The Astral Frontier', director: 'Sofia Reyes', genre: 'Sci-Fi', year: 2024, rating: 4.3, rental_price: 45, rental_duration_hours: 48, is_featured: true, age_rating: 'PG-13', description: 'A journey beyond the stars.', duration_minutes: 120, poster_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80', cast: 'Sofia Reyes, John Smith' },
      { id: '2', title: 'Oppenheimer', director: 'Christopher Nolan', genre: 'Drama', year: 2023, rating: 4.8, rental_price: 55, rental_duration_hours: 72, is_featured: false, age_rating: 'R', description: 'The man behind the bomb.', duration_minutes: 180, poster_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80', cast: 'Cillian Murphy, Emily Blunt' },
      { id: '3', title: 'Dune: Part Two', director: 'Denis Villeneuve', genre: 'Sci-Fi', year: 2024, rating: 4.7, rental_price: 50, rental_duration_hours: 72, is_featured: false, age_rating: 'PG-13', description: 'The epic continues.', duration_minutes: 166, poster_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&q=80', cast: 'Timothée Chalamet, Zendaya' },
      { id: '4', title: 'Past Lives', director: 'Celine Song', genre: 'Romance', year: 2023, rating: 4.7, rental_price: 40, rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13', description: 'A love story across time.', duration_minutes: 105, poster_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80', cast: 'Greta Lee, Teo Yoo' },
      { id: '5', title: 'Poor Things', director: 'Yorgos Lanthimos', genre: 'Comedy', year: 2023, rating: 4.2, rental_price: 45, rental_duration_hours: 48, is_featured: false, age_rating: 'R', description: 'A fantastical tale.', duration_minutes: 141, poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80', cast: 'Emma Stone, Mark Ruffalo' },
      { id: '6', title: 'Killers of the Flower Moon', director: 'Martin Scorsese', genre: 'Crime', year: 2023, rating: 4.5, rental_price: 55, rental_duration_hours: 72, is_featured: false, age_rating: 'R', description: 'A true crime epic.', duration_minutes: 206, poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80', cast: 'Leonardo DiCaprio, Robert De Niro' },
      { id: '7', title: 'Midnight Run', director: 'Elena Marlowe', genre: 'Action', year: 2022, rating: 4.4, rental_price: 42, rental_duration_hours: 48, is_featured: false, age_rating: '16', description: 'One night. One impossible escape.', duration_minutes: 114, poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80', cast: 'Nia Cole, Marcus Vale' },
      { id: '8', title: 'The Last Summit', director: 'Jon Bell', genre: 'Adventure', year: 2021, rating: 4.1, rental_price: 40, rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13', description: 'The mountain keeps its secrets.', duration_minutes: 108, poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', cast: 'Ava Stone, Theo Grant' },
      { id: '9', title: 'Paper Wings', director: 'Mina Park', genre: 'Animation', year: 2020, rating: 4.6, rental_price: 38, rental_duration_hours: 48, is_featured: false, age_rating: 'PG', description: 'A small dream takes flight.', duration_minutes: 96, poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80', cast: 'Lena Hart, Omar Reed' },
      { id: '10', title: 'The Quiet House', director: 'Ruth Ellis', genre: 'Horror', year: 2022, rating: 4.0, rental_price: 44, rental_duration_hours: 48, is_featured: false, age_rating: '18', description: 'Some rooms should stay empty.', duration_minutes: 102, poster_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&q=80', cast: 'Mara Bell, Isaac Cole' },
      { id: '11', title: 'After the Rain', director: 'Noah Kim', genre: 'Thriller', year: 2023, rating: 4.2, rental_price: 46, rental_duration_hours: 48, is_featured: false, age_rating: '16', description: 'Every answer leaves a new question.', duration_minutes: 118, poster_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80', cast: 'Iris Shaw, Daniel West' },
      { id: '12', title: 'Wild Honey', director: 'Clara James', genre: 'Documentary', year: 2024, rating: 4.5, rental_price: 35, rental_duration_hours: 48, is_featured: false, age_rating: 'PG', description: 'A portrait of patience and place.', duration_minutes: 89, poster_url: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=1200&q=80', cast: 'Clara James' },
      { id: '13', title: 'The Clockmaker', director: 'Victor Lane', genre: 'Fantasy', year: 2021, rating: 4.3, rental_price: 43, rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13', description: 'Time is not as fixed as it seems.', duration_minutes: 127, poster_url: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1200&q=80', cast: 'Elias Moore, June Hart' },
      { id: '14', title: 'Bright Side', director: 'Amara Wells', genre: 'Comedy', year: 2022, rating: 4.0, rental_price: 39, rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13', description: 'A bad week finds its funny side.', duration_minutes: 101, poster_url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1200&q=80', cast: 'Amara Wells, Ben Fox' },
      { id: '15', title: 'Letters to June', director: 'Sofia Reed', genre: 'Romance', year: 2020, rating: 4.4, rental_price: 41, rental_duration_hours: 48, is_featured: false, age_rating: 'PG-13', description: 'Some stories take years to arrive.', duration_minutes: 110, poster_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80', cast: 'June Ellis, Theo Park' },
      { id: '16', title: 'Red Dust', director: 'Kofi Mensah', genre: 'Drama', year: 2022, rating: 4.6, rental_price: 47, rental_duration_hours: 72, is_featured: false, age_rating: '16', description: 'A family returns to the road home.', duration_minutes: 132, poster_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80', cast: 'Kofi Mensah, Ada Grey' },
      { id: '17', title: 'Neon City', director: 'Kai Torres', genre: 'Sci-Fi', year: 2025, rating: 4.5, rental_price: 52, rental_duration_hours: 72, is_featured: false, age_rating: '16', description: 'The future has a pulse.', duration_minutes: 124, poster_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&q=80', cast: 'Kai Torres, Mei Lin' },
      { id: '18', title: 'The Long Game', director: 'Harper Cole', genre: 'Crime', year: 2024, rating: 4.2, rental_price: 49, rental_duration_hours: 72, is_featured: false, age_rating: '16', description: 'Everyone has an angle.', duration_minutes: 119, poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80', backdrop_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80', cast: 'Harper Cole, Miles Young' },
    ];
  }
}