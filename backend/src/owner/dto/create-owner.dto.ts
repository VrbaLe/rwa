import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateOwnerDto extends CreateUserDto{
    firstName: string;
    lastName:string;
    about?: string;
    picture?: string;
    instagram?: string;
    linkedin?: string;
}
