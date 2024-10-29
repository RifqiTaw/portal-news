import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NytimesService {
  private apiKey = environment.nyTimesApiKey;
  private topMostUrl = `https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json?api-key=${this.apiKey}`;
  private categoryUrl = `https://api.nytimes.com/svc/topstories/v2`; // URL dasar untuk Top Stories

  constructor(private http: HttpClient) {}

  private topMostArticlesSubject = new BehaviorSubject<any[]>([]);
  topMostArticles$ = this.topMostArticlesSubject.asObservable();

  private categoryArticlesSubject = new BehaviorSubject<any[]>([]);
  categoryArticles$ = this.categoryArticlesSubject.asObservable();

  // Mengambil berita terpopuler
  async getTopMostNews(): Promise<void> {
    try {
      const data = await this.http.get<any>(this.topMostUrl).toPromise();
      this.topMostArticlesSubject.next(data.results);
    } catch (error) {
      console.error('Error fetching top most news:', error);
    }
  }

  // Mengambil berita berdasarkan kategori
  async getCategoryNews(category: string): Promise<void> {
    try {
      const data = await this.http
        .get<any>(`${this.categoryUrl}/${category}.json?api-key=${this.apiKey}`)
        .toPromise();
      this.categoryArticlesSubject.next(data.results);
    } catch (error) {
      console.error(`Error fetching category news (${category}):`, error);
    }
  }
}
