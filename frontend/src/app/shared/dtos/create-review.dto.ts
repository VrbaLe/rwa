export interface CreateReviewDto {
  user_id: number;
  salon_id: number;
  rate: number;
  comment: string;
}