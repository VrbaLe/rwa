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
import { Owner } from 'src/owner/entities/owner.entity';
import { CreateOwnerDto } from 'src/owner/dto/create-owner.dto';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Owner)
        private ownerRepository: Repository<Owner>
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

    registerOwner({ email, password, firstName,lastName, instagram }: CreateOwnerDto): Observable<{ token: string }> {
      return from(this.userRepository.findOne({ where: { email } })).pipe(
          switchMap(existingUser => {
              if (existingUser) {
                  return throwError(() => new ConflictException('Korisnik sa ovim email-om već postoji'));
              }
              return from(bcrypt.hash(password, 10)).pipe(
                  switchMap(hashedPassword => {
                      const user = new User();
                      user.email = email;
                      user.password = hashedPassword;
                      user.role = 'owner';
  
                      return from(this.userRepository.save(user)).pipe(
                          switchMap(savedUser => {
                              const owner = new Owner();
                              owner.firstName=firstName;
                              owner.lastName=lastName;
                              owner.instagram = instagram;
                              owner.user = savedUser;
  
                              return from(this.ownerRepository.save(owner)).pipe(
                                  map(savedOwner => {
                                      savedUser.owner = savedOwner;
                                      const { password, ...userWithoutPassword } = savedUser;
                                      const { owner, ...userWithoutOwner } = userWithoutPassword;
                                      return { token: this.jwtService.sign(userWithoutOwner) };
                                  })
                              );
                          })
                      );
                  })
              );
          }),
          catchError(err => throwError(() => err))
      );
    }

    // login({ username, password }: AuthPayloadDto): Observable<{ token: string }> {
    //     return from(this.userRepository.findOne({ where: { email: username } })).pipe(
    //       switchMap(user => {
    //         if (!user) {
    //           return throwError(() => new NotFoundException('User nije pronadjen'));
    //         }
    //         return from(bcrypt.compare(password, user.password)).pipe(
    //           map(isPasswordValid => {
    //             if (isPasswordValid) {
    //               const { password, ...userWithoutPassword } = user;
    //               return { token: this.jwtService.sign(userWithoutPassword)   };  
    //             }
    //             return null;
    //           })
    //         );
    //       }),
    //       catchError(err => throwError(() => err))
    //     );
    // }
    login({ username, password }: AuthPayloadDto): Observable<{ token: string }> {
  return from(this.userRepository.findOne({ where: { email: username } })).pipe(
    switchMap(user => {
      if (!user) {
        return throwError(() => new UnauthorizedException('Pogrešan email ili lozinka'));
      }
      return from(bcrypt.compare(password, user.password)).pipe(
        map(isPasswordValid => {
          if (!isPasswordValid) {
            throw new UnauthorizedException('Pogrešan email ili lozinka');
          }
          const { password, ...userWithoutPassword } = user;
          return { token: this.jwtService.sign(userWithoutPassword) };
        })
      );
    })
  );
}   

    changePassword(userId: number, oldPassword: string, newPassword: string): Observable<{ message: string }> {
      return from(this.userRepository.findOne({ where: { id: userId } })).pipe(
          switchMap(user => {
              if (!user) {
                  return throwError(() => new NotFoundException('User nije pronadjen'));
              }
              return from(bcrypt.compare(oldPassword, user.password)).pipe(
                  switchMap(isOldPasswordValid => {
                      if (!isOldPasswordValid) {
                          return throwError(() => new UnauthorizedException('Stara lozinka nije tačna'));
                      }
                      return from(bcrypt.hash(newPassword, 10)).pipe(
                          switchMap(hashedPassword => {
                              user.password = hashedPassword;
                              return from(this.userRepository.save(user)).pipe(
                                  map(() => ({ message: 'Lozinka je uspešno promenjena' }))
                              );
                          })
                      );
                  })
              );
          }),
          catchError(err => throwError(() => err))
      );
    } 
}
