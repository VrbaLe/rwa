import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Like, ILike } from 'typeorm';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entities/salon.entity';
import { from, map, mergeMap, Observable, switchMap, toArray } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { PaginationDto } from 'src/pagination/paginate.dto';
import { SalonInfo } from './dto/salon-info.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>
  ){}

  create(salonData: CreateSalonDto): Observable<Salon> {
    return from(this.ownerRepository.findOneBy({ id: salonData.owner })).pipe(
      switchMap((owner) => {
        if (!owner) {
          throw new Error('Owner not found');
        }
        
        const salon = new Salon();
        salon.name = salonData.name;
        salon.description = salonData.description;
        salon.image = salonData.image;
        salon.category = salonData.category;
        salon.tags = salonData.tags;
        salon.owner = owner;

        return from(this.salonRepository.save(salon));
      }),
    );
  }

  findAll(pagination: PaginationDto): Observable<SalonInfo[]> {
    return from(this.salonRepository.find({
       relations: ['owner'] ,
       skip: pagination.skip,
       take: pagination.limit
      })).pipe(
      map(salons => 
        salons.map(salon => ({
            id: salon.id,
            owner: salon.owner,
            name: salon.name,
            description: salon.description,
            image: salon.image,
            category: salon.category,
            tags: salon.tags,
        }))
      )
    )
  }

  findOne(id: number): Observable<SalonInfo> {
    return from(this.salonRepository.findOne({where: {id: id}, relations: ['owner']}));
  }

  searchSalon(text: string): Observable<SalonInfo[]> {
    return from(this.salonRepository.find({
      relations: ['reviews'],
      where: { name: ILike(`${text}%`)}
    }));
  }

  deleteSalon(id: number): Observable<DeleteResult>{
    return from(this.salonRepository.delete({id}));
  }
}
