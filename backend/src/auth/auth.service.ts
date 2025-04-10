import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthPayloadDtoRegister } from './dto/auth-pay-load.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    login({ username, password }: AuthPayloadDto): Observable<{ token: string } | null> {
        return from(this.userRepository.findOne({ where: { email: username } })).pipe(
          switchMap(user => {
            if (!user) {
              return throwError(() => new NotFoundException('User nije pronadjen'));
            }
            return from(bcrypt.compare(password, user.password_hash)).pipe(
              map(isPasswordValid => {
                if (isPasswordValid) {
                  const { password_hash, ...userWithoutPassword } = user;
                  return { token: this.jwtService.sign(userWithoutPassword) };
                }
                return null;
              })
            );
          }),
          catchError(err => throwError(() => err))
        );
    }

}
