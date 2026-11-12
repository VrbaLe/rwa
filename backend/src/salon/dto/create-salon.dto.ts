import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateSalonDto{
    id: number;
    owner:number;
    name: string;
    description: string;
    image: string;
    category: string;
    city: string;
    address?: string;
    latitude?: string | number;
    longitude?: string | number;
    tags?: string;
    openTime?: string;
    closeTime?: string;
    workingDays?: string;
}
