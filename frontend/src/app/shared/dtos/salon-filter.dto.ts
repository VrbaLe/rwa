export interface SalonFilterDto {
  city: string;
  category: string;
  search: string;
  minRating: number;
  sortBy: 'rating' | 'reviews' | 'name' | 'newest';
  order: 'ASC' | 'DESC';
}