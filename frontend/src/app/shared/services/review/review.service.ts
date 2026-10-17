import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateReviewDto } from '../../dtos/create-review.dto';
import { ReviewDto } from '../../dtos/review.dto';
import { ReviewDataDto } from '../../dtos/review-data.dto';
import { DeleteResultDto } from '../../dtos/delete-results.dto';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  create(review: CreateReviewDto): Observable<ReviewDto> {
    return this.http.post<ReviewDto>(`${this.apiUrl}/reviews`, review);
  }

  loadSalonReviews(salonId: number, skip: number, limit: number): Observable<ReviewDataDto[]> {
    const params = new HttpParams().set('page', skip).set('limit', limit);
    return this.http.get<ReviewDataDto[]>(`${this.apiUrl}/reviews/book-review/${salonId}`, { params });
  }

  deleteReview(id: number): Observable<DeleteResultDto> {
    return this.http.delete<DeleteResultDto>(`${this.apiUrl}/reviews/${id}`);
  }
}
