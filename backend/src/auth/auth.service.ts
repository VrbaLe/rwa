import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthPayloadDtoRegister } from './dto/auth-pay-load.dto';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    registerUser({ email, password}: CreateUserDto): Observable<{ token: string }> {
        return from(this.userRepository.findOne({ where: { email: email } })).pipe(
          switchMap(existingUser => {
            if (existingUser) {
              return throwError(() => new ConflictException('Korisnik sa ovim email-om već postoji'));
            }
            return from(bcrypt.hash(password, 10)).pipe(
              switchMap(hashedPassword => {
                const newUser = this.userRepository.create({
                  email,
                  password: hashedPassword,
                  role: 'user'
                });
                return from(this.userRepository.save(newUser)).pipe(
                  map(savedUser => {
                    const { password, ...userWithoutPassword } = savedUser;
                    return { token: this.jwtService.sign(userWithoutPassword) };
                  })
                );
              })
            );
          }),
          catchError(err => throwError(() => err))
        );
    }

    login({ username, password }: AuthPayloadDto): Observable<{ token: string }> {
        return from(this.userRepository.findOne({ where: { email: username } })).pipe(
          switchMap(user => {
            if (!user) {
              return throwError(() => new NotFoundException('User nije pronadjen'));
            }
            return from(bcrypt.compare(password, user.password)).pipe(
              map(isPasswordValid => {
                if (isPasswordValid) {
                  const { password, ...userWithoutPassword } = user;
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
