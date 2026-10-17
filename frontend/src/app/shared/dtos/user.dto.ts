import { OwnerDto } from "./owner.dto";
import { ReviewDto } from "./review.dto";
import { AppointmentDto } from "./appointment.dto";

export interface UserDataDto {
  id: number;
  email: string;
  created_at: Date | null;
  owner: OwnerDto | null;
  reviews: ReviewDto[] | null;
  appointments: AppointmentDto[] | null;
}

export interface UserDataStoreDto {
  id: number;
  email: string;
  created_at: Date | null;
  owner: OwnerDto | null;
  reviews: number[] | null;
  appointments: number[] | null;
}

export interface UserShortDto {
  id: number;
  email: string;
  created_at: Date | null;
}