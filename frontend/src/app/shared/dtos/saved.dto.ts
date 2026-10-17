import { SalonInfoDto } from "./salon-info.dto";

export interface SavedDto {
    id: number;
    book: SalonInfoDto;
    created_at: Date;
}