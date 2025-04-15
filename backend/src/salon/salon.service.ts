import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Like } from 'typeorm';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entities/salon.entity';
import { from, map, mergeMap, Observable, switchMap, toArray } from 'rxjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SalonService {
  


  findAll() {
    return `This action returns all salon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salon`;
  }

  update(id: number, updateSalonDto: UpdateSalonDto) {
    return `This action updates a #${id} salon`;
  }

  remove(id: number) {
    return `This action removes a #${id} salon`;
  }
}
