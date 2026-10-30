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
    tags?: string;
}
