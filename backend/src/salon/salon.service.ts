import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Like, ILike } from 'typeorm';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entities/salon.entity';
import { from, map, mergeMap, Observable, switchMap, toArray, throwError } from 'rxjs';
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

  create(salonData: CreateSalonDto, userId:number): Observable<Salon> {
    return from(
      //this.ownerRepository.findOneBy({ id: salonData.owner })
      this.ownerRepository.findOne({ where: { user: { id: userId } } }),

    ).pipe(
      switchMap((owner) => {
        if (!owner) {
          throw new Error('Owner not found');
        }
        
        const salon = new Salon();
        salon.name = salonData.name;
        salon.description = salonData.description;
        salon.image = salonData.image;
        salon.category = salonData.category;
        salon.city = salonData.city;
        salon.address = salonData.address;
        salon.tags = salonData.tags;
        salon.owner = owner;
        salon.openTime = salonData.openTime || '09:00';
        salon.closeTime = salonData.closeTime || '17:00';
        salon.workingDays = salonData.workingDays || '1,2,3,4,5,6';

        return from(this.salonRepository.save(salon));
      }),
    );
  }

  findAll(pagination: PaginationDto): Observable<SalonInfo[]> {
    return from(this.salonRepository.find({
       relations: ['owner','reviews', 'treatments'] ,
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
            city: salon.city,
            address: salon.address,
            tags: salon.tags,
            reviews: (salon.reviews ?? []).map(r => ({
              id: r.id,
              rate: r.rate,
              comment: r.comment,
              created_at: r.created_at,
              user: r.user ? { id: r.user.id } : undefined,
            })),
            openTime: salon.openTime,
            closeTime: salon.closeTime,
            workingDays: salon.workingDays,
            treatments: (salon.treatments ?? []).map((treatment) => ({
              id: treatment.id,
              name: treatment.name,
              price: treatment.price,
              duration: treatment.duration,
            })),
        }))
      )
    )
  }

  findOne(id: number): Observable<SalonInfo> {
    return from(this.salonRepository.findOne({where: {id: id}, relations: ['owner','reviews']}));
  }

  searchSalon(text: string): Observable<SalonInfo[]> {
    return from(this.salonRepository.find({
      relations: ['reviews'],
      where: { name: ILike(`${text}%`)}
    }));
  }

  update(id: number, dto: UpdateSalonDto, userId: number): Observable<SalonInfo> {
    return from(
      this.salonRepository.findOne({ where: { id }, relations: { owner: { user: true } } }),
    ).pipe(
      switchMap((salon) => {
        if (!salon) {
          return throwError(() => new NotFoundException('Salon nije pronađen'));
        }
        if (salon.owner?.user?.id !== userId) {
          return throwError(() => new ForbiddenException('Nemate pravo da menjate ovaj salon'));
        }

        const fields = [
          'name', 'description', 'category', 'city', 'tags',
          'image', 'openTime', 'closeTime', 'workingDays',
        ] as const;

        fields.forEach((field) => {
          const value = dto[field];
          if (value !== undefined && value !== '') {
            salon[field] = value;
          }
        });

        return from(this.salonRepository.save(salon));
      }),
      switchMap((saved) => this.findOne(saved.id)),
    );
  }

  deleteSalon(id: number): Observable<DeleteResult>{
    return from(this.salonRepository.delete({id}));
  }
}
