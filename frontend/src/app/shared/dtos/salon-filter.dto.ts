export interface SalonFilterDto {
  city: string;
  category: string;
  search: string;
  sortBy: 'rating' | 'name' | 'newest';
  order: 'ASC' | 'DESC';
}