import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateOwnerDto extends CreateUserDto{
    name: string;
    about?: string;
    picture?: string;
    instagram?: string;
}
