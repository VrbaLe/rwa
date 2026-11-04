export interface TreatmentDto {
  id: number;
  name: string;
  price: number;
  duration: number;
}

export interface CreateTreatmentDto {
  salon_id: number;
  name: string;
  price: number;
  duration: number;
}