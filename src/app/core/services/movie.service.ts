import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Movie, MoviesResponse } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://ghibliapi.vercel.app/films';

  getMovies(): Observable<MoviesResponse> {
    return this.http.get<MoviesResponse>(this.apiUrl);
  }

  /** Requests one film by its API id. */
  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
}
