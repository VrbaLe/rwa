import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from './entities/owner.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository, UpdateResult, Like } from 'typeorm';
import { from, map, mergeMap, Observable, switchMap, toArray } from 'rxjs';
import { Salon } from 'src/salon/entities/salon.entity';
import { OwnerDataDto } from './dto/ownerData.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Salon)
    private readonly salonRepository: Repository<Salon>,
  ) { }

  
  create(ownerData: CreateOwnerDto): Observable<User> {
    const user = new User();
    user.email = ownerData.email;
    user.password = ownerData.password;

    const owner = new Owner();
    owner.name = ownerData.name;
    owner.about = ownerData.about;
    owner.instagram = owner.instagram;

    user.owner = owner;

    return from(this.ownerRepository.save(owner)).pipe(
      switchMap(savedOwner => {
        user.owner = savedOwner;
        return from(this.userRepository.save(user));
      })
    );
  }

  findAll(): Observable<OwnerDataDto[]> {
    return from(this.ownerRepository.find(
      {relations: ['salon']}
    )).pipe(
      map(owners =>
        owners.map(owner=> ({
          id: owner.id,
          name: owner.name,
          picture: owner.picture,
          about: owner.about,
          instagram: owner.instagram
        })),
      ),
    );
  }

  findOne(id: number): Observable<Owner> {
    return from(this.ownerRepository.findOne(
      {
        where: {id: id},
        relations: ['']
      }
    ));
  }

  update(id: number, ownerData: UpdateOwnerDto): Observable<UpdateResult>{
    return from(this.ownerRepository.update(id, ownerData));
  }

  remove(id: number): Observable<void> {
    return from(this.ownerRepository.delete(id)).pipe(map(() => undefined));
  }
}
