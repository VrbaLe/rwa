
export interface ReviewDto {
  id: number;
  rate: number;
  comment: string;
  created_at: string;
  user?: { id: number };
}