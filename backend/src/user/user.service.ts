import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { from,map, Observable } from 'rxjs';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }


  create(createUserDto: CreateUserDto): Observable<User> {
    const user = this.userRepository.create(createUserDto);
    return from(this.userRepository.save(user));
  }

  findAll() :Observable<User[]>{
    return from(this.userRepository.find());
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({
      where: {id: id},
      relations: ['owner']
    }));
  }

  remove(id: number): Observable<void> {
    return from(this.userRepository.delete(id)).pipe(map(() => undefined));
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update({ id }, updateUserDto);
    return user;
  }
}
