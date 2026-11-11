export interface SalonFilterDto {
  city: string;
  category: string;
  search: string;
  minRating: number;
  maxDistance: number;     
  onlyFavorites: boolean;
  sortBy: 'rating' | 'reviews' | 'name' | 'newest' | 'distance';
  order: 'ASC' | 'DESC';
}