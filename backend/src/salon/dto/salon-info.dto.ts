import { Owner } from "src/owner/entities/owner.entity";

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
}