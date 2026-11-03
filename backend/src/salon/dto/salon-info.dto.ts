import { Owner } from "src/owner/entities/owner.entity";
import { TreatmentInfo } from 'src/treatments/dto/treatment-info.dto';

export class SalonInfo {
    id: number;
    owner: Owner;
    name: string;
    description: string;
    image: string;
    category: string;    
    city: string;
    address?: string;
    tags?: string;
    openTime: string;
    closeTime: string;
    workingDays: string;
    treatments: TreatmentInfo[];
}